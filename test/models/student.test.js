const expect = require('expect');
const { dbQuery } = require('./../../db/mysql');
const { dbDeleteTable, dbCountTable } = require('./../helper/db.helper');
const Student = require('./../../models/student');

const student = new Student('example@email.com');

describe('Student model', () => {
  afterEach(async () => {
    await dbDeleteTable('Students');
  });

  describe('#constructor', () => {
    it('should throw error when invalid email format', () => {
      expect(() => {
        new Student('abc');
      }).toThrow('Invalid email format');
    });
  });

  describe('#insert', () => {
    it('should insert new student', async () => {
      await student.insert();

      await expect(dbCountTable('Students')).resolves.toBe(1);
    });
  });

  describe('#getID', () => {
    it('should throw error when email not found', async () => {
      await expect(student.getID()).resolves.toBeUndefined();
    });

    it('should return student id', async () => {
      student.insert();
      const id = (await dbQuery(`SELECT sid FROM Students WHERE email = '${student.email}'`))[0].sid;

      await expect(student.getID()).resolves.toBe(id);
    });
  });

  describe('#isSuspend & #setSuspend', () => {
    it('should throw error if student not found', () => {
      expect(student.isSuspend()).rejects.toThrow('Email not found.');
    });

    it('should return false at initial insert', async () => {
      student.insert();

      await expect(student.isSuspend()).resolves.toBeFalsy();
    });

    it('should return true after setting status true', async () => {
      student.insert();
      student.setSuspend(true);

      await expect(student.isSuspend()).resolves.toBeTruthy();
    });

    it('should return false after setting status false', async () => {
      student.insert();
      student.setSuspend(false);

      await expect(student.isSuspend()).resolves.toBeFalsy();
    });
  });
});
