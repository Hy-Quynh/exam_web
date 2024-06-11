const Discipline = require('../models/discipline');

module.exports = {
  getAllDiscipline: async (limit, offset, search, subject, status) => {
    try {
      const newSearch = search && search !== 'undefined' ? search : '';

      const query = [
        {
          $match: {
            name: { $regex: new RegExp(newSearch.toLowerCase(), 'i') },
            isDelete: false
          },
        },
        {
          $lookup: {
            from: 'subjects',
            localField: 'subjectId',
            foreignField: '_id',
            as: 'subject',
          },
        },
        {
          $unwind: '$subject',
        },
      ];

      if (status !== 'undefined') {
        query.push({
          $match: {
            status: !!status
          },
        })
      }

      if (subject && subject !== 'undefined') {
        query.push({
          $match: {
            $expr: {
              $eq: [{ $toString: '$subjectId' }, subject],
            },
          }
        })
      }

      if (offset === 'undefined' && !offset && limit && limit !== 'undefined') {
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
              $skip: offset,
            },
            {
              $limit: limit,
            },
          ]
        );
      }

      query.push({
        $project: {
          _id: 1,
          name: 1,
          subjectId: 1,
          chapters: 1,
          adminId: 1,
          status: 1,
          isDelete: 1,
          createdAt: 1,
          updatedAt: 1,
          subjectName: '$subject.name',
        },
      });

      const getDiscipline = await Discipline.aggregate(query);

      if (getDiscipline) {
        const totalItem = await Discipline.find({ isDelete: false })
          .lean()
          .exec();

        return {
          success: true,
          payload: {
            discipline: getDiscipline,
            totalItem,
          },
        };
      } else {
        throw new Error('Lấy thông tin môn học thất bại');
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

  addNewDiscipline: async ({ name, subjectId, adminId, chapters }) => {
    try {
      const addRes = await Discipline.insertMany([
        { name, subjectId, adminId, chapters },
      ]);

      if (addRes) {
        const getDiscipline = await Discipline.find({ isDelete: false })
          .lean()
          .exec();

        return {
          success: true,
          payload: getDiscipline,
        };
      } else {
        throw new Error('Thêm môn học thất bại');
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

  deleteDiscipline: async (disciplineId) => {
    try {
      const deleteDiscipline = await Discipline.findOneAndUpdate(
        { _id: disciplineId },
        { isDelete: true }
      );

      if (deleteDiscipline) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá môn học thất bại');
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

  updateDiscipline: async (disciplineId, name, subjectId, chapters) => {
    try {
      const updateRes = await Discipline.findOneAndUpdate(
        { _id: disciplineId },
        { name, subjectId, chapters }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật môn học thất bại');
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

  getDisciplineById: async (disciplineId) => {
    try {
      const getDiscipline = await Discipline.findOne({ _id: disciplineId })
        .lean()
        .exec();

      if (getDiscipline) {
        return {
          success: true,
          payload: getDiscipline,
        };
      } else {
        throw new Error('Lấy thông tin môn học thất bại');
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

  updateDisciplineStatus: async (disciplineId, status) => {
    try {
      const updateRes = await Discipline.findOneAndUpdate(
        { _id: disciplineId },
        { status }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật môn học thất bại');
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
