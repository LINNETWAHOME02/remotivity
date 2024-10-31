const express = require('express');
const validateTaskInput = require('../validations/validateTask');
const { createTask } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');


const router = express.Router();

// Signup route
router.post('/create',validateTaskInput,authenticateToken, createTask);
router.get('/check-cookie', (req, res) => {
    console.log(req.cookies, 'cookies')
    res.json(req.cookies);
  });


module.exports = router;