import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: (options) => options.length === 4,
        message: "Each question must contain exactly 4 options"
      }
    },
    correctOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    explanation: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

questionSchema.pre("validate", function ensureCorrectOption(next) {
  const exists = this.options.some((option) => option._id.equals(this.correctOptionId));

  if (!exists) {
    this.invalidate("correctOptionId", "Correct option must match one of the 4 options");
  }

  next();
});

export const Question = mongoose.model("Question", questionSchema);
