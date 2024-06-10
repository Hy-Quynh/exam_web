const asyncHandler = require('express-async-handler');
const examResultMiddleware = require('../middlewares/exam-result');

module.exports = {
  getExamResultByStudent: asyncHandler(async (req, res) => {
    const { studentCode, limit, offset, disciplineId, teacherCode, isGetAll } =
      req?.query;

    const results = await examResultMiddleware.getExamResultByStudent(
      studentCode,
      limit,
      offset,
      disciplineId,
      teacherCode,
      isGetAll
    );

    res.json(results);
  }),

  submitExam: asyncHandler(async (req, res) => {
    const submitData = req?.body;
    const results = await examResultMiddleware.submitExam(submitData);
    res.json(results);
  }),

  getExamProgress: asyncHandler(async (req, res) => {
    const { studentCode, examId } = req?.query;

    const results = await examResultMiddleware.getExamProgress(
      studentCode,
      examId
    );
    
    res.json(results);
  }),
};
