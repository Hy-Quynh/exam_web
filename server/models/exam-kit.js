const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const examKitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    disciplineId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    testTime: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestion: {
      type: Number,
      required: true,
      default: 0,
    },
    examStructure: [
      {
        chapterId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        numberQuestion: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    isReverse: {
      type: Boolean,
      required: false,
      default: false,
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

examKitSchema.plugin(uniqueValidator);
schemaCleaner(examKitSchema);

module.exports = mongoose.model('exam-kit', examKitSchema);
