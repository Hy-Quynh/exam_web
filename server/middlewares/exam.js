const Exam = require('../models/exam');

module.exports = {
  getAllExam: async (limit, offset, search, discipline, subject, chapter) => {
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

      if (chapter && chapter !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$chapterId' }, chapter],
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

      if (subject && subject !== 'undefined') {
        query.push(
          ...[
            {
              $lookup: {
                from: 'subjects',
                localField: 'discipline.subjectId',
                foreignField: '_id',
                as: 'subject',
              },
            },
            {
              $unwind: '$subject',
            },
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$subject._id' }, subject],
                },
              }
            },
          ]
        );
      }


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
          isReverse: 1,
          reverseAnswer: 1,
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
        throw new Error('Lấy thông tin tài liệu thất bại');
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
    chapterId,
    teacherCode
  }) => {
    try {
      const addRes = await Exam.insertMany([
        { name, disciplineId, questionData, adminId, description, chapterId, teacherCode },
      ]);

      if (addRes) {
        const getExam = await Exam.find({ isDelete: false }).lean().exec();

        return {
          success: true,
          payload: getExam,
        };
      } else {
        throw new Error('Thêm tài liệu thất bại');
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
        throw new Error('Xoá tài liệu thất bại');
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
    chapterId,
    teacherCode
  ) => {
    try {
      const updateRes = await Exam.findOneAndUpdate(
        { _id: examId },
        { name, disciplineId, questionData, description, chapterId, teacherCode }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật tài liệu thất bại');
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
            isReverse: 1,
            reverseAnswer: 1,
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
        throw new Error('Lấy thông tin tài liệu thất bại');
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
        throw new Error('Cập nhật tài liệu thất bại');
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
        throw new Error('Cập nhật đề thất bại');
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

  updateExamReverseAnswer: async (examId, isReverse) => {
    try {
      const updateRes = await Exam.findOneAndUpdate(
        { _id: examId },
        { reverseAnswer: isReverse }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật đề thất bại');
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
