const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    mainAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    
    isDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.plugin(uniqueValidator);
schemaCleaner(adminSchema);

module.exports = mongoose.model('admins', adminSchema);
