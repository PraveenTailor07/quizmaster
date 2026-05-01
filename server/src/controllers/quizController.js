import mongoose from "mongoose";
import { Attempt } from "../models/Attempt.js";
import { Question } from "../models/Question.js";
import { Quiz } from "../models/Quiz.js";
import { ApiError, asyncHandler } from "../utils/apiError.js";

const toClientQuestion = (question) => ({
  id: question._id,
  text: question.text,
  options: question.options.map((option) => ({
    id: option._id,
    text: option.text
  }))
});

export const getQuizzes = asyncHandler(async (req, res) => {
  const { category, difficulty } = req.query;
  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;

  const quizzes = await Quiz.find(filter).sort({ createdAt: -1 }).lean();
  const quizIds = quizzes.map((quiz) => quiz._id);
  const counts = await Question.aggregate([
    { $match: { quizId: { $in: quizIds } } },
    { $group: { _id: "$quizId", total: { $sum: 1 } } }
  ]);
  const countMap = new Map(counts.map((item) => [item._id.toString(), item.total]));

  res.json({
    quizzes: quizzes.map((quiz) => ({
      ...quiz,
      questionCount: countMap.get(quiz._id.toString()) || 0
    }))
  });
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, isPublished: true }).lean();

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const questions = await Question.aggregate([
    { $match: { quizId: new mongoose.Types.ObjectId(req.params.id) } },
    { $sample: { size: quiz.questionLimit } }
  ]);

  res.json({
    quiz,
    questions: questions.map(toClientQuestion)
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId, answers = [] } = req.body;

  if (!quizId || !Array.isArray(answers)) {
    throw new ApiError(400, "quizId and answers are required");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const requestedQuestionIds = answers.map((answer) => answer.questionId);
  const questions = await Question.find({
    _id: { $in: requestedQuestionIds },
    quizId
  });
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.selectedOptionId]));

  const gradedAnswers = questions.map((question) => {
    const selectedOptionId = answerMap.get(question._id.toString()) || null;
    const isCorrect =
      selectedOptionId && question.correctOptionId.toString() === selectedOptionId.toString();

    return {
      questionId: question._id,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect: Boolean(isCorrect)
    };
  });

  const correctCount = gradedAnswers.filter((answer) => answer.isCorrect).length;
  const incorrectCount = Math.max(questions.length - correctCount, 0);
  const percentage = questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 100);
  const score = correctCount * 10;

  const attempt = await Attempt.create({
    userId: req.user._id,
    quizId,
    answers: gradedAnswers,
    correctCount,
    incorrectCount,
    score,
    percentage
  });

  const resultQuestions = questions.map((question) => {
    const selectedOptionId = answerMap.get(question._id.toString()) || null;

    return {
      id: question._id,
      text: question.text,
      options: question.options.map((option) => ({
        id: option._id,
        text: option.text
      })),
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      explanation: question.explanation
    };
  });

  res.status(201).json({
    attemptId: attempt._id,
    totalQuestions: questions.length,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    percentage,
    score,
    questions: resultQuestions
  });
});
