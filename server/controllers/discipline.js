const asyncHandler = require('express-async-handler');
const disciplineMiddleware = require('../middlewares/discipline');

module.exports = {
  getAllDiscipline: asyncHandler(async (req, res) => {
    const { limit, offset, search } = req.query;
    const results = await disciplineMiddleware.getAllDiscipline(limit, offset, search);
    res.json(results);
  }),

  getDisciplineById: asyncHandler(async (req, res) => {
    const { disciplineId } = req.params;
    const results = await disciplineMiddleware.getDisciplineById(disciplineId);
    res.json(results);
  }),

  addNewDiscipline: asyncHandler(async (req, res) => {
    const { name, subjectId, adminId } = req.body;
    const results = await disciplineMiddleware.addNewDiscipline({ name, subjectId, adminId });
    res.json(results);
  }),

  deleteDiscipline: asyncHandler(async (req, res) => {
    const { disciplineId } = req.params;
    const results = await disciplineMiddleware.deleteDiscipline(disciplineId);
    res.json(results);
  }),

  updateDiscipline: asyncHandler(async (req, res) => {
    const { disciplineId } = req.params;
    const { name, subjectId } = req.body;
    const results = await disciplineMiddleware.updateDiscipline(
      disciplineId,
      name,
      subjectId
    );
    res.json(results);
  }),

  updateDisciplineStatus: asyncHandler(async (req, res) => {
    const { disciplineId } = req.params;
    const { status } = req.body;
    const results = await disciplineMiddleware.updateDisciplineStatus(
      disciplineId,
      status
    );
    res.json(results);
  }),
};

