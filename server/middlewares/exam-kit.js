const ExamKit = require('../models/exam-kit');
const Exam = require('../models/exam');
const { getRandomValues } = require('../utils/handleArray');

module.exports = {
  getAllExamKit: async (
    limit,
    offset,
    search,
    discipline,
    teacherCode,
    status,
    subject
  ) => {
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

      if (teacherCode && teacherCode !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$teacherCode' }, teacherCode],
            },
          },
        });
      }

      if (status !== 'undefined') {
        query.push({
          $match: {
            status: !!status,
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
            $match: {
              'discipline.status': true,
            },
          },
        ]
      );

      if (subject && subject !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$discipline.subjectId' }, subject],
            },
          },
        });
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
          status: 1,
          isDelete: 1,
          testTime: 1,
          examStructure: 1,
          isReverse: 1,
          createdAt: 1,
          updatedAt: 1,
          disciplineName: '$discipline.name',
          description: 1,
          reverseAnswer: 1,
          year: 1,
          openExamStatus: 1,
          disciplineChapters: '$discipline.chapters',
        },
      });

      const getExamKit = await ExamKit.aggregate(query);

      if (getExamKit) {
        return {
          success: true,
          payload: {
            examKit: getExamKit,
          },
        };
      } else {
        throw new Error('Lấy thông tin bộ đề kiểm tra thất bại');
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

  addNewExamKit: async ({
    name,
    disciplineId,
    description,
    testTime,
    examStructure,
    year,
    startTime,
    teacherCode,
  }) => {
    try {
      const addRes = await ExamKit.insertMany([
        {
          name,
          disciplineId,
          description,
          testTime,
          examStructure,
          year: year,
          startTime,
          teacherCode,
        },
      ]);

      if (addRes) {
        const getExamKit = await ExamKit.find({ isDelete: false })
          .lean()
          .exec();

        return {
          success: true,
          payload: getExamKit,
        };
      } else {
        throw new Error('Thêm bộ đề thất bại');
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

  deleteExamKit: async (examKitId) => {
    try {
      const deleteExamKit = await ExamKit.findOneAndUpdate(
        { _id: examKitId },
        { isDelete: true }
      );

      if (deleteExamKit) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá bộ đề thất bại');
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

  updateExamKit: async (
    examKitId,
    name,
    disciplineId,
    description,
    testTime,
    examStructure,
    year,
    startTime,
    teacherCode
  ) => {
    try {
      const updateRes = await ExamKit.findOneAndUpdate(
        { _id: examKitId },
        {
          name,
          disciplineId,
          description,
          testTime,
          examStructure,
          year: year,
          startTime,
          teacherCode,
        }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bộ đề thất bại');
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

  getExamKitById: async (examKitId) => {
    try {
      const query = [
        {
          $match: {
            $expr: {
              $eq: [{ $toString: '$_id' }, examKitId],
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
            status: 1,
            isDelete: 1,
            testTime: 1,
            examStructure: 1,
            isReverse: 1,
            createdAt: 1,
            updatedAt: 1,
            disciplineName: '$discipline.name',
            description: 1,
            reverseAnswer: 1,
            year: 1,
            openExamStatus: 1,
            disciplineChapters: '$discipline.chapters',
          },
        },
      ];

      const getExamKit = await ExamKit.aggregate(query);

      if (getExamKit?.length) {
        return {
          success: true,
          payload: getExamKit[0],
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

  updateExamKitStatus: async (examKitId, status) => {
    try {
      const updateRes = await ExamKit.findOneAndUpdate(
        { _id: examKitId },
        { status }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bộ đề thất bại');
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

  updateExamKitReverse: async (examKitId, isReverse) => {
    try {
      const updateRes = await ExamKit.findOneAndUpdate(
        { _id: examKitId },
        { isReverse }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bộ đề thất bại');
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

  getExamKitQuestion: async (examKitId) => {
    try {
      const query = [
        {
          $match: {
            $expr: {
              $eq: [{ $toString: '$_id' }, examKitId],
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
            status: 1,
            isDelete: 1,
            testTime: 1,
            totalQuestion: 1,
            examStructure: 1,
            isReverse: 1,
            reverseAnswer: 1,
            createdAt: 1,
            updatedAt: 1,
            disciplineName: '$discipline.name',
            description: 1,
            year: 1,
            semester: 1,
            startTime: 1,
            openExamStatus: 1,
            disciplineChapters: '$discipline.chapters',
          },
        },
      ];

      const getExamKit = await ExamKit.aggregate(query);
      if (getExamKit?.length) {
        const examStructure = getExamKit?.[0]?.examStructure;

        const questionData = [];
        for (let i = 0; i < examStructure?.length; i++) {
          const question = await Exam.aggregate([
            {
              $match: {
                _id: examStructure?.[i]?.examId,
              },
            },
          ]);

          if (question?.length && question?.[0]?.questionData?.length) {
            const choiceQuestion = getRandomValues(
              question?.[0]?.questionData,
              examStructure?.[i]?.numberQuestion || 0
            );

            questionData?.push(...choiceQuestion);
          }
        }

        const fullData = {
          ...getExamKit?.[0],
          questionData,
        };

        return {
          success: true,
          payload: fullData,
        };
      }

      return {
        success: false,
        error: {
          message: 'Lấy thông tin bộ đề thất bại',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },

  updateExamKitReverseAnswer: async (examKitId, isReverse) => {
    try {
      const updateRes = await ExamKit.findOneAndUpdate(
        { _id: examKitId },
        { reverseAnswer: isReverse }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bộ đề thất bại');
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

  updateExamKitOpen: async (examKitId, isOpen) => {
    try {
      const updateRes = await ExamKit.findOneAndUpdate(
        { _id: examKitId },
        { openExamStatus: isOpen }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bộ đề thất bại');
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
