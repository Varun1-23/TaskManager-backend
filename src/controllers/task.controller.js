import Task from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// creating a task

export const createTask = asyncHandler (async (req , res , next) => {
    try {
        const { title , description , status , dueDate } = req.body;
        const userId = req.user.id

        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            user: userId
        })
        return res
        .status(201)
        .json(new ApiResponse(201 , {
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate
         }, "Task created successfully"))
    } catch (error) {
        next(error)
    }
})

// fetching all tasks

export const getMyTasks = asyncHandler (async (req , res , next ) => {
    try {
        const userId = req.user.id

        const tasks = await Task.find({
            user: userId,
        }).sort({ createdAt: - 1 })

        return res
        .status(200)
        .json(new ApiResponse(200 ,
             {tasks} ,
            "Tasks retrieved successfully"))
    } catch (error) {
        next(error)
    }
})

// get single Task

export const getTaskById = asyncHandler(async (req , res , next) =>{
    try {
        const task = await Task.findOne(
            {
                _id: req.params.id,
                user: req.user._id
            }
        )
        if(!task){
            throw new ApiError(404 , "Task not found")
        }
        return res
        .status(200)
        .json(new ApiResponse(200 , task , "fetched successfully"))
    } catch (error) {
        next(error)
    }
})

// update task

export const updateTask = asyncHandler(async (req , res , next) => {
    try {
        // console.log("Incoming update task request:");
        // console.log("ID:", req.params.id);
        // console.log("User:", req.user);
        // console.log("Body:", req.body);
        const task = await Task.findByIdAndUpdate(
            {
                _id: req.params.id ,
                user: req.user._id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
        if(!task){
            throw new ApiError(404 , "Task not found")
        }
        task.title = req.body.title ?? task.title;
        task.description = req.body.description ?? task.description;
        task.status = req.body.status ?? task.status;

        await task.save();
        return res
        .status(200)
        .json(new ApiResponse(200 , task , "updated successfully"))
    } catch (error) {
        next(error)
    }
})

// delete task

export const deleteTask = asyncHandler(async (req , res , next) => {
    try {
        // console.log("🔍 Delete Task Debug Logs:");
        const taskId = req.params.id;
        const userId = req.user?.id;
        // console.log(" Task ID from params:", taskId);
        // console.log(" Authenticated User ID:", userId);
        const task = await Task.findOneAndDelete(
            {
                _id: taskId ,
                user: userId
            }
        )
        if(!task){
            // console.log(" Task not found in DB.");
            throw new ApiError(404 , "Task not found")
        }
         if (task.user.toString() !== userId) {
        // console.log("🚫 User not authorized to delete this task.");
        throw new ApiError(403, "Not authorized to delete this task");
    }
        return res
        .status(200)
        .json(new ApiResponse(200 , task , "deleted successfully"))
    } catch (error) {
        next(error)
    }
})