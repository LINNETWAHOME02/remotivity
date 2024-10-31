// Task validation middleware
const validateTaskInput = (req, res, next) => {
    const { name, startTime, endTime } = req.body;
    console.log(req.body, 'what')
  
    const errors = {};
  
    if (!name || name.trim().length === 0) {
      errors.name = 'Task name is required';
    }
  
    if (!startTime) {
      errors.startTime = 'Start time is required';
    }
  
    if (!endTime) {
      errors.endTime = 'End time is required';
    }
  
    if (startTime && endTime && new Date(startTime) > new Date(endTime)) {
      errors.time = 'Start time cannot be after end time';
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
  
    next();
  };


  module.exports = validateTaskInput;