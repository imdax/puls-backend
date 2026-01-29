const express = require('express');
const router = express.Router();
const { startAssessment } = require('../controllers/assessmentController');

router.post('/start', startAssessment);

module.exports = router;
