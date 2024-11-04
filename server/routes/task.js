const express = require('express'); // helps manage servers and routes
const validateTaskInput = require('../validations/validateTask'); // Check if task input is valid
const { createTask, getTasks, deleteTask } = require('../controllers/taskController');
// Check if user has a valid membership, token, before allowing them to do anything
const { authenticateToken } = require('../middleware/authMiddleware');


const router = express.Router();

/*
    To create a task:
        1. validateTaskInput - checks if the task inputed is valid
        2. authenticateToken - checks if user has a valid token
        3. createTask - user can then add the task if all the above are validated
*/
router.post('/create',validateTaskInput, authenticateToken, createTask);

/*
    To get all tasks:
        1. authenticateToken - checks if user has a valid token
        2. getTasks - user can then get all tasks if the above is validated
*/
router.get('/tasks', authenticateToken, getTasks);

/*
    To delete a task:
        1. authenticateToken - checks if user has a valid token
        2. deleteTask - user can then delete the task if the above is validated
*/
router.delete('/:id', authenticateToken, deleteTask);



module.exports = router;