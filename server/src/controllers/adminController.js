import mongoose from "mongoose";
import { Attempt } from "../models/Attempt.js";
import { Category } from "../models/Category.js";
import { Question } from "../models/Question.js";
import { Quiz } from "../models/Quiz.js";
import { User } from "../models/User.js";
import { ApiError, asyncHandler } from "../utils/apiError.js";

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [users, quizzes, questions, attempts] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Quiz.countDocuments(),
    Question.countDocuments(),
    Attempt.find().populate("quizId", "title category difficulty").populate("userId", "name email")
  ]);

  const averageAccuracy =
    attempts.length === 0
      ? 0
      : Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length);

  res.json({
    stats: {
      users,
      quizzes,
      questions,
      attempts: attempts.length,
      averageAccuracy
    },
    attempts: attempts.slice(-25).reverse()
  });
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

export const getAllAttempts = asyncHandler(async (_req, res) => {
  const attempts = await Attempt.find()
    .populate("quizId", "title category difficulty")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.json({ attempts });
});

export const getQuestions = asyncHandler(async (_req, res) => {
  const questions = await Question.find()
    .populate("quizId", "title category difficulty")
    .sort({ createdAt: -1 });

  res.json({ questions });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ quiz });
});

export const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  res.json({ quiz });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  await Question.deleteMany({ quizId: quiz._id });
  await quiz.deleteOne();
  res.json({ message: "Quiz deleted" });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const payload = normalizeQuestionPayload(req.body);
  const question = await Question.create(payload);
  res.status(201).json({ question });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const payload = normalizeQuestionPayload(req.body);
  const question = await Question.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  res.json({ question });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  res.json({ message: "Question deleted" });
});

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories: categories.map((category) => category.name) });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const category = await Category.findOneAndUpdate(
    { name: name.trim() },
    { name: name.trim() },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json({ category: category.name });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { name } = req.params;
  await Category.findOneAndDelete({ name });
  await Quiz.updateMany({ category: name }, { category: "Uncategorized" });
  res.json({ message: "Category reassigned to Uncategorized" });
});

const normalizeQuestionPayload = (body) => {
  const payload = { ...body };

  if (Array.isArray(payload.options) && Number.isInteger(payload.correctIndex)) {
    payload.options = payload.options.map((option) => ({
      _id: option._id || new mongoose.Types.ObjectId(),
      text: option.text
    }));
    payload.correctOptionId = payload.options[payload.correctIndex]?._id;
    delete payload.correctIndex;
  }

  return payload;
};
