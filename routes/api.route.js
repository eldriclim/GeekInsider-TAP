const express = require('express');

const teacherController = require('./../controllers/teacher.controller');

const router = express.Router();


router.post('/register', teacherController.register);

router.get('/commonstudents', teacherController.commonstudents);

router.post('/suspend', teacherController.suspend);

router.post('/retrievefornotifications', teacherController.retrievefornotifications);

module.exports = router;
