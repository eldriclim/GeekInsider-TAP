const express = require('express');
const router = express.Router();
const Teacher = require('./../models/teacher');
const Student = require('./../models/student');

router.post('/register', (req, res) => {
});

router.get('/commonstudents', async (req, res) => {
  try {
    const student = new Student('mama@hotmail.com');
    await student.insert();
  } catch (error) {
    console.log(error);
  }
});

router.post('/suspend', (req, res) => { });

router.post('/retrievefornotifications', (req, res) => { });

module.exports = router;
