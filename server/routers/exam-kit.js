const express =  require('express');
const router = express.Router();
const examKitController = require('../controllers/exam-kit');

router.get('/', examKitController.getAllExamKit);
router.get('/:examKitId', examKitController.getExamKitById);
router.post('/', examKitController.addNewExamKit);
router.delete('/:examKitId', examKitController.deleteExamKit);
router.put('/:examKitId', examKitController.updateExamKit)
router.patch('/:examKitId/status', examKitController.updateExamKitStatus)
router.patch('/:examKitId/reverse', examKitController.updateExamKitReverse)
router.get('/:examKitId/question', examKitController.getExamKitQuestion);

module.exports = router;