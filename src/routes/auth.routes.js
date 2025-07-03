import express from 'express';
import {getProfile, loginUser, logoutUser, registerUser} from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js';


const router = express.Router()

router.post('/register' , registerUser)
router.post('/login' , loginUser)
router.post('/logout' , logoutUser)
router.get('/profile' , authMiddleware, getProfile)


export default router