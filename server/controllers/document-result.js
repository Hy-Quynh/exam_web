const asyncHandler = require('express-async-handler');
const documentResultMiddleware = require('../middlewares/document-result');

module.exports = {
  getDocumentResultByStudent: asyncHandler(async (req, res) => {
    const { studentCode, limit, offset, disciplineId, teacherCode, isGetAll } =
      req?.query;

    const results = await documentResultMiddleware.getDocumentResultByStudent(
      studentCode,
      limit,
      offset,
      disciplineId,
      teacherCode,
      isGetAll
    );

    res.json(results);
  }),

  submitDocument: asyncHandler(async (req, res) => {
    const submitData = req?.body;
    const results = await documentResultMiddleware.submitDocument(submitData);
    res.json(results);
  }),

  getDocumentProgress: asyncHandler(async (req, res) => {
    const { studentCode, documentId } = req?.query;

    const results = await documentResultMiddleware.getDocumentProgress(
      studentCode,
      documentId
    );
    
    res.json(results);
  }),
};
