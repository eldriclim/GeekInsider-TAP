const expect = require('expect');
const { dbQuery, db } = require('./../helper/db_query');
const Teacher = require('./../../models/teacher');

const teacher = new Teacher('example@email.com');

afterEach(async () => {
  await dbQuery('DELETE FROM Teachers');
});

after(() => {
  db.end();
});

describe('Teacher model', () => {
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

      expect((await dbQuery('SELECT * FROM Teachers')).length).toBe(1);
    });
  });

  describe('#getID', () => {
    it('should throw error when email not found', async () => {
      expect(teacher.getID()).resolves.toBeUndefined();
    });

    it('should return teacher id', async () => {
      teacher.insert();
      const id = (await dbQuery(`SELECT tid FROM Teachers WHERE email = '${teacher.email}'`))[0].tid;

      expect(teacher.getID()).resolves.toBe(id);
    });
  });
});
