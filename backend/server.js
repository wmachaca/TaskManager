const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const taskRoutes = require('./routes/taskRoutes');

require('dotenv').config();
require('./config/passport'); //then move to src

// Validate FRONTEND_URL on startup
if (!process.env.FRONTEND_URL) {
  console.error('FATAL: FRONTEND_URL is not defined in .env');
  process.exit(1);
}

//only for specific origin
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow requests only from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
};

const authRoutes = require('./routes/authRoutes');
const app = express();

app.use(express.json());
//app.use(cors());//all origins
app.use(cors(corsOptions)); //specific origins
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ message: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
