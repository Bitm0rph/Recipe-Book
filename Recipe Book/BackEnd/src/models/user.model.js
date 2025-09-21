import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'username is required'],
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'email is required'],
        lowercase: true,
        trim: true
    },
    avatar: {
        type: String
    },
    coverImage: {
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Recipe"
        }
    ],
    password: {
        type: String,
        required: [true, 'password is required']
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });


// Encrypting the password
// Here, we can't use arrow function bcoz in arrow function we don't have reference to 'this', which is required here
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    const rounds = 10
    this.password = bcrypt.hash(this.password,rounds)
    next()
})

// Verifying the password
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

// generating access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export default model('User', userSchema);