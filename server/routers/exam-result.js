const express =  require('express');
const router = express.Router();
const examResultController = require('../controllers/exam-result');

router.get('/', examResultController.getExamResultByStudent);
router.get('/progress', examResultController.getExamProgress);
router.post('/submit', examResultController.submitExam);

module.exports = router;