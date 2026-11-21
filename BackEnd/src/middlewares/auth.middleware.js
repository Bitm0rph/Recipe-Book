import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import dotenv from 'dotenv';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';

dotenv.config();

const getAuthenticatedUser = async (req) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Authorization denied");
        }

        return user;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(401, error.message);
    }
};

export const verifyJWT = asyncHandler(async (req, res, next) => {
    req.user = await getAuthenticatedUser(req);
    next();
});