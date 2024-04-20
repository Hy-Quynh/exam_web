const Exam = require('../models/exam');

module.exports = {
  getAllExam: async (limit, offset, search, discipline) => {
    try {
      const newSearch = search && search !== 'undefined' ? search : '';

      const query = [
        {
          $match: {
            name: { $regex: new RegExp(newSearch.toLowerCase(), 'i') },
            isDelete: false,
          },
        },
      ];

      if (discipline && discipline !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$disciplineId' }, discipline],
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
        ]
      );

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

      if (offset && limit && offset !== 'undefined' && limit !== 'undefined') {
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
      query.push({
        $project: {
          _id: 1,
          name: 1,
          disciplineId: 1,
          questionData: 1,
          adminId: 1,
          status: 1,
          isDelete: 1,
          createdAt: 1,
          updatedAt: 1,
          disciplineName: '$discipline.name',
          testTime: 1,
          description: 1,
          isReverse: 1
        },
      });

      const getExam = await Exam.aggregate(query);

      if (getExam) {
        return {
          success: true,
          payload: {
            exam: getExam,
          },
        };
      } else {
        throw new Error('Lấy thông tin đề kiểm tra thất bại');
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

  addNewExam: async ({
    name,
    disciplineId,
    questionData,
    adminId,
    testTime,
    description,
  }) => {
    try {
      const addRes = await Exam.insertMany([
        { name, disciplineId, questionData, adminId, testTime, description },
      ]);

      if (addRes) {
        const getExam = await Exam.find({ isDelete: false }).lean().exec();

        return {
          success: true,
          payload: getExam,
        };
      } else {
        throw new Error('Thêm đề kiểm tra thất bại');
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

  deleteExam: async (examId) => {
    try {
      const deleteExam = await Exam.findOneAndUpdate(
        { _id: examId },
        { isDelete: true }
      );

      if (deleteExam) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá đề kiểm tra thất bại');
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

  updateExam: async (
    examId,
    name,
    disciplineId,
    questionData,
    testTime,
    description
  ) => {
    try {
      const updateRes = await Exam.findOneAndUpdate(
        { _id: examId },
        { name, disciplineId, questionData, testTime, description }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật đề kiểm tra thất bại');
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

  getExamById: async (examId) => {
    try {
      const query = [
        {
          $match: {
            $expr: {
              $eq: [{ $toString: '$_id' }, examId],
            },
          },
        },
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
          $project: {
            _id: 1,
            name: 1,
            disciplineId: 1,
            questionData: 1,
            adminId: 1,
            status: 1,
            isDelete: 1,
            createdAt: 1,
            updatedAt: 1,
            disciplineName: '$discipline.name',
            testTime: 1,
            description: 1,
            isReverse: 1
          },
        }
      ];

      const getExam = await Exam.aggregate(query)

      if (getExam?.length) {
        return {
          success: true,
          payload: getExam[0],
        };
      } else {
        throw new Error('Lấy thông tin đề kiểm tra thất bại');
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

  updateExamStatus: async (examId, status) => {
    try {
      const updateRes = await Exam.findOneAndUpdate(
        { _id: examId },
        { status }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật đề kiểm tra thất bại');
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

  updateExamReverse: async (examId, isReverse) => {
    try {
      const updateRes = await Exam.findOneAndUpdate(
        { _id: examId },
        { isReverse }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật đề kiểm tra thất bại');
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
};
