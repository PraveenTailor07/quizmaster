import express from "express";
import { login, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", (_req, res) => res.json({ message: "Logged out" }));
router.get("/me", protect, me);

export default router;
