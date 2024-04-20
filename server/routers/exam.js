const express =  require('express');
const router = express.Router();
const examController = require('../controllers/exam');

router.get('/', examController.getAllExam);
router.get('/:examId', examController.getExamById);
router.post('/', examController.addNewExam);
router.delete('/:examId', examController.deleteExam);
router.put('/:examId', examController.updateExam)
router.patch('/:examId/status', examController.updateExamStatus)
router.patch('/:examId/reverse', examController.updateExamReverse)

module.exports = router;