const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const dbQuery = input => new Promise((resolve, reject) => {
  db.query(input, (error, results) => {
    if (error) return reject(error);

    return resolve(results);
  });
});

module.exports = { db, dbQuery };
