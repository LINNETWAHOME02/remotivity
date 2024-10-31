const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth'); 
const taskRoutes = require('./routes/task'); 


const app = express();
dotenv.config();
// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Enable cookies with CORS
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {dbName: 'tobbyba'})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));