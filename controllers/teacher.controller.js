const { db } = require('./../db/mysql');
const Teacher = require('./../models/teacher');
const Student = require('./../models/student');

exports.register = async (req, res) => {
  try {
    if (!req.body.teacher || !req.body.students) throw new Error('Missing inputs.');

    const teacher = new Teacher(req.body.teacher);
    const students = req.body.students.map(student => new Student(student));

    await teacher.insert();
    const tid = await teacher.getID();

    const pairs = await Promise.all(students.map(async (student) => {
      await student.insert();
      return `(${tid}, ${await student.getID()})`;
    }));

    const input = `
      INSERT IGNORE INTO Teacher_Student(tid, sid)
      VALUES ${pairs.join(',')}`;

    db.query(input, (error, results) => {
      if (error) throw error;

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
  try {
    if (!req.query.teacher) throw new Error('Teacher input not found.');

    const params = (typeof req.query.teacher) === 'string' ? [req.query.teacher] : req.query.teacher;
    const tid = await Promise.all(params.map(async teacher => (new Teacher(teacher)).getID()));

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

    db.query(input, (error, results) => {
      if (error) throw error;
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

exports.suspend = (req, res) => {

};

exports.retrievefornotifications = (req, res) => {

};
