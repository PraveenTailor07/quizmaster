import React from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { http } from "../api/http.js";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Loader } from "../components/Loader.jsx";
import { StatCard } from "../components/StatCard.jsx";

const emptyQuiz = {
  title: "",
  description: "",
  category: "Tech",
  difficulty: "Easy",
  timeLimit: 600,
  questionLimit: 5,
  isPublished: true
};

const emptyQuestion = {
  quizId: "",
  text: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: ""
};

export const Admin = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyQuiz);
  const [editingId, setEditingId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingQuestionId, setEditingQuestionId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [analyticsResponse, usersResponse, quizzesResponse, categoriesResponse, questionsResponse] = await Promise.all([
      http.get("/admin/analytics"),
      http.get("/admin/users"),
      http.get("/quizzes"),
      http.get("/admin/categories"),
      http.get("/admin/questions")
    ]);
    setAnalytics(analyticsResponse.data);
    setUsers(usersResponse.data.users);
    setQuizzes(quizzesResponse.data.quizzes);
    setCategories(categoriesResponse.data.categories);
    setQuestions(questionsResponse.data.questions);
  };

  useEffect(() => {
    load().catch((err) => setError(err.response?.data?.message || "Unable to load admin panel"));
  }, []);

  const createQuiz = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await http.put(`/admin/quizzes/${editingId}`, form);
      } else {
        await http.post("/admin/quizzes", form);
      }
      setForm(emptyQuiz);
      setEditingId("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create quiz");
    } finally {
      setSaving(false);
    }
  };

  const deleteQuiz = async (id) => {
    await http.delete(`/admin/quizzes/${id}`);
    await load();
  };

  const editQuiz = (quiz) => {
    setEditingId(quiz._id);
    setForm({
      title: quiz.title,
      description: quiz.description || "",
      category: quiz.category,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questionLimit: quiz.questionLimit,
      isPublished: quiz.isPublished
    });
  };

  const createCategory = async (event) => {
    event.preventDefault();
    await http.post("/admin/categories", { name: categoryName });
    setCategoryName("");
    await load();
  };

  const deleteCategory = async (name) => {
    await http.delete(`/admin/categories/${encodeURIComponent(name)}`);
    await load();
  };

  const createQuestion = async (event) => {
    event.preventDefault();
    const options = questionForm.options.map((text) => ({ text }));

    const payload = {
      quizId: questionForm.quizId,
      text: questionForm.text,
      options,
      correctIndex: questionForm.correctIndex,
      explanation: questionForm.explanation
    };

    if (editingQuestionId) {
      await http.put(`/admin/questions/${editingQuestionId}`, payload);
    } else {
      await http.post("/admin/questions", payload);
    }
    setQuestionForm(emptyQuestion);
    setEditingQuestionId("");
    await load();
  };

  const editQuestion = (question) => {
    const options = question.options.map((option) => option.text);
    const correctIndex = question.options.findIndex((option) => option._id === question.correctOptionId);

    setEditingQuestionId(question._id);
    setQuestionForm({
      quizId: question.quizId?._id || question.quizId,
      text: question.text,
      options,
      correctIndex: Math.max(correctIndex, 0),
      explanation: question.explanation || ""
    });
  };

  const deleteQuestion = async (id) => {
    await http.delete(`/admin/questions/${id}`);
    await load();
  };

  if (error) return <ErrorBanner message={error} />;
  if (!analytics) return <Loader label="Loading admin panel" />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-slate-950">Admin Panel</h1>
        <p className="mt-1 text-slate-500">Manage quizzes, users, attempts, and platform analytics.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Users" value={analytics.stats.users} />
        <StatCard label="Quizzes" value={analytics.stats.quizzes} tone="teal" />
        <StatCard label="Questions" value={analytics.stats.questions} tone="amber" />
        <StatCard label="Attempts" value={analytics.stats.attempts} tone="slate" />
        <StatCard label="Avg Accuracy" value={`${analytics.stats.averageAccuracy}%`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={createQuiz} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">{editingId ? "Edit Quiz" : "Create Quiz"}</h2>
          <div className="mt-4 grid gap-3">
            <AdminInput label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
            <AdminInput
              label="Description"
              value={form.description}
              onChange={(description) => setForm({ ...form, description })}
            />
            <AdminInput label="Category" value={form.category} onChange={(category) => setForm({ ...form, category })} />
            <select
              value={form.difficulty}
              onChange={(event) => setForm({ ...form, difficulty: event.target.value })}
              className="focus-ring rounded border border-slate-300 px-3 py-3"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <AdminInput
                label="Time Limit"
                type="number"
                value={form.timeLimit}
                onChange={(timeLimit) => setForm({ ...form, timeLimit: Number(timeLimit) })}
              />
              <AdminInput
                label="Question Limit"
                type="number"
                value={form.questionLimit}
                onChange={(questionLimit) => setForm({ ...form, questionLimit: Number(questionLimit) })}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-brand px-4 py-3 font-black text-white disabled:opacity-70"
            >
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {saving ? "Saving..." : editingId ? "Save Quiz" : "Create Quiz"}
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          <AdminList title="Quizzes">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 last:border-0">
                <div>
                  <p className="font-bold text-slate-800">{quiz.title}</p>
                  <p className="text-sm text-slate-500">
                    {quiz.category} · {quiz.difficulty} · {quiz.questionCount} questions
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editQuiz(quiz)}
                    className="focus-ring inline-flex h-10 items-center justify-center rounded border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteQuiz(quiz._id)}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded border border-rose-200 text-rose-700 hover:bg-rose-50"
                    title="Delete quiz"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </AdminList>

          <AdminList title="Categories">
            <form onSubmit={createCategory} className="grid gap-3 border-b border-slate-100 p-5 sm:grid-cols-[1fr_auto]">
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                className="focus-ring rounded border border-slate-300 px-3 py-3"
                placeholder="Category name"
                required
              />
              <button type="submit" className="focus-ring rounded bg-brand px-4 py-3 font-black text-white">
                Add
              </button>
            </form>
            {categories.map((category) => (
              <div key={category} className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-0">
                <p className="font-bold text-slate-800">{category}</p>
                <button
                  type="button"
                  onClick={() => deleteCategory(category)}
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded border border-rose-200 text-rose-700 hover:bg-rose-50"
                  title="Delete category"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </AdminList>

          <form onSubmit={createQuestion} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">
              {editingQuestionId ? "Edit Question" : "Create Question"}
            </h2>
            <div className="mt-4 grid gap-3">
              <select
                value={questionForm.quizId}
                onChange={(event) => setQuestionForm({ ...questionForm, quizId: event.target.value })}
                className="focus-ring rounded border border-slate-300 px-3 py-3"
                required
              >
                <option value="">Select quiz</option>
                {quizzes.map((quiz) => (
                  <option value={quiz._id} key={quiz._id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
              <AdminInput
                label="Question"
                value={questionForm.text}
                onChange={(text) => setQuestionForm({ ...questionForm, text })}
              />
              {questionForm.options.map((option, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr] items-end gap-3">
                  <label className="grid gap-1 text-xs font-bold text-slate-500">
                    Correct
                    <input
                      type="radio"
                      checked={questionForm.correctIndex === index}
                      onChange={() => setQuestionForm({ ...questionForm, correctIndex: index })}
                      className="h-5 w-5"
                    />
                  </label>
                  <AdminInput
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(text) => {
                      const options = [...questionForm.options];
                      options[index] = text;
                      setQuestionForm({ ...questionForm, options });
                    }}
                  />
                </div>
              ))}
              <AdminInput
                label="Explanation"
                value={questionForm.explanation}
                onChange={(explanation) => setQuestionForm({ ...questionForm, explanation })}
              />
              <button type="submit" className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-mint px-4 py-3 font-black text-white">
                {editingQuestionId ? <Save size={18} /> : <Plus size={18} />}
                {editingQuestionId ? "Save Question" : "Create Question"}
              </button>
            </div>
          </form>

          <AdminList title="Questions">
            {questions.map((question) => (
              <div key={question._id} className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 last:border-0">
                <div>
                  <p className="font-bold text-slate-800">{question.text}</p>
                  <p className="text-sm text-slate-500">{question.quizId?.title || "Deleted quiz"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editQuestion(question)}
                    className="focus-ring inline-flex h-10 items-center justify-center rounded border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(question._id)}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded border border-rose-200 text-rose-700 hover:bg-rose-50"
                    title="Delete question"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </AdminList>

          <AdminList title="Users">
            {users.map((user) => (
              <div key={user._id} className="grid gap-1 border-b border-slate-100 px-5 py-4 last:border-0">
                <p className="font-bold text-slate-800">{user.name}</p>
                <p className="text-sm text-slate-500">
                  {user.email} · {user.role}
                </p>
              </div>
            ))}
          </AdminList>
        </div>
      </section>
    </div>
  );
};

const AdminList = ({ title, children }) => (
  <section className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 px-5 py-4">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
    </div>
    {children}
  </section>
);

const AdminInput = ({ label, value, onChange, type = "text" }) => (
  <label className="grid gap-1 text-sm font-semibold text-slate-700">
    {label}
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="focus-ring rounded border border-slate-300 px-3 py-3"
      required
    />
  </label>
);
