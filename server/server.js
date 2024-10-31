const dotenv = require('dotenv')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");


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
mongoose.connect(process.env.MONGO_URI, {dbName: 'tobbyba'})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));