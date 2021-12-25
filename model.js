const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const questionSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    refCount: {
      type: Number,
      required: true,
      default: 1,
    },
    upvoteCount: {
      type: Number,
      required: true,
    },
    answerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);
const QuestionSchema = mongoose.model("QuestionSchema", questionSchema);
module.exports = QuestionSchema;
