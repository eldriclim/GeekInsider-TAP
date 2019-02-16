const { db } = require('../../db/mysql');

const dbQuery = input => new Promise((resolve, reject) => {
  db.query(input, (error, results) => {
    if (error) return reject(error);

    return resolve(results);
  });
});

const dbDeleteTable = async (input) => {
  await dbQuery(`DELETE FROM ${input}`);
};

const dbCountTable = (input) => {
  return dbQuery(`SELECT COUNT(*) AS count FROM ${input}`).then((results) => {
    return results[0].count;
  });
};

module.exports = { db, dbQuery, dbDeleteTable, dbCountTable };
