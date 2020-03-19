const jwt = require('jsonwebtoken');

const User = require('../database/User');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res) => {
  const { login, password } = req.body;

  return User.findUserByCredentials(login, password)
    .then((user) => {
      const token = jwt.sign(
        { id: user.id },
        (NODE_ENV === 'production' ? JWT_SECRET : 'secret-key'),
        { expiresIn: '1d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 1,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'авторизация - OK' })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
