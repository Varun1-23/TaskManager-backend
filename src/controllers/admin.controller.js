import User from '../models/user.model.js'
import Task from '../models/task.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'


export const adminLogin = asyncHandler(async (req, res) => {
    const {email , password} = req.body

    // console.log("Admin login attempt:", email);
    // console.log("Admin ENV:", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    // console.log("ADMIN ENV", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    // console.log("REQUEST BODY", email, password);
    
    if(email !== adminEmail || password !== adminPassword){
        throw new ApiError(401, 'Invalid email or password')
    }

    const token = jwt.sign({id: 'admin_id', email: adminEmail, role: 'admin'}, process.env.JWT_SECRET, {expiresIn: '1d'})
    console.log("Admin logged in, JWT created");
    console.log("✅ Token generated for admin:", token);


res.clearCookie('token');
res.cookie('adminToken', token , {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
})

console.log("📤 Sending token as cookie: adminToken");

return res
.status(200)
.json(new ApiResponse(200 , {role:'admin'} , "Admin logged in"))

})

export const getAllUsersWithTasks = asyncHandler(async (req, res) => {
    console.log("👉 Reached getAllUsersWithTasks");
    console.log("Authenticated admin:", req.user);  // See who is logged in
    const users = await User.find({ role: { $ne : 'admin'}}).select('username email')
     console.log("✅ Users fetched:", users.length);
    const tasks = await Task.aggregate([
        {
            $group: {
                _id: '$user',
                taskCount: {
                    $sum: 1
                }
            }
        }
    ])
        console.log("✅ Task counts aggregated:", tasks.length);

    const userTaskMap = {}
    tasks.forEach(t => userTaskMap[t._id] = t.taskCount)

    const userWithTaskCount = users.map(user => ({
        ...user.toObject(),
        taskCount: userTaskMap[user._id] || 0
    }))

    console.log("✅ Final result to send:", userWithTaskCount.length);

    return res
    .status(200)
    .json(new ApiResponse(200 , {users: userWithTaskCount} , "Users with tasks"))
})

export const adminLogout = asyncHandler(async(req , res) => {
    res.clearCookie('adminToken' , {
        httpOnly: true,
        secure: process.env.NODE_ENV,
        sameSite: "Lax"
    })

    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "Admin logged out successfully"))
})

