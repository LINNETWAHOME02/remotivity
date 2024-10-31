const express = require('express');
const validateTaskInput = require('../validations/validateTask');
const { createTask, getTasks, deleteTask } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');


const router = express.Router();

// Signup route
router.post('/create',validateTaskInput,authenticateToken, createTask);
router.get('/tasks', authenticateToken, getTasks);
router.delete('/:id', authenticateToken, deleteTask);



module.exports = router;