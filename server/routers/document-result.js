const express =  require('express');
const router = express.Router();
const documentResultController = require('../controllers/document-result');

router.get('/', documentResultController.getDocumentResultByStudent);
router.get('/progress', documentResultController.getDocumentProgress);
router.post('/submit', documentResultController.submitDocument);

module.exports = router;