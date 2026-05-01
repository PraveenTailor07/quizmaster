import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },
    selectedOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    correctOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true
    },
    answers: [answerSchema],
    correctCount: {
      type: Number,
      required: true,
      default: 0
    },
    incorrectCount: {
      type: Number,
      required: true,
      default: 0
    },
    score: {
      type: Number,
      required: true,
      default: 0
    },
    percentage: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

export const Attempt = mongoose.model("Attempt", attemptSchema);
