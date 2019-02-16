const expect = require('expect');
const { dbQuery, dbDeleteTable, dbCountTable } = require('../helper/db.helper');
const Teacher = require('./../../models/teacher');

const teacher = new Teacher('example@email.com');

describe('Teacher model', () => {
  afterEach(async () => {
    await dbDeleteTable('Teachers');
  });

  describe('#constructor', () => {
    it('should throw error when invalid email format', () => {
      expect(() => {
        new Teacher('abc');
      }).toThrow('Invalid email format');
    });
  });

  describe('#insert', () => {
    it('should insert new teacher', async () => {
      await teacher.insert();

      await expect(dbCountTable('Teachers')).resolves.toBe(1);
    });
  });

  describe('#getID', () => {
    it('should throw error when email not found', async () => {
      await expect(teacher.getID()).resolves.toBeUndefined();
    });

    it('should return teacher id', async () => {
      teacher.insert();
      const id = (await dbQuery(`SELECT tid FROM Teachers WHERE email = '${teacher.email}'`))[0].tid;

      await expect(teacher.getID()).resolves.toBe(id);
    });
  });
});
