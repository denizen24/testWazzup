const { Router } = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const Task = require('../database/Task');
const { requestLogger, errorLogger } = require('../middlewares/logger');

const router = Router();

router.use(requestLogger);

// router.get('/', (req, res) => {
//   res.send({ message: 'Tasks endpoint working' });
// });

router.get('/all', Task.getAllTasksUser);

// router.post('/create', Task.createTask);

router.post('/create', celebrate({
  body: Joi.object().keys({
    text: Joi.string().required().min(2).max(1000),
  }),
}), Task.createTask);

router.patch('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().min(1).max(6),
  }),
  body: Joi.object().keys({
    text: Joi.string().required().min(2).max(1000),
  }),
}), Task.updateTask);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().min(1).max(6),
  }),
}), Task.deleteTask);

router.get('/share/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().min(1).max(6),
  }),
}), Task.shareTask);

router.get('/free/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().min(1).max(10),
  }),
}), Task.getFreeTask);

router.use(errorLogger);
router.use(errors());

module.exports = router;
