const bcrypt = require('bcryptjs');
const SALT_ROUND = 10;
const Admin = require('../models/admin');

module.exports = {
  adminSignUp: async (name, userName, password) => {
    try {
      const checkExist = await Admin.findOne({
        userName,
        isDelete: false,
      })
        .lean()
        .exec();

      if (!checkExist?._id) {
        const hashPassword = bcrypt.hashSync(password, SALT_ROUND);
        const insertAccount = await Admin.insertMany([
          {
            name,
            userName,
            password: hashPassword,
          },
        ]);

        if (insertAccount?.[0]?._id) {
          return {
            success: true,
          };
        }
      } else {
        throw new Error('Tên đăng nhập đã tồn tại');
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  adminLogin: async (userName, password) => {
    try {
      const checkExist = await Admin.findOne({
        userName,
        isDelete: false,
      })
        .lean()
        .exec();

      if (checkExist?._id) {
        if (!checkExist?.status) {
          throw new Error('Tài khoản bị vô hiệu hoá');
        }

        if (bcrypt.compareSync(password, checkExist?.password)) {
          return {
            success: true,
            payload: {
              type: 'ADMIN',
              mainAdmin: checkExist?.mainAdmin,
              _id: checkExist?._id,
            },
          };
        } else {
          throw new Error('Sai mật khẩu');
        }
      } else {
        throw new Error('Thông tin đăng nhập không chính xác');
      }
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  getAllAdmin: async () => {
    try {
      const adminRes = await Admin.find({ isDelete: false }).lean().exec();

      return {
        success: true,
        payload: {
          admin: adminRes,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  getAdminById: async (adminId) => {
    try {
      const adminRes = await Admin.findOne({ _id: adminId }).lean().exec();

      return {
        success: true,
        payload: adminRes,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          message: err.message,
        },
      };
    }
  },

  updateAdminInfo: async (adminId, name, userName) => {
    try {
      const checkExist = await Admin.findOne({
        userName,
        isDelete: false,
      })
        .lean()
        .exec();

      if (
        checkExist?._id &&
        adminId?.toString() !== checkExist?._id?.toString()
      ) {
        throw new Error('Tên đăng nhập đã tồn tại');
      }

      const updateRes = await Admin.findOneAndUpdate(
        { _id: adminId },
        {
          name,
          userName,
        }
      );
      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Không thể cập nhật thông tin quản trị viên');
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

  deleteAdminId: async (adminId) => {
    try {
      const deleteProductReview = await Admin.findOneAndUpdate(
        { _id: adminId },
        {
          isDelete: true,
        }
      );

      if (deleteProductReview) {
        return {
          success: true,
        };
      }
      throw new Error('Kiểm tra các thông tin ràng buộc khác của người dùng');
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  },
  updateAdminStatus: async (adminId, status) => {
    try {
      const updateRes = await Admin.findOneAndUpdate(
        { _id: adminId },
        {
          status,
        }
      );
      if (updateRes) {
        return {
          success: true,
        };
      } else {
        throw new Error('Không thể cập nhật thông tin quản trị viên');
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
