const asyncHandler = require('express-async-handler');
const subjectMiddleware = require('../middlewares/subject');

module.exports = {
  getAllSubject: asyncHandler(async (req, res) => {
    const { limit, offset, search } = req.query;
    const results = await subjectMiddleware.getAllSubject(limit, offset, search);
    res.json(results);
  }),

  getSubjectById: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const results = await subjectMiddleware.getSubjectById(subjectId);
    res.json(results);
  }),

  addNewSubject: asyncHandler(async (req, res) => {
    const { name, adminId } = req.body;
    const results = await subjectMiddleware.addNewSubject({ name, adminId });
    res.json(results);
  }),

  deleteSubject: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const results = await subjectMiddleware.deleteSubject(subjectId);
    res.json(results);
  }),

  updateSubject: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const { name } = req.body;
    const results = await subjectMiddleware.updateSubject(
      subjectId,
      name
    );
    res.json(results);
  }),

  updateSubjectStatus: asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const { status } = req.body;
    const results = await subjectMiddleware.updateSubjectStatus(
      subjectId,
      status
    );
    res.json(results);
  }),

  getSubjectDiscipline: asyncHandler(async (req, res) => {
    const results = await subjectMiddleware.getSubjectDiscipline();
    res.json(results);
  }),
};

