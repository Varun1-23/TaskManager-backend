import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config()

const createAdmin = async () => {
    await mongoose.connect(process.env.MONGODB_URL)

    const existingAdmin = await User.findOne({ email: 'admin@example.com'})
    if(existingAdmin){
        console.log("Admin exists");
        return process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('admin123' , 10)

        await User.create({
            username: "admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin"
        })

        console.log("Admin user created successfully");
        process.exit(0)
    }

    createAdmin()

    

