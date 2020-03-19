const bcrypt = require('bcrypt');
const database = require('./database');
const LoginSignUpReqError = require('../errors/login-bad');

const User = {
  async readAll(req, res) {
    try {
      const readAllQuery = 'SELECT * FROM users';
      const { rows } = await database.query(readAllQuery);
      return res.send({ rows });
    } catch (error) {
      return res.send(error);
    }
  },
  async findUser(login, password) {
    try {
      const findUserQuery = `SELECT * FROM users where login = ${login} and password = ${password}`;
      const { rows } = await database.query(findUserQuery);
      return !!rows;
    } catch (error) {
      return (false);
    }
  },
  async createNewUser(dataAuth) {
    try {
      const checkUser = await this.findUserByLogin(dataAuth.login);
      if (checkUser) { throw new LoginSignUpReqError('Пользователь с таким именем уже существует'); }
      const createUserQuery = `insert into public.users (login, password) values ('${dataAuth.login}', '${dataAuth.password}')`;
      const newuser = await database.query(createUserQuery);
      return !!newuser;
    } catch (error) {
      return (false);
    }
  },
  async findUserByLogin(login) {
    try {
      const findOneUser = `SELECT * FROM users where login = '${login}'`;
      const newuser = await database.query(findOneUser);
      return !!newuser.rowCount;
    } catch (error) {
      return (false);
    }
  },
  async findUserByCredentials(login, password) {
    try {
      const checkUser = await database.query(`SELECT * FROM users where login = '${login}'`);
      if (!checkUser.rowCount) { return Promise.reject(new Error('Неправильные почта или пароль')); }
      // console.log('checkUser = ', checkUser.rows[0]);
      return bcrypt.compare(password, checkUser.rows[0].password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return checkUser.rows[0];
        });
    } catch (error) {
      return (false);
    }
  },
};

module.exports = User;
