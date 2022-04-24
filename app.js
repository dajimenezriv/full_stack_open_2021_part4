// refactor the code to eliminate the catch when doing async operations
// automatically does next(exception)
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');

const app = express();
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error connecting to MongoDB:', error.message));

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// the useExtractor middleware is only executed with blogRouter
app.use('/api/blogs', middleware.userExtractor, blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

// we add the API endpoint testing to reset in the database
if (process.env.NODE_ENV === 'test') app.use('/api/testing', testingRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
