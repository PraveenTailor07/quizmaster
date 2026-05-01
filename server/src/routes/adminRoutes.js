import express from "express";
import {
  createCategory,
  createQuestion,
  createQuiz,
  deleteCategory,
  deleteQuestion,
  deleteQuiz,
  getAllAttempts,
  getAnalytics,
  getCategories,
  getQuestions,
  getUsers,
  updateQuestion,
  updateQuiz
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/analytics", getAnalytics);
router.get("/users", getUsers);
router.get("/attempts", getAllAttempts);
router.get("/questions", getQuestions);

router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.delete("/categories/:name", deleteCategory);

router.post("/quizzes", createQuiz);
router.put("/quizzes/:id", updateQuiz);
router.delete("/quizzes/:id", deleteQuiz);

router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
