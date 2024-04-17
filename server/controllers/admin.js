const asyncHandler = require('express-async-handler');
const adminMiddleware = require('../middlewares/admin');

module.exports = {
  adminSignUp: asyncHandler(async (req, res) => {
    const { name, userName, password } = req?.body;
    const response = await adminMiddleware.adminSignUp(
      name,
      userName,
      password
    );
    res.json(response);
  }),

  adminLogin: asyncHandler(async (req, res) => {
    const { userName, password } = req?.body;
    const response = await adminMiddleware.adminLogin(userName, password);
    res.json(response);
  }),

  getAllAdmin: asyncHandler(async (req, res) => {
    const response = await adminMiddleware.getAllAdmin();
    res.json(response);
  }),

  getAdminById: asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const results = await adminMiddleware.getAdminById(adminId);
    res.json(results);
  }),

  updateAdminInfo: asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const { name, userName } = req.body;
    const results = await adminMiddleware.updateAdminInfo(
      adminId,
      name,
      userName
    );
    res.json(results);
  }),

  deleteAdminId: asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const results = await adminMiddleware.deleteAdminId(adminId);
    res.json(results);
  }),

  updateAdminStatus: asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const { status } = req.body;
    const results = await adminMiddleware.updateAdminStatus(adminId, status);
    res.json(results);
  }),
};
