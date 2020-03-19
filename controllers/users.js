const bcrypt = require('bcrypt');
const User = require('../database/User');
const BadReqError = require('../errors/bad-req');

module.exports.createUser = (req, res, next) => {
  const {
    login, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.createNewUser({
      login, password: hash,
    }))
    .then((user) => {
      if (user) {
        return res.send({ message: 'Пользователь создан' });
      }
      throw new BadReqError('Ошибка запроса');
    })
    .catch(next);
};
