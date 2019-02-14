const { db } = require('./../../db/mysql');

const dbQuery = input => new Promise((resolve, reject) => {
  db.query(input, (error, results) => {
    if (error) return reject(error);

    return resolve(results);
  });
});

module.exports = { dbQuery, db };
