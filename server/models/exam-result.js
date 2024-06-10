const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const examResultSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    disciplineId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    answer: {
      type: Map,
      of: [String],
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
    score: {
      type: Number,
      required: false,
    },
    totalTime: {
      type: Number,
      required: false,
    },
    studentCode: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

examResultSchema.plugin(uniqueValidator);
schemaCleaner(examResultSchema);

module.exports = mongoose.model('exam-result', examResultSchema);
