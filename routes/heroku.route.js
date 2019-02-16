/**
 * For deployment purposes only
 * 1. Check database alive
 * 2. Clear database tables
 */

const express = require('express');
const { dbQuery } = require('./../db/mysql');

const router = express.Router();

router.get('/select', async (req, res) => {
  try {
    const teachers = await dbQuery('SELECT * FROM Teachers');
    const students = await dbQuery('SELECT * FROM Students');
    const teacherStudent = await dbQuery('SELECT * FROM Teacher_Student');

    res.status(200).send({ teachers, students, teacherStudent });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete('/delete', async (req, res) => {
  try {
    await dbQuery('DELETE FROM Teacher_Student');
    await dbQuery('DELETE FROM Teachers');
    await dbQuery('DELETE FROM Students');

    res.status(200).send('Delete success.');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
