const jwt = require('jsonwebtoken');

const User = require('../database/User');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.logout = (req, res) => {
  const { login, password } = req.body;

  return User.findUserByCredentials(login, password)
    .then((user) => {
      const token = jwt.sign(
        { id: user.id },
        (NODE_ENV === 'production' ? JWT_SECRET : 'secret-key'),
        { expiresIn: '1s' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 1,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Logout - OK' })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
