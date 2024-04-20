const asyncHandler = require('express-async-handler');
const examMiddleware = require('../middlewares/exam');

module.exports = {
  getAllExam: asyncHandler(async (req, res) => {
    const { limit, offset, search, discipline } = req.query;
    const results = await examMiddleware.getAllExam(
      limit,
      offset,
      search,
      discipline
    );
    res.json(results);
  }),

  getExamById: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const results = await examMiddleware.getExamById(examId);
    res.json(results);
  }),

  addNewExam: asyncHandler(async (req, res) => {
    const { name, disciplineId, questionData, adminId, testTime, description } =
      req.body;
    const results = await examMiddleware.addNewExam({
      name,
      disciplineId,
      questionData,
      adminId,
      testTime,
      description,
    });
    res.json(results);
  }),

  deleteExam: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const results = await examMiddleware.deleteExam(examId);
    res.json(results);
  }),

  updateExam: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const { name, disciplineId, questionData, testTime, description } =
      req.body;
    const results = await examMiddleware.updateExam(
      examId,
      name,
      disciplineId,
      questionData,
      testTime,
      description
    );
    res.json(results);
  }),

  updateExamStatus: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const { status } = req.body;
    const results = await examMiddleware.updateExamStatus(examId, status);
    res.json(results);
  }),

  updateExamReverse: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const { isReverse } = req.body;
    const results = await examMiddleware.updateExamReverse(examId, isReverse);
    res.json(results);
  }),
};
