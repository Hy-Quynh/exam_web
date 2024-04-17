const express =  require('express');
const router = express.Router();
const subjectController = require('../controllers/subject');

router.get('/', subjectController.getAllSubject);
router.get('/:subjectId', subjectController.getSubjectById);
router.post('/', subjectController.addNewSubject);
router.delete('/:subjectId', subjectController.deleteSubject);
router.put('/:subjectId', subjectController.updateSubject)
router.patch('/:subjectId/status', subjectController.updateSubjectStatus)

module.exports = router;