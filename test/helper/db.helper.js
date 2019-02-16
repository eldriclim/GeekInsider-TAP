const { dbQuery } = require('../../db/mysql');

const dbDeleteTable = async (input) => {
  await dbQuery(`DELETE FROM ${input}`);
};

const dbCountTable = (input) => {
  return dbQuery(`SELECT COUNT(*) AS count FROM ${input}`).then((results) => {
    return results[0].count;
  });
};

module.exports = { dbDeleteTable, dbCountTable };
