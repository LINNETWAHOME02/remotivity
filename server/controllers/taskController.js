// controllers/taskController.js
const Task = require('../models/Task');

// Authentication middleware
const checkAuth = async (req, res, next) => {
  try {
    // Check if user exists in request (should be set by previous auth middleware)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};



// Task controllers
 // Create a new task
const  createTask = async (req, res) => {
    console.log(req.body, 'are you here')
  const user_id = req.user?.userId;

    try {
      const { name, description, startTime, endTime } = req.body;
      console.log(req.body, 'what')

      const task = await Task.create({
        name: name.trim(),
        description: description?.trim(),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        user: req.user._id
      });

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task
      });
    } catch (error) {
      console.error('Error creating task:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid task data',
          errors: Object.keys(error.errors).reduce((acc, key) => {
            acc[key] = error.errors[key].message;
            return acc;
          }, {})
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error creating task'
      });
    }
  }

  // Get all tasks for current user
 const getUserTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user._id })
        .sort({ startTime: -1 });

      return res.status(200).json({
        success: true,
        count: tasks.length,
        tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching tasks'
      });
    }
  }

  // Get single task
 const getTask = async (req, res) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      return res.status(200).json({
        success: true,
        task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching task'
      });
    }
  }

  // Update task
 const updateTask = async (req, res) => {
    try {
      const { name, description, startTime, endTime } = req.body;

      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
          name: name?.trim(),
          description: description?.trim(),
          startTime: startTime ? new Date(startTime) : task.startTime,
          endTime: endTime ? new Date(endTime) : task.endTime
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        task: updatedTask
      });
    } catch (error) {
      console.error('Error updating task:', error);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid task data',
          errors: Object.keys(error.errors).reduce((acc, key) => {
            acc[key] = error.errors[key].message;
            return acc;
          }, {})
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error updating task'
      });
    }
  }

  // Delete task
 const deleteTask = async (req, res) => {
    try {
      const task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      await task.remove();

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({
        success: false,
        message: 'Error deleting task'
      });
    }
  }


module.exports = { createTask, getUserTasks, getTask, updateTask, deleteTask, checkAuth };