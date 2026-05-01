import React from "react";
import { Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http.js";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Loader } from "../components/Loader.jsx";

export const Quizzes = () => {
  const [quizzes, setQuizzes] = useState(null);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);

    http
      .get(`/quizzes?${params.toString()}`)
      .then((response) => setQuizzes(response.data.quizzes))
      .catch((err) => setError(err.response?.data?.message || "Unable to load quizzes"));
  }, [category, difficulty]);

  const categories = useMemo(() => [...new Set((quizzes || []).map((quiz) => quiz.category))], [quizzes]);

  if (error) return <ErrorBanner message={error} />;
  if (!quizzes) return <Loader label="Loading quizzes" />;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Quizzes</h1>
          <p className="mt-1 text-slate-500">Choose a category, difficulty, and begin when ready.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select value={category} onChange={setCategory} options={categories} placeholder="All Categories" />
          <Select value={difficulty} onChange={setDifficulty} options={["Easy", "Medium", "Hard"]} placeholder="All Difficulties" />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((quiz) => (
          <article key={quiz._id} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand">{quiz.category}</p>
                <h2 className="mt-2 text-xl font-black text-slate-950">{quiz.title}</h2>
              </div>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                {quiz.difficulty}
              </span>
            </div>
            <p className="mt-3 min-h-12 text-sm text-slate-500">{quiz.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
              <span>{quiz.questionCount} questions</span>
              <span>{Math.round(quiz.timeLimit / 60)} min</span>
            </div>
            <Link
              to={`/quiz/${quiz._id}`}
              className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-3 font-bold text-white hover:bg-blue-700"
            >
              <Play size={18} /> Start Quiz
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

const Select = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="focus-ring rounded border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-700"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option value={option} key={option}>
        {option}
      </option>
    ))}
  </select>
);
