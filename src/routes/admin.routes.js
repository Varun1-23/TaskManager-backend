import express from 'express';
import { adminLogin , adminLogout, getAllUsersWithTasks } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/isAdmin.js';



const router = express.Router();

router.post('/login' , adminLogin)
router.get('/users' ,authMiddleware, isAdmin, getAllUsersWithTasks)
router.post('/logout', adminLogout)

export default router;