import React from "react";
import { useEffect, useState } from "react";
import { http } from "../api/http.js";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Loader } from "../components/Loader.jsx";
import { StatCard } from "../components/StatCard.jsx";

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/user/dashboard")
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load dashboard"));
  }, []);

  if (error) return <ErrorBanner message={error} />;
  if (!data) return <Loader label="Loading dashboard" />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-slate-950">Dashboard</h1>
        <p className="mt-1 text-slate-500">Your quiz progress, accuracy, and recent attempts.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Quizzes Attempted" value={data.stats.totalQuizzesAttempted} />
        <StatCard label="Average Score" value={data.stats.averageScore} tone="teal" />
        <StatCard label="Accuracy" value={`${data.stats.accuracy}%`} tone="amber" />
        <StatCard label="Correct Answers" value={data.stats.totalCorrect} tone="slate" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Score History</h2>
          <div className="mt-5 space-y-3">
            {data.scoreHistory.slice(0, 8).map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div>
                  <p className="truncate text-sm font-semibold text-slate-800">{item.quizName}</p>
                  <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <div className="h-2 w-28 overflow-hidden rounded bg-slate-100">
                  <div className="h-full bg-mint" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
            {data.scoreHistory.length === 0 && <p className="text-sm text-slate-500">No attempts yet.</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-black text-slate-950">Recent Attempts</h2>
          </div>
          <AttemptTable attempts={data.recentAttempts} />
        </div>
      </section>
    </div>
  );
};

export const AttemptTable = ({ attempts }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
        <tr>
          <th className="px-5 py-3">Quiz</th>
          <th className="px-5 py-3">Score</th>
          <th className="px-5 py-3">Correct</th>
          <th className="px-5 py-3">Incorrect</th>
          <th className="px-5 py-3">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {attempts.map((attempt) => (
          <tr key={attempt.id}>
            <td className="px-5 py-4 font-semibold text-slate-800">{attempt.quizName}</td>
            <td className="px-5 py-4">{attempt.score}</td>
            <td className="px-5 py-4 text-teal-700">{attempt.correct}</td>
            <td className="px-5 py-4 text-rose-700">{attempt.incorrect}</td>
            <td className="px-5 py-4 text-slate-500">{new Date(attempt.date).toLocaleDateString()}</td>
          </tr>
        ))}
        {attempts.length === 0 && (
          <tr>
            <td className="px-5 py-8 text-center text-slate-500" colSpan="5">
              No quiz attempts found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
