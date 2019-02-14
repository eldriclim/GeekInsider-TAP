const validator = require('validator');
const { db } = require('./../db/mysql');


class Student {
  constructor(email) {
    if (!validator.isEmail(email)) throw new Error('Invalid email format.');

    this.email = email;
  }

  isSuspend() {
    const input = `
      SELECT isSuspend FROM Students
      WHERE email = '${this.email}'`;

    return new Promise((resolve, reject) => {
      db.query(input, (error, results) => {
        if (error) return reject(error);

        if (results.length === 0) return reject(new Error('Email not found.'));

        return resolve(results[0].isSuspend);
      });
    });
  }

  setSuspend(bool) {
    const input = `
      UPDATE students SET isSuspend=${bool === true}
      WHERE email='${this.email}'`;

    return new Promise((resolve, reject) => {
      db.query(input, (error, results) => {
        if (error) return reject(error);

        return resolve();
      });
    });
  }

  getID() {
    const input = `
      SELECT sid FROM Students
      WHERE email = '${this.email}'`;

    return new Promise((resolve, reject) => {
      db.query(input, (error, results) => {
        if (error) return reject(error);

        if (results.length === 0) return reject(new Error('Email not found.'));

        return resolve(results[0].sid);
      });
    });
  }


  insert() {
    const input = `INSERT INTO Students (email) VALUES ('${this.email}')`;

    return new Promise((resolve, reject) => {
      db.query(input, (error, results) => {
        if (error) return reject(error);

        return resolve();
      });
    });
  }
}

module.exports = Student;
