const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/userRoutes')); // Mounts to /api/register
app.use('/api/professions', require('./routes/professionRoutes'));
app.use('/api/assessment', require('./routes/assessmentRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Pulse Employment API is running' });
});

// 404 Handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error Handler
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

module.exports = app;
