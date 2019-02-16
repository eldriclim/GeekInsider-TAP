const validator = require('validator');
const { db } = require('./../db/mysql');


class Teacher {
  constructor(email) {
    if (!validator.isEmail(email)) throw new Error(`Invalid email format: ${email}`);

    this.email = email;
  }

  insert() {
    const input = `INSERT IGNORE INTO Teachers (email) VALUES ('${this.email}')`;

    return new Promise((resolve, reject) => {
      db.query(input, (error) => {
        if (error) return reject(error);

        return resolve();
      });
    });
  }

  getID() {
    const input = `
      SELECT tid FROM Teachers
      WHERE email = '${this.email}'`;

    return new Promise((resolve, reject) => {
      db.query(input, (error, results) => {
        if (error) return reject(error);

        if (results.length === 0) return resolve();

        return resolve(results[0].tid);
      });
    });
  }
}

module.exports = Teacher;
