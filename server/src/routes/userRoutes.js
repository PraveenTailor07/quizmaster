import express from "express";
import { getDashboard, getHistory } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboard);
router.get("/history", protect, getHistory);

export default router;
