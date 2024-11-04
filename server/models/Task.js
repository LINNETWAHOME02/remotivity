// models/Task.js
const mongoose = require('mongoose'); // helps us talk to the database, Mongo DB, where we keep all our tasks

// TaskSchema - Think of it as a rulebook or template that says what a task should look like
const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  // Each task belongs to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId is a special ID number given to each user
    // ref: 'Auth' means this ID comes from another blueprint or form called Auth, referencing the User model
    ref: 'Auth', required: true,
  },
}, { timestamps: true });

// { timestamps: true } - This automatically adds two extra pieces of information to every task:
        // createdAt: When the task was created.
        // updatedAt: When the task was last changed.


// Saves the TaskSchema in the database with the name 'Task'
module.exports = mongoose.model('Task', TaskSchema);
