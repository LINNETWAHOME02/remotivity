const dotenv = require('dotenv') // Tells our program to load environment variables from a .env file
const express = require('express'); // Helps manage servers and routes
const mongoose = require('mongoose'); // Helps us communicate to the database, Mongo DB, where we keep all our tasks
const cors = require('cors'); // Cross-origin resource sharing
const bodyParser = require('body-parser'); // Parses the information received from the user, saving it in the req.body, helping us serve them better
const cookieParser = require("cookie-parser"); // Parses cookie info such that the next time the customer returns, we have little pieces of their information

// ROUTES
const authRoutes = require('./routes/auth'); 
const taskRoutes = require('./routes/task'); 


const app = express();

dotenv.config();

// Middleware
const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',  
  'http://localhost:3003',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {dbName: 'remotivity'})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));