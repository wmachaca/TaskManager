const express = require('express');
const passport = require('./config/passport');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const taskRoutes = require('./api/routes/taskRoutes');
const authRoutes = require('./api/routes/authRoutes');
const { filterAuthData } = require('./api/middleware/security');
const rateLimit = require('express-rate-limit');
const { prisma } = require('./database/client'); // Import Prisma client

require('dotenv').config();

//only for specific origin
const corsOptions = {
  //origin: 'http://localhost:3000', // Allow requests only from this origin
  //origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
};

const app = express();

console.log('Loaded FRONTEND_URL:', process.env.FRONTEND_URL); // Log the FRONTEND_URL-for deploy
// middleware setup
app.use(express.json());
app.use(passport.initialize());
//app.use(cors());//all origins
app.use(cors(corsOptions)); //specific origins
app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //100  Límite de 100 solicitudes por IP
  message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
});

app.use(limiter);

app.use(filterAuthData());

// Database connection check
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // Simple query to test connection
    res.json({ message: 'Database connected successfully' });
  } catch (error) {
    console.error('Database connection error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Database connection failed' });
  }
});

//Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); //Log the error
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
