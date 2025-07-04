import express from 'express';
import { adminLogin , adminLogout, getAllUsersWithTasks } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';
import { isAdmin } from '../middlewares/isAdmin.js';



const router = express.Router();

router.post('/login' , adminLogin)
router.get('/users' ,verifyAdmin, isAdmin, getAllUsersWithTasks)
router.post('/logout', adminLogout)

export default router;