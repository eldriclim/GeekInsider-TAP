const expect = require('expect');
const { dbQuery, db } = require('./../helper/db_query');
const Student = require('./../../models/student');

const student = new Student('example@email.com');

afterEach(async () => {
  await dbQuery('DELETE FROM Students');
});

after(() => {
  db.end();
});

describe('Student model', () => {
  describe('#constructor', () => {
    it('should throw error when invalid email format', () => {
      expect(() => {
        new Student('abc');
      }).toThrow('Invalid email format.');
    });
  });

  describe('#insert', () => {
    it('should insert new student', async () => {
      await student.insert();

      expect((await dbQuery('SELECT * FROM Students')).length).toBe(1);
    });

    it('should throw error if duplicate inserted', async () => {
      await student.insert();

      expect(student.insert()).rejects.toThrow('Duplicate entry \'example@email.com\' for key \'email\'');
    });
  });

  describe('#getID', () => {
    it('should throw error when email not found', async () => {
      expect(student.getID()).rejects.toThrow('Email not found.');
    });

    it('should return student id', async () => {
      student.insert();
      const id = (await dbQuery(`SELECT sid FROM Students WHERE email = '${student.email}'`))[0].sid;

      expect(student.getID()).resolves.toBe(id);
    });
  });

  describe('#isSuspend & #setSuspend', () => {
    it('should throw error if student not found', () => {
      expect(student.isSuspend()).rejects.toThrow('Email not found.');
    });

    it('should return false at initial insert', () => {
      student.insert();

      expect(student.isSuspend()).resolves.toBeFalsy();
    });

    it('should return true after setting status true', () => {
      student.insert();
      student.setSuspend(true);

      expect(student.isSuspend()).resolves.toBeTruthy();
    });

    it('should return false after setting status false', () => {
      student.insert();
      student.setSuspend(false);

      expect(student.isSuspend()).resolves.toBeFalsy();
    });
  });
});
