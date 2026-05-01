import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Shell } from "./components/Shell.jsx";
import { Admin } from "./pages/Admin.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { History } from "./pages/History.jsx";
import { Login } from "./pages/Login.jsx";
import { QuizPlayer } from "./pages/QuizPlayer.jsx";
import { Quizzes } from "./pages/Quizzes.jsx";
import { Register } from "./pages/Register.jsx";
import { Result } from "./pages/Result.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<QuizPlayer />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
