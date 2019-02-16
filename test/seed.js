const { dbQuery } = require('./../db/mysql');

const teachers = [
  't0@email.com',
  't1@email.com',
  't2@email.com',
  't3@email.com',
  't4@email.com'
];

const students = [
  's0@email.com',
  's1@email.com',
  's2@email.com',
  's3@email.com',
  's4@email.com',
  's5@email.com'
];

const populateTeachers = async () => {
  await dbQuery('DELETE FROM Teachers');

  await dbQuery(`
    INSERT INTO Teachers (tid, email)
    VALUES ${teachers.map((teacher, index) => `(${index + 1},'${teacher}')`).join(',')}`);
};

const populateStudents = async () => {
  await dbQuery('DELETE FROM Students');

  await dbQuery(`
    INSERT INTO Students (sid, email)
    VALUES ${students.map((student, index) => `(${index + 1},'${student}')`).join(',')}`);
};

/**
 * TeacherStudent mappings
 *
 * teachers[0] => students[0,1,2,3]
 * teachers[1] => students[2,3,4]
 * teachers[2] => students[3]
 * teachers[3] => students[5]
 * teachers[4] => null
 *
 */

const populateTeacherStudent = async () => {
  await dbQuery('DELETE FROM Teacher_Student');

  await dbQuery(`
    INSERT INTO Teacher_Student (tid, sid)
    VALUES (1, 1), (1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (2, 5), (3, 4), (4, 6)`);
};

module.exports = {
  teachers,
  students,
  populateTeachers,
  populateStudents,
  populateTeacherStudent
};
