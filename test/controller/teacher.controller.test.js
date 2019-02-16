const request = require('supertest');
const expect = require('expect');

const { dbQuery } = require('./../../db/mysql');
const { dbDeleteTable, dbCountTable } = require('./../helper/db.helper');
const Student = require('./../../models/student');
const app = require('./../../app');

const {
  teachers,
  students,
  populateTeachers,
  populateStudents,
  populateTeacherStudent
} = require('./../seed');

const invalidEmail = 'example.com';

describe('Teacher controller', () => {
  describe('POST /api/register', () => {
    describe('invalid input format', () => {
      it('should throw error when no teacher indicated', (done) => {
        request(app)
          .post('/api/register')
          .send({
            students
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Missing inputs');
          })
          .end(done);
      });

      it('should throw error when no students indicated', (done) => {
        request(app)
          .post('/api/register')
          .send({
            teacher: teachers
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Missing inputs');
          })
          .end(done);
      });

      it('should throw error when multiple teachers', (done) => {
        request(app)
          .post('/api/register')
          .send({
            teacher: teachers,
            students
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid teacher format');
          })
          .end(done);
      });

      it('should throw error when invalid teachers email', (done) => {
        request(app)
          .post('/api/register')
          .send({
            teacher: invalidEmail,
            students
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe(`Invalid email format: ${invalidEmail}`);
          })
          .end(async (err) => {
            if (err) return done(err);
            try {
              await expect(dbCountTable('Teachers')).resolves.toBe(0);
              await expect(dbCountTable('Students')).resolves.toBe(0);
              await expect(dbCountTable('Teacher_Student')).resolves.toBe(0);
              done();
            } catch (error) {
              done(error);
            }
          });
      });

      it('should throw error and not register when any invalid students email', (done) => {
        request(app)
          .post('/api/register')
          .send({
            teacher: invalidEmail,
            students: [
              students[0],
              invalidEmail,
              students[2]
            ]
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe(`Invalid email format: ${invalidEmail}`);
          })
          .end(async (err) => {
            if (err) return done(err);
            try {
              await expect(dbCountTable('Teachers')).resolves.toBe(0);
              await expect(dbCountTable('Students')).resolves.toBe(0);
              await expect(dbCountTable('Teacher_Student')).resolves.toBe(0);
              done();
            } catch (error) {
              done(error);
            }
          });
      });
    });

    describe('valid input format', () => {
      after((done) => {
        dbDeleteTable('Teacher_Student');
        dbDeleteTable('Teachers');
        dbDeleteTable('Students');
        done();
      });

      it('should insert to Teachers, Students and Teacher_Student table', (done) => {
        request(app)
          .post('/api/register')
          .send({
            teacher: teachers[0],
            students: students.slice(0, 4)
          })
          .expect(204)
          .end(async (err) => {
            if (err) return done(err);
            try {
              await expect(dbCountTable('Teachers')).resolves.toBe(1);
              await expect(dbCountTable('Students')).resolves.toBe(4);
              await expect(dbCountTable('Teacher_Student')).resolves.toBe(4);
              done();
            } catch (error) {
              done(error);
            }
          });
      });

      it('should ignore emails already registered', (done) => {
        request(app)
          .post('/api/register')
          .send({
            teacher: teachers[0],
            students: students.slice(2, 5)
          })
          .expect(204)
          .end(async (err) => {
            if (err) return done(err);
            try {
              await expect(dbCountTable('Teachers')).resolves.toBe(1);
              await expect(dbCountTable('Students')).resolves.toBe(5);
              await expect(dbCountTable('Teacher_Student')).resolves.toBe(5);
              done();
            } catch (error) {
              done(error);
            }
          });
      });
    });
  });

  describe('POST /api/commonstudents', () => {
    describe('invalid email format', () => {
      it('should throw error when param not found', (done) => {
        request(app)
          .get('/api/commonstudents?student=example@email.com')
          .expect(400)
          .end(async (err, res) => {
            if (err) return done(err);
            expect(res.body.message).toBe('Teacher input not found');
            done();
          });
      });

      it('should throw error when invalid email', (done) => {
        request(app)
          .get('/api/commonstudents?teacher=example.com')
          .expect(400)
          .end(async (err, res) => {
            if (err) return done(err);
            expect(res.body.message).toBe('Invalid email format: example.com');
            done();
          });
      });
    });

    describe('valid email format', () => {
      before(populateStudents);
      before(populateTeachers);
      before(populateTeacherStudent);

      after(async () => {
        await dbDeleteTable('Teacher_Student');
        await dbDeleteTable('Teachers');
        await dbDeleteTable('Students');
      });

      describe('single teacher query', () => {
        it('should return empty teacher not found', (done) => {
          request(app)
            .get('/api/commonstudents?teacher=example@email.com')
            .expect(200)
            .end(async (err, res) => {
              if (err) return done(err);
              expect(res.body.students).toEqual([]);
              done();
            });
        });

        it('should return empty when no students register to teacher', (done) => {
          request(app)
            .get(`/api/commonstudents?teacher=${teachers[4]}`)
            .expect(200)
            .end(async (err, res) => {
              if (err) return done(err);
              expect(res.body.students).toEqual([]);
              done();
            });
        });

        it('should return all students under teacher', (done) => {
          request(app)
            .get(`/api/commonstudents?teacher=${teachers[0]}`)
            .expect(200)
            .end(async (err, res) => {
              if (err) return done(err);
              expect(res.body.students).toEqual(students.slice(0, 4));
              done();
            });
        });
      });

      describe('multiple teachers query', () => {
        it('should return empty when any teacher not found', (done) => {
          request(app)
            .get(`/api/commonstudents?teacher=example@email.com&teacher=${teachers[0]}`)
            .expect(200)
            .end(async (err, res) => {
              if (err) return done(err);
              expect(res.body.students).toEqual([]);
              done();
            });
        });

        it('should return empty when one teacher has no students', (done) => {
          request(app)
            .get(`/api/commonstudents?teacher=${teachers[0]}&teacher=${teachers[4]}`)
            .expect(200)
            .end(async (err, res) => {
              if (err) return done(err);
              expect(res.body.students).toEqual([]);
              done();
            });
        });

        it('should return common students', (done) => {
          request(app)
            .get(`/api/commonstudents?teacher=${teachers[0]}&teacher=${teachers[1]}`)
            .expect(200)
            .end(async (err, res) => {
              if (err) return done(err);
              expect(res.body.students).toEqual(students.slice(2, 4));
              done();
            });
        });
      });
    });
  });

  describe('POST /api/suspend', () => {
    describe('invalid input format', () => {
      it('should throw error if no student input', (done) => {
        request(app)
          .post('/api/suspend')
          .send()
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Missing inputs');
          })
          .end(done);
      });

      it('should throw error if invalid student input', (done) => {
        request(app)
          .post('/api/suspend')
          .send({
            student: students
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid student format');
          })
          .end(done);
      });

      it('should throw error if invalid email format', (done) => {
        request(app)
          .post('/api/suspend')
          .send({
            student: invalidEmail
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe(`Invalid email format: ${invalidEmail}`);
          })
          .end(done);
      });
    });

    describe('valid input format', () => {
      before(populateStudents);
      after(async () => {
        await dbDeleteTable('Students');
      });

      it('should throw error if student not found', (done) => {
        request(app)
          .post('/api/suspend')
          .send({
            student: 'example@email.com'
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('No such student found');
          })
          .end(done);
      });

      it('should suspend student', (done) => {
        request(app)
          .post('/api/suspend')
          .send({
            student: students[0]
          })
          .expect(204)
          .end(async (err) => {
            if (err) return done(err);

            const result = await dbQuery(`
                SELECT isSuspend FROM Students
                WHERE email = '${students[0]}'`);

            expect(result[0].isSuspend).toBeTruthy();
            done();
          });
      });
    });
  });

  describe('POST /api/retrievefornotifications', () => {
    describe('invalid input format', () => {
      it('should throw error when no teacher input', (done) => {
        request(app)
          .post('/api/retrievefornotifications')
          .send({
            notification: 'hello world'
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Missing inputs');
          })
          .end(done);
      });

      it('should throw error when no student input', (done) => {
        request(app)
          .post('/api/retrievefornotifications')
          .send({
            teacher: teachers[0]
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Missing inputs');
          })
          .end(done);
      });

      it('should throw error when invalid teacher input format', (done) => {
        request(app)
          .post('/api/retrievefornotifications')
          .send({
            teacher: [teachers[0]],
            notification: 'hello world'
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid input format');
          })
          .end(done);
      });

      it('should throw error when invalid notification input format', (done) => {
        request(app)
          .post('/api/retrievefornotifications')
          .send({
            teacher: teachers[0],
            notification: ['hello world']
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe('Invalid input format');
          })
          .end(done);
      });

      it('should throw error when invalid email format', (done) => {
        request(app)
          .post('/api/retrievefornotifications')
          .send({
            teacher: invalidEmail,
            notification: 'hello world'
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toBe(`Invalid email format: ${invalidEmail}`);
          })
          .end(done);
      });
    });

    describe('valid input format', () => {
      before(populateStudents);
      before(populateTeachers);
      before(populateTeacherStudent);

      after(async () => {
        await dbDeleteTable('Teacher_Student');
        await dbDeleteTable('Teachers');
        await dbDeleteTable('Students');
      });

      describe('no explicit recipients', () => {
        it('should show all students registered under teacher', (done) => {
          request(app)
            .post('/api/retrievefornotifications')
            .send({
              teacher: teachers[0],
              notification: 'hello world'
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.recipients).toEqual(students.slice(0, 4));
            })
            .end(done);
        });

        it('should show empty when teacher have no students', (done) => {
          request(app)
            .post('/api/retrievefornotifications')
            .send({
              teacher: teachers[4],
              notification: 'hello world'
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.recipients).toEqual([]);
            })
            .end(done);
        });

        it('should show empty when all students under teacher suspended', async () => {
          await (new Student(students[5])).setSuspend(true);

          await request(app)
            .post('/api/retrievefornotifications')
            .send({
              teacher: teachers[3],
              notification: 'hello world'
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.recipients).toEqual([]);
            });

          await (new Student(students[5])).setSuspend(false);
        });
      });

      describe('with explicit recipients', () => {
        it('should show all students registered under teacher and those explicitly stated', (done) => {
          request(app)
            .post('/api/retrievefornotifications')
            .send({
              teacher: teachers[0],
              notification: `hello world @${students[4]}`
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.recipients.sort()).toEqual(students.slice(0, 5));
            })
            .end(done);
        });

        it('should show only registered under teacher when those explicitly stated are suspended', async () => {
          await (new Student(students[4])).setSuspend(true);

          await request(app)
            .post('/api/retrievefornotifications')
            .send({
              teacher: teachers[0],
              notification: `hello world @${students[4]}`
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.recipients.sort()).toEqual(students.slice(0, 4));
            });

          await (new Student(students[4])).setSuspend(false);
        });
      });
    });
  });
});
