const asyncHandler = require('express-async-handler');
const examMiddleware = require('../middlewares/exam');

module.exports = {
  getAllExam: asyncHandler(async (req, res) => {
    const { limit, offset, search, discipline, subject, chapter, teacherCode, status } = req.query;
    const results = await examMiddleware.getAllExam(
      limit,
      offset,
      search,
      discipline,
      subject,
      chapter,
      teacherCode,
      status
    );
    res.json(results);
  }),

  getExamById: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const results = await examMiddleware.getExamById(examId);
    res.json(results);
  }),

  addNewExam: asyncHandler(async (req, res) => {
    const { name, disciplineId, questionData, adminId, description, chapterId, teacherCode } =
      req.body;
    const results = await examMiddleware.addNewExam({
      name,
      disciplineId,
      questionData,
      adminId,
      description,
      chapterId,
      teacherCode
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
    const { name, disciplineId, questionData, description, chapterId, teacherCode } =
      req.body;
    const results = await examMiddleware.updateExam(
      examId,
      name,
      disciplineId,
      questionData,
      description,
      chapterId,
      teacherCode
    );
    res.json(results);
  }),

  updateExamStatus: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const { status } = req.body;
    const results = await examMiddleware.updateExamStatus(examId, status);
    res.json(results);
  }),

  checkExistDisciplineExamChapter: asyncHandler(async (req, res) => {
    const { disciplineId, chapterId } = req.params;
    const results = await examMiddleware.checkExistDisciplineExamChapter(disciplineId, chapterId);
    res.json(results);
  }),

  updateExamReverse: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const { isReverse } = req.body;
    const results = await examMiddleware.updateExamReverse(
      examId,
      isReverse
    );
    res.json(results);
  }),

  updateExamReverseAnswer: asyncHandler(async (req, res) => {
    const { examId } = req.params;
    const { isReverse } = req.body;
    const results = await examMiddleware.updateExamReverseAnswer(
      examId,
      isReverse
    );
    res.json(results);
  }),
};
