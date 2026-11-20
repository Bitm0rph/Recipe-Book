import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the tokens", error)
    }
}

export const register = asyncHandler(async (req,res) => {
    const {username, email, password} = req.body

    if(
        !username || !email || !password ||
        [username,email,password].some(field => typeof field !== "string" || field.trim() === "") 
    ){
        throw new ApiError(400, "All fields (username, email, password) are required")
    }
    const existedUser = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email: email.toLowerCase() }
        ]
    })

    if(existedUser){
        throw new ApiError(409,"User with the username or email already exists")
    }

    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath = req.files.avatar[0].path;
    }

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    let avatar;
    if(avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath)
    }

    let coverImage;
    if(coverImageLocalPath){
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }

    // Creating the user
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        password
    })

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    // check if the user is created successfully
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Internal server error")
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return res
    .status(201)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: createdUser,
                accessToken,
                refreshToken
            },
            "User registered successfully"
        )
    )
})

export const login = asyncHandler(async (req,res) => {
    const {username, email, password} = req.body;

    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    if(!password){
        throw new ApiError(400,"password is required")
    }

    const user = await User.findOne({
        $or: [
            ...(username ? [{ username: username.toLowerCase() }] : []),
            ...(email ? [{ email: email.toLowerCase() }] : [])
        ]
    })
    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(401,"Password is invalid")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // Now we have to return cookies
    // Before that we will set some options(object)
    // It will ensure that the cookies are only modifiable in the server and others can only read them in the browser
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                // We had send accessToken and refreshToken in cookies previously,
                // Though we are sending them again here, so that the user can store them in the localStorage if he wish
                // This is a good practice
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

export const logout = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            // field to update
            $set: {
                refreshToken: undefined
            }
        },
        {
            // send the new data after updating
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out")
    )
})

export const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password")
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401,"Refresh token is expired")
        }
    
        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    
        return res
        .status(200)
        .cookie("accessToken",newAccessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error.message)
    }
})

export const changePassword = asyncHandler(async (req,res) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Old password is invalid")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

export const getCurrentUser = asyncHandler(async (req,res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Current user")
    );
})

export const updateDetails = asyncHandler(async (req,res) => {
    const {username, email} = req.body;
    if(!username || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email, username
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Fields updated successfully"))
})

export const updateAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Updated Avatar file not found")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar?.url){
        throw new ApiError(400,"Error while uploading updated avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

export const updateCoverImage = asyncHandler(async (req,res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"Updated CoverImage file not found")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage?.url){
        throw new ApiError(400,"Error while uploading updated CoverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage updated successfully"))
})