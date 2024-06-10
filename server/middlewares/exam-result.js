const ExamResult = require('../models/exam-result');

module.exports = {
  getExamResultByStudent: async (
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
              from: 'exam-kits',
              localField: 'examId',
              foreignField: '_id',
              as: 'examKit',
            },
          },
          {
            $unwind: '$examKit',
          },
        ]
      );

      if (disciplineId && disciplineId !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$disciplineId' }, disciplineId],
            },
          },
        });
      }

      if (teacherCode && teacherCode !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$examKit.teacherCode' }, teacherCode],
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
          examId: 1,
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
          examKitName: '$examKit.name',
        },
      });

      const getResult = await ExamResult.aggregate(query);

      if (getResult) {
        const totalExamResult = await ExamResult.aggregate(cloneQuery);
        return {
          success: true,
          payload: {
            examResult: getResult,
            total: totalExamResult?.length,
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

  submitExam: async (submitData) => {
    try {
      const {
        examId,
        disciplineId,
        answer,
        questionData,
        score,
        totalTime,
        studentCode,
        studentName,
        isSubmit,
      } = submitData;

      await ExamResult.deleteOne({ examId, studentCode });

      const addRes = await ExamResult.insertMany([
        {
          examId,
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

  getExamProgress: async (studentCode, examId) => {
    try {
      const res = await ExamResult.findOne({ examId, studentCode });

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
