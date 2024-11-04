const Task = require('../models/Task'); // Tells our program how to handle tasks, like creating, finding, updating, or deleting them.

 // createTask controller
const  createTask = async (req, res) => {

    try {
      // Takes Task Info: It grabs the name, description, startTime, and endTime from what someone typed (req.body).
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

  // getTasks controller
  const getTasks = async (req, res) => {
    const user_id = req.user?._id;
  
    try {
      // Finds Tasks: It looks for all tasks linked to the logged-in user (user_id).
      const tasks = await Task.find({ user: user_id }).exec();
  
      // Sends Tasks: It returns the list of tasks to the user
      return res.status(200).json({
        success: true,
        tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching tasks'
      });
    }
  };
  

  // getUserTasks controller
  // Get all tasks for current user
  // Similar to getTasks, but it also sorts the tasks
 const getUserTasks = async (req, res) => {
    try {
      // Finds and Sorts Tasks: It finds tasks for the user and sorts them by startTime in descending order (newest tasks first)
      const tasks = await Task.find({ user: req.user._id })
        .sort({ startTime: -1 });

        // Sends Tasks: It sends back the sorted list
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

  // getTask controller
  // Get single task / retrieves a single task
 const getTask = async (req, res) => {
    try {
      // Finds Task: It looks for one specific task using the id from the request (req.params.id), making sure the task belongs to the current user.
      const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Sends Task: If the task is found, it sends it back
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

  // updateTask controller
 const updateTask = async (req, res) => {
    try {
      const { name, description, startTime, endTime } = req.body;

      // Updates Info: If found, it updates the task with any new name, description, startTime, or endTime provided
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

      // Finds the Task: It first checks if the task exists
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

      // Sends Back Confirmation: It confirms the task was updated successfully
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

  // deleteTask controller
  const deleteTask = async (req, res) => {
    console.log(req.body);
    try {
      // Finds the Task: It first checks if the task exists using its id
      const task = await Task.findOne({ _id: req.params.id, user: req.user._id});
      console.log(task, 'Task to be deleted')
  
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
  
      // Deletes Task: If found, it deletes the task
      // Use deleteOne instead of remove
      await Task.deleteOne({ _id: req.params.id });
  
      // Sends Back Confirmation: It confirms the task was deleted.
      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({
        success: false,
        message: 'Error while deleting task'
      });
    }
  };
  


module.exports = { createTask, getTasks, getUserTasks, getTask, updateTask, deleteTask };