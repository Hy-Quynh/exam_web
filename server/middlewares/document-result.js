const DocumentResult = require('../models/document-result');

module.exports = {
  getDocumentResultByStudent: async (
    studentCode,
    limit,
    offset,
    disciplineId,
    teacherCode,
    isGetAll
  ) => {
    try {
      const query = [];

      if (studentCode && studentCode !== 'undefined') {
        query.push({
          $match: {
            studentCode: { $regex: new RegExp(studentCode.toLowerCase(), 'i') },
          },
        });
      }

      if (disciplineId && disciplineId !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$disciplineId' }, disciplineId],
            },
          },
        });
      }

      query.push(
        ...[
          {
            $lookup: {
              from: 'disciplines',
              localField: 'disciplineId',
              foreignField: '_id',
              as: 'discipline',
            },
          },
          {
            $unwind: '$discipline',
          },
          {
            $lookup: {
              from: 'exams',
              localField: 'documentId',
              foreignField: '_id',
              as: 'exam',
            },
          },
          {
            $unwind: '$exam',
          },
        ]
      );

      if (teacherCode && teacherCode !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$exam.teacherCode' }, teacherCode],
            },
          },
        });
      }

      const cloneQuery = [...query];

      if (!isGetAll) {
        if (offset === 'undefined' && limit && limit !== 'undefined') {
          query.push(
            ...[
              {
                $skip: 0,
              },
              {
                $limit: limit,
              },
            ]
          );
        }

        if (
          offset &&
          limit &&
          offset !== 'undefined' &&
          limit !== 'undefined'
        ) {
          query.push(
            ...[
              {
                $skip: Number(offset),
              },
              {
                $limit: Number(limit),
              },
            ]
          );
        }
      }

      query.push({
        $project: {
          _id: 1,
          disciplineId: 1,
          documentId: 1,
          answer: 1,
          questionData: 1,
          score: 1,
          totalTime: 1,
          studentCode: 1,
          studentName: 1,
          createdAt: 1,
          updatedAt: 1,
          isSubmit: 1,
          disciplineName: '$discipline.name',
          examName: '$exam.name',
        },
      });

      const getResult = await DocumentResult.aggregate(query);

      if (getResult) {
        const totalDocumentResult = await DocumentResult.aggregate(cloneQuery);
        return {
          success: true,
          payload: {
            documentResult: getResult,
            total: totalDocumentResult?.length,
          },
        };
      } else {
        throw new Error('Lấy thông tin kết quả thất bại');
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  submitDocument: async (submitData) => {
    try {
      const {
        documentId,
        disciplineId,
        answer,
        questionData,
        score,
        totalTime,
        studentCode,
        studentName,
        isSubmit,
      } = submitData;

      await DocumentResult.deleteOne({ documentId, studentCode });

      const addRes = await DocumentResult.insertMany([
        {
          documentId,
          disciplineId,
          answer,
          questionData,
          score,
          totalTime,
          studentCode,
          studentName,
          isSubmit,
        },
      ]);

      if (addRes) {
        return {
          success: true,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  getDocumentProgress: async (studentCode, documentId) => {
    try {
      const res = await DocumentResult.findOne({ documentId, studentCode });

      if (res) {
        return {
          success: true,
          payload: res,
        };
      }
      throw new Error('Lấy thông tin tiến độ thất bại');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },
};
