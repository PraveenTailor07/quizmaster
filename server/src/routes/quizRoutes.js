import express from "express";
import { getQuizById, getQuizzes, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getQuizzes);
router.get("/:id", protect, getQuizById);
router.post("/submit", protect, submitQuiz);

export default router;
