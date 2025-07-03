import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const authMiddleware = asyncHandler (async (req , res , next) => {
    try {
        const token = req.cookies?.token || req.cookies?.adminToken

        if(!token){
            throw new ApiError(401 , "Unauthorized: No token provided")
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET)

        console.log("Decoded JWT payload:", decoded);

        req.user = {
            id : decoded.id ,
            email : decoded.email,
            role: decoded.role || 'user'
        }

        next()
    } catch (error) {
        next(new ApiError(401 , "Unauthorized: Invalid token"))
    }
}) 