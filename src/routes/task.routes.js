import express from 'express';
import { createTask , getMyTasks , getTaskById , updateTask , deleteTask  } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post('/create', authMiddleware, createTask)
router.get('/mytasks', authMiddleware, getMyTasks)
router.get('/:id', authMiddleware, getTaskById)
router.put('/:id', authMiddleware, updateTask)
router.delete('/:id', authMiddleware, deleteTask)


export default router