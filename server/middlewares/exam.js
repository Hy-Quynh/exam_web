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
          status: 1,
          isDelete: 1,
          createdAt: 1,
          updatedAt: 1,
          disciplineName: '$discipline.name',
          description: 1,
          chapterId: 1,
          disciplineChapters: '$discipline.chapters'
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
    description,
    chapterId
  }) => {
    try {
      const addRes = await Exam.insertMany([
        { name, disciplineId, questionData, adminId, description, chapterId },
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
    description,
    chapterId
  ) => {
    try {
      const updateRes = await Exam.findOneAndUpdate(
        { _id: examId },
        { name, disciplineId, questionData, description, chapterId }
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
            status: 1,
            isDelete: 1,
            createdAt: 1,
            updatedAt: 1,
            disciplineName: '$discipline.name',
            description: 1,
            chapterId: 1,
            disciplineChapters: '$discipline.chapters'
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

  checkExistDisciplineExamChapter: async(disciplineId, chapterId) => {
    try {
      const checkResult = await Exam.findOne({disciplineId, chapterId, isDelete: false})
      if (checkResult) {
        return {
          payload: true
        }
      }
      return {
        payload: false
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  }
};
