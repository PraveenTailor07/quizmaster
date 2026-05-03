import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  // 🔥 FRONTEND SERVE (IMPORTANT)
  app.use(express.static("client/dist"));

  // API routes
  app.get("/health", (_req, res) => res.json({ status: "ok", app: "QuizMaster" }));
  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/quizzes", quizRoutes);
  app.use("/quiz", quizRoutes);
  app.use("/admin", adminRoutes);

  // fallback (React routing support)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("client/dist/index.html"));
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};