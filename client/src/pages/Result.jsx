import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { StatCard } from "../components/StatCard.jsx";

export const Result = () => {
  const { state } = useLocation();

  if (!state) {
    return <Navigate to="/quizzes" replace />;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-slate-950">Result</h1>
        <p className="mt-1 text-slate-500">Attempt saved with automatic scoring.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Questions" value={state.totalQuestions} />
        <StatCard label="Correct Answers" value={state.correctAnswers} tone="teal" />
        <StatCard label="Incorrect Answers" value={state.incorrectAnswers} tone="amber" />
        <StatCard label="Percentage" value={`${state.percentage}%`} tone="slate" />
      </section>

      <section className="space-y-4">
        {state.questions.map((question, index) => (
          <article key={question.id} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Question {index + 1}</p>
            <h2 className="mt-2 text-lg font-black text-slate-950">{question.text}</h2>
            <div className="mt-4 grid gap-2">
              {question.options.map((option) => {
                const isCorrect = option.id === question.correctOptionId;
                const isSelected = option.id === question.selectedOptionId;
                const tone = isCorrect
                  ? "border-teal-300 bg-teal-50 text-teal-800"
                  : isSelected
                    ? "border-rose-300 bg-rose-50 text-rose-800"
                    : "border-slate-200 bg-white text-slate-600";

                return (
                  <div key={option.id} className={`flex items-center gap-3 rounded border px-3 py-3 ${tone}`}>
                    {isCorrect ? <CheckCircle2 size={18} /> : isSelected ? <XCircle size={18} /> : <span className="w-[18px]" />}
                    <span className="font-semibold">{option.text}</span>
                  </div>
                );
              })}
            </div>
            {question.explanation && <p className="mt-3 text-sm text-slate-500">{question.explanation}</p>}
          </article>
        ))}
      </section>

      <Link
        to="/dashboard"
        className="focus-ring inline-flex rounded bg-brand px-5 py-3 font-black text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};
