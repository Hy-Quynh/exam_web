const Subject = require('../models/subject');

module.exports = {
  getAllSubject: async (limit, offset, search) => {
    try {
      let getSubject = null;
      const newSearch = search && search !== 'undefined' ? search : '';

      if (limit === 'undefined' && offset === 'undefined') {
        getSubject = await Subject.find({
          name: { $regex: new RegExp(newSearch.toLowerCase(), 'i') },
          isDelete: false,
        })
          .lean()
          .exec();
      } else if (offset === 'undefined' && limit) {
        getSubject = await Subject.find({
          name: { $regex: new RegExp(newSearch.toLowerCase(), 'i') },
          isDelete: false,
        })
          .skip(0)
          .limit(limit)
          .lean()
          .exec();
      } else {
        getSubject = await Subject.find({
          name: { $regex: new RegExp(newSearch.toLowerCase(), 'i') },
          isDelete: false,
        })
          .skip(offset * limit)
          .limit(limit)
          .lean()
          .exec();
      }

      if (getSubject) {
        const totalItem = await Subject.find({ isDelete: false }).lean().exec();

        return {
          success: true,
          payload: {
            subject: getSubject,
            totalItem,
          },
        };
      } else {
        throw new Error('Lấy thông tin bộ môn thất bại');
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

  addNewSubject: async ({ name, adminId }) => {
    try {
      const addRes = await Subject.insertMany([{ name, adminId }]);

      if (addRes) {
        const getSubject = await Subject.find({ isDelete: false })
          .lean()
          .exec();

        return {
          success: true,
          payload: getSubject,
        };
      } else {
        throw new Error('Thêm bộ môn thất bại');
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

  deleteSubject: async (subjectId) => {
    try {
      const deleteSubject = await Subject.findOneAndUpdate(
        { _id: subjectId },
        { isDelete: true }
      );

      if (deleteSubject) {
        return {
          success: true,
        };
      } else {
        throw new Error('Xoá bộ môn thất bại');
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

  updateSubject: async (subjectId, name) => {
    try {
      const updateRes = await Subject.findOneAndUpdate(
        { _id: subjectId },
        { name }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bộ môn thất bại');
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

  getSubjectById: async (subjectId) => {
    try {
      const getSubject = await Subject.findOne({ _id: subjectId })
        .lean()
        .exec();

      if (getSubject) {
        return {
          success: true,
          payload: getSubject,
        };
      } else {
        throw new Error('Lấy thông tin bộ môn thất bại');
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

  updateSubjectStatus: async (subjectId, status) => {
    try {
      const updateRes = await Subject.findOneAndUpdate(
        { _id: subjectId },
        { status }
      );

      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Cập nhật bộ môn thất bại');
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
