import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'
import adminRoutes from './routes/admin.routes.js'


// initial setup

dotenv.config()
const app = express()


// middleware pipeline

app.use(cors({
    origin: ['http://localhost:5173', 'https://taskmanager-frontend-livid.vercel.app' ],
    credentials: true
}))

app.use(express.json({ limit : '16kb'}))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())
app.use(express.static('public/temp'))

// database connection

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB connected');
        
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1)
    }
}
connectDB()



// routes

app.use('/api/v1/auth' , authRoutes)
app.use('/api/v1/tasks' , taskRoutes)
app.use('/api/v1/admin' , adminRoutes)

//health check endpoint

app.get('/api/health' , (req, res) => {
    res.status(200).json(
        {
            status: "Up",
            timestamp: new Date().toISOString(),
        }
    )
})


// error handling

app.use((err , req , res , next) => {
    console.log('Error: ', err);
    
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
            data: err.data || null
        })
    }


console.error('Unhandled Error:', err)
res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errors: [],
    data: null
})
})

// server start

const PORT = process.env.PORT || 7000
app.listen(PORT, ()=>{
    console.log(`Server Running on port ${PORT}`);
    console.log(`Base URL: http://localhost:${PORT}/api/v1`);
    
})