
const express =  require('express');
const router = express.Router();
const adminController = require('../controllers/admin');


router.post('/signup', adminController.adminSignUp);
router.post('/login', adminController.adminLogin);
router.get('/', adminController.getAllAdmin);
router.get('/:adminId', adminController.getAdminById);
router.put('/:adminId', adminController.updateAdminInfo);
router.delete('/:adminId', adminController.deleteAdminId);
router.patch('/:adminId/status', adminController.updateAdminStatus);

module.exports = router;