const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const examSchema = new mongoose.Schema(
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
    teacherCode: {
      type: String,
      required: true,
    },
    questionData: [
      {
        question: {
          type: String,
          required: true,
        },
        answerType: {
          type: String,
          required: true,
        },
        answerList: [
          {
            answer: {
              type: String,
              required: true,
            },
            isTrue: {
              type: Boolean,
              required: false,
              default: false,
            },
          },
        ],
      },
    ],
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    description: {
      type: String,
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
    isReverse: {
      type: Boolean,
      required: false,
      default: false,
    },
    reverseAnswer: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

examSchema.plugin(uniqueValidator);
schemaCleaner(examSchema);

module.exports = mongoose.model('exams', examSchema);
