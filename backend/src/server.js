const express = require('express');
const passport = require('./config/passport');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const taskRoutes = require('./api/routes/taskRoutes');
const authRoutes = require('./api/routes/authRoutes');
const { filterAuthData } = require('./api/middleware/security');

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

app.use(express.json());
app.use(passport.initialize());
//app.use(cors());//all origins
app.use(cors(corsOptions)); //specific origins
app.use(helmet());
app.use(morgan('dev'));

app.use(filterAuthData());

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
