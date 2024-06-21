const asyncHandler = require('express-async-handler');
const examKitMiddleware = require('../middlewares/exam-kit');

module.exports = {
  getAllExamKit: asyncHandler(async (req, res) => {
    const { limit, offset, search, discipline, teacherCode, status, subject } = req.query;
    const results = await examKitMiddleware.getAllExamKit(
      limit,
      offset,
      search,
      discipline,
      teacherCode,
      status,
      subject
    );
    res.json(results);
  }),

  getExamKitById: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const results = await examKitMiddleware.getExamKitById(examKitId);
    res.json(results);
  }),

  addNewExamKit: asyncHandler(async (req, res) => {
    const {
      name,
      disciplineId,
      description,
      testTime,
      examStructure,
      year,
      startTime,
      teacherCode,
    } = req.body;

    const results = await examKitMiddleware.addNewExamKit({
      name,
      disciplineId,
      description,
      testTime,
      examStructure,
      year,
      startTime,
      teacherCode,
    });
    res.json(results);
  }),

  deleteExamKit: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const results = await examKitMiddleware.deleteExamKit(examKitId);
    res.json(results);
  }),

  updateExamKit: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const {
      name,
      disciplineId,
      description,
      testTime,
      examStructure,
      year,
      startTime,
      teacherCode
    } = req.body;

    const results = await examKitMiddleware.updateExamKit(
      examKitId,
      name,
      disciplineId,
      description,
      testTime,
      examStructure,
      year,
      startTime,
      teacherCode
    );
    
    res.json(results);
  }),

  updateExamKitStatus: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const { status } = req.body;
    const results = await examKitMiddleware.updateExamKitStatus(
      examKitId,
      status
    );
    res.json(results);
  }),

  updateExamKitReverse: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const { isReverse } = req.body;
    const results = await examKitMiddleware.updateExamKitReverse(
      examKitId,
      isReverse
    );
    res.json(results);
  }),

  getExamKitQuestion: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const results = await examKitMiddleware.getExamKitQuestion(examKitId);
    res.json(results);
  }),

  updateExamKitReverseAnswer: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const { isReverse } = req.body;
    const results = await examKitMiddleware.updateExamKitReverseAnswer(
      examKitId,
      isReverse
    );
    res.json(results);
  }),

  updateExamKitOpen: asyncHandler(async (req, res) => {
    const { examKitId } = req.params;
    const { isOpen } = req.body;
    const results = await examKitMiddleware.updateExamKitOpen(
      examKitId,
      isOpen
    );
    res.json(results);
  }),
};
