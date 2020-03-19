const { Pool } = require('pg');
require('dotenv').config();

// const {
//   DB_HOST,
//   DB_PORT,
//   DB_USER,
//   DB_PASS,
//   DB_DATABASE,
// } = process.env;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '13irjkf',
  port: 5432,
});


function query(text) {
  return new Promise((resolve, reject) => {
    pool
      .query(text)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  query,
};
