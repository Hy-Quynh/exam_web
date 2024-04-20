const express =  require('express');
const router = express.Router();
const disciplineController = require('../controllers/discipline');

router.get('/', disciplineController.getAllDiscipline);
router.get('/:disciplineId', disciplineController.getDisciplineById);
router.post('/', disciplineController.addNewDiscipline);
router.delete('/:disciplineId', disciplineController.deleteDiscipline);
router.put('/:disciplineId', disciplineController.updateDiscipline)
router.patch('/:disciplineId/status', disciplineController.updateDisciplineStatus)

module.exports = router;