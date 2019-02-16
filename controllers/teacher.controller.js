const validator = require('validator');

const { dbQuery } = require('./../db/mysql');
const Teacher = require('./../models/teacher');
const Student = require('./../models/student');

exports.register = async (req, res) => {
  let { teacher, students } = req.body;
  try {
    if (!teacher || !students) throw new Error('Missing inputs');

    if (typeof teacher !== 'string') throw new Error('Invalid teacher format');

    teacher = new Teacher(teacher);
    students = students.map(student => new Student(student));

    await teacher.insert();
    const tid = await teacher.getID();

    const pairs = await Promise.all(students.map(async (student) => {
      await student.insert();
      return `(${tid}, ${await student.getID()})`;
    }));

    const input = `
      INSERT IGNORE INTO Teacher_Student(tid, sid)
      VALUES ${pairs.join(',')}`;

    await dbQuery(input).then(() => {
      res.status(204).send();
    });
  } catch (error) {
    res
      .status(400)
      .send({
        message: error.message
      });
  }
};

exports.commonstudents = async (req, res) => {
  const { teacher } = req.query;
  try {
    if (!teacher) throw new Error('Teacher input not found');

    const teachers = (typeof teacher) === 'string' ? [teacher] : teacher;
    const tid = await Promise.all(teachers.map(async email => (new Teacher(email)).getID()));

    const common = {
      students: []
    };

    if (tid.filter(id => id !== undefined).length !== tid.length) {
      return res.status(200).send(common);
    }

    const input = `
      SELECT s.email 
      FROM Teacher_Student ts LEFT JOIN Students s ON ts.sid = s.sid
      WHERE ts.tid IN (${tid.join(',')})
      GROUP BY s.email
      HAVING COUNT(*) = ${tid.length}`;

    await dbQuery(input).then((results) => {
      common.students = results.map(row => row.email);

      res.status(200).send(common);
    });
  } catch (error) {
    res
      .status(400)
      .send({
        message: error.message
      });
  }
};

exports.suspend = async (req, res) => {
  let { student } = req.body;
  try {
    if (!student) throw new Error('Missing inputs');

    if (typeof student !== 'string') throw new Error('Invalid student format');

    student = new Student(student);

    if (!(await student.getID())) throw new Error('No such student found');

    await student.setSuspend(true).then(() => {
      res.status(204).send();
    });
  } catch (error) {
    res
      .status(400)
      .send({
        message: error.message
      });
  }
};

exports.retrievefornotifications = async (req, res) => {
  const { notification, teacher } = req.body;

  try {
    if (!teacher || typeof notification === 'undefined') throw new Error('Missing inputs');
    if (typeof teacher !== 'string' || typeof notification !== 'string') {
      throw new Error('Invalid input format');
    }

    const tid = await ((new Teacher(teacher)).getID());
    if (!tid) throw new Error('No such teacher found');

    const emails = notification.split(' ')
      .map(string => string.substring(1))
      .filter(string => validator.isEmail(string));

    const sid = (await Promise.all(
      emails.map(email => ((new Student(email)).getID()))
    )).filter(id => typeof id !== 'undefined');

    const input = `
      SELECT s1.email
      FROM Students s1 LEFT JOIN Teacher_Student ts1 ON s1.sid = ts1.sid
      WHERE s1.sid IN (${sid.join(',') || 'NULL'}) AND s1.isSuspend = FALSE

      UNION

      SELECT s2.email
      FROM Teacher_Student ts2 LEFT JOIN Students s2 ON ts2.sid = s2.sid
      WHERE ts2.tid = ${tid} AND s2.isSuspend = FALSE
    `;

    await dbQuery(input).then((results) => {
      const recipients = results.map(row => row.email);
      res.status(200).send({ recipients });
    });
  } catch (error) {
    res
      .status(400)
      .send({
        message: error.message
      });
  }
};
