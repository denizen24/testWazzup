const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const homeRoutes = require('./routes/home');
// const usersRoutes = require('./routes/users');
const tasksRoutes = require('./routes/tasks');
const auth = require('./middlewares/auth');
const { createUser } = require('./controllers/users');
const { login } = require('./controllers/login');
const { logout } = require('./controllers/logout');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const undfRoute = { message: 'Запрашиваемый ресурс не найден' };

const app = express();
require('dotenv').config();

app.use(requestLogger);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(helmet());

app.use('/', homeRoutes);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    login: Joi.string().required().min(6).max(50),
    password: Joi.string().required().min(5).max(50),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    login: Joi.string().required().min(2).max(50),
    password: Joi.string().required().min(5).max(50),
  }),
}), createUser);

app.post('/logout', celebrate({
  body: Joi.object().keys({
    login: Joi.string().required().min(6).max(50),
    password: Joi.string().required().min(5).max(50),
  }),
}), logout);

// app.use('/users', usersRoutes);
app.use('/tasks', auth, tasksRoutes);

app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.use('*', (req, res) => {
  res.status(404).send(undfRoute);
});

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   // eslint-disable-next-line no-console
//   console.log(`Server running at: http://localhost:${PORT}/`);
// });

module.exports = app;
