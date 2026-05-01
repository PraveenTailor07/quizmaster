import { Attempt } from "../models/Attempt.js";
import { asyncHandler } from "../utils/apiError.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ userId: req.user._id })
    .populate("quizId", "title category difficulty")
    .sort({ createdAt: -1 });

  const totalQuizzesAttempted = attempts.length;
  const totalCorrect = attempts.reduce((sum, attempt) => sum + attempt.correctCount, 0);
  const totalQuestions = attempts.reduce(
    (sum, attempt) => sum + attempt.correctCount + attempt.incorrectCount,
    0
  );
  const averageScore =
    totalQuizzesAttempted === 0
      ? 0
      : Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalQuizzesAttempted);
  const accuracy = totalQuestions === 0 ? 0 : Math.round((totalCorrect / totalQuestions) * 100);

  res.json({
    stats: {
      totalQuizzesAttempted,
      averageScore,
      accuracy,
      totalCorrect,
      totalIncorrect: Math.max(totalQuestions - totalCorrect, 0)
    },
    scoreHistory: attempts.map((attempt) => ({
      id: attempt._id,
      quizName: attempt.quizId?.title || "Deleted quiz",
      score: attempt.score,
      percentage: attempt.percentage,
      date: attempt.createdAt
    })),
    recentAttempts: attempts.slice(0, 8).map((attempt) => ({
      id: attempt._id,
      quizName: attempt.quizId?.title || "Deleted quiz",
      category: attempt.quizId?.category || "Unknown",
      difficulty: attempt.quizId?.difficulty || "Unknown",
      score: attempt.score,
      correct: attempt.correctCount,
      incorrect: attempt.incorrectCount,
      percentage: attempt.percentage,
      date: attempt.createdAt
    }))
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ userId: req.user._id })
    .populate("quizId", "title category difficulty")
    .sort({ createdAt: -1 });

  res.json({
    attempts: attempts.map((attempt) => ({
      id: attempt._id,
      quizName: attempt.quizId?.title || "Deleted quiz",
      category: attempt.quizId?.category || "Unknown",
      difficulty: attempt.quizId?.difficulty || "Unknown",
      score: attempt.score,
      correct: attempt.correctCount,
      incorrect: attempt.incorrectCount,
      percentage: attempt.percentage,
      date: attempt.createdAt
    }))
  });
});
