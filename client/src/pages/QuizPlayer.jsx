import React from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "../api/http.js";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Loader } from "../components/Loader.jsx";

export const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    http
      .get(`/quizzes/${id}`)
      .then((response) => {
        setQuizData(response.data);
        setRemaining(response.data.quiz.timeLimit);
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load quiz"));
  }, [id]);

  const answerPayload = useMemo(
    () =>
      (quizData?.questions || []).map((question) => ({
        questionId: question.id,
        selectedOptionId: answers[question.id] || null
      })),
    [answers, quizData]
  );

  const submit = async () => {
    if (!quizData || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const { data } = await http.post("/quiz/submit", {
        quizId: quizData.quiz._id,
        answers: answerPayload
      });
      navigate("/result", { state: data });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!quizData || remaining <= 0) return;

    const timer = setInterval(() => setRemaining((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [quizData, remaining]);

  useEffect(() => {
    if (quizData && remaining === 0) {
      submit();
    }
  }, [remaining, quizData]);

  if (error) return <ErrorBanner message={error} />;
  if (!quizData) return <Loader label="Loading quiz" />;

  const question = quizData.questions[current];
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand">{quizData.quiz.category}</p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">{quizData.quiz.title}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded bg-amber-50 px-3 py-2 font-black text-amber-700">
            <Clock size={18} />
            {minutes}:{seconds}
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded bg-slate-100">
          <div
            className="h-full bg-brand transition-all"
            style={{ width: `${((current + 1) / quizData.questions.length) * 100}%` }}
          />
        </div>
      </header>

      <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-slate-500">
          Question {current + 1} of {quizData.questions.length}
        </p>
        <h2 className="mt-3 text-xl font-black text-slate-950">{question.text}</h2>

        <div className="mt-6 grid gap-3">
          {question.options.map((option) => {
            const checked = answers[question.id] === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setAnswers({ ...answers, [question.id]: option.id })}
                className={`focus-ring rounded border px-4 py-4 text-left font-semibold ${
                  checked
                    ? "border-brand bg-blue-50 text-brand"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            <button
              type="button"
              disabled={current === 0}
              onClick={() => setCurrent((value) => value - 1)}
              className="focus-ring inline-flex items-center gap-2 rounded border border-slate-300 px-4 py-3 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft size={18} /> Previous
            </button>
            <button
              type="button"
              disabled={current === quizData.questions.length - 1}
              onClick={() => setCurrent((value) => value + 1)}
              className="focus-ring inline-flex items-center gap-2 rounded border border-slate-300 px-4 py-3 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next <ArrowRight size={18} />
            </button>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="focus-ring rounded bg-mint px-5 py-3 font-black text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        </footer>
      </section>
    </div>
  );
};
