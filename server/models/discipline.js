const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const disciplineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    chapters: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    isDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

disciplineSchema.plugin(uniqueValidator);
schemaCleaner(disciplineSchema);

module.exports = mongoose.model('disciplines', disciplineSchema);
