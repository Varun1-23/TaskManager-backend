import User  from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'



const registerUser = asyncHandler (async (req , res , next) => {
        try {
            const { username , email , password } = req.body

            if(!username || !email || !password) {
                throw new ApiError(400 , "Please provide all fields")
            }
            const existingUser = await User.findOne({ email })
            if(existingUser){
                throw new ApiError(400 , "Email already exists")
            }

            const hashedPassword = await bcrypt.hash(password , 10)

            const user = await User.create({
                username,
                email,
                password: hashedPassword
            })
            res.status(201).json( new ApiResponse(201, {
                id: user._id,
                username: user.username,
                email: user.email
            }, "User registered successfully")
        );
        } catch (error) {
            next(error)
        }
})

export const loginUser = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            throw new ApiError(400, "Please provide all fields");
        }

        const user = await User.findOne({ email })
        if(!user){
            throw new ApiError(401, "User Not Found");
        }

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
            throw new ApiError(401, "Invalid Password");
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: "7d"})

        res.cookie("token",token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res
        .status(200)
        .json(new ApiResponse(200,
        {
            id: user._id,
            username: user.username,
            email: user.email,
            role:user.role
        }, "Login Successfully"))
    } catch (error) {
        next(error)
    }
})

export const logoutUser = asyncHandler(async (req, res, next) =>{
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Lax'
    })
    return res
    .status(200)
    .json(new ApiResponse(200 , {},  "Logged out Successfull"))
})

export const getProfile = (req ,res) => {
    return res
    .status(200)
    .json({
        success: true,
        user: req.user
    })
}



export {registerUser}