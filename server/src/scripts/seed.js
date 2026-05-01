import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Attempt } from "../models/Attempt.js";
import { Category } from "../models/Category.js";
import { Question } from "../models/Question.js";
import { Quiz } from "../models/Quiz.js";
import { User } from "../models/User.js";

dotenv.config();

await connectDB();

await Promise.all([
  Attempt.deleteMany({}),
  Category.deleteMany({}),
  Question.deleteMany({}),
  Quiz.deleteMany({}),
  User.deleteMany({})
]);

await Category.create([{ name: "Tech" }, { name: "Science" }, { name: "GK" }]);

const [admin, student] = await User.create([
  { name: "QuizMaster Admin", email: "admin@quizmaster.test", password: "Admin@12345", role: "admin" },
  { name: "Demo Student", email: "student@quizmaster.test", password: "Student@12345", role: "user" }
]);

const quizzes = await Quiz.create([
  {
    title: "Modern JavaScript Essentials",
    description: "Core JavaScript concepts used in full stack apps.",
    category: "Tech",
    difficulty: "Easy",
    timeLimit: 420,
    questionLimit: 5,
    createdBy: admin._id
  },
  {
    title: "Science Sprint",
    description: "A quick test of everyday science fundamentals.",
    category: "Science",
    difficulty: "Medium",
    timeLimit: 480,
    questionLimit: 5,
    createdBy: admin._id
  },
  {
    title: "General Knowledge Mix",
    description: "World facts, history, and current-awareness basics.",
    category: "GK",
    difficulty: "Hard",
    timeLimit: 540,
    questionLimit: 5,
    createdBy: admin._id
  }
]);

const makeQuestion = (quizId, text, options, correctIndex, explanation) => {
  const optionDocs = options.map((option) => ({ _id: new mongoose.Types.ObjectId(), text: option }));
  return {
    quizId,
    text,
    options: optionDocs,
    correctOptionId: optionDocs[correctIndex]._id,
    explanation
  };
};

await Question.create([
  makeQuestion(quizzes[0]._id, "Which keyword declares a block-scoped variable?", ["var", "let", "global", "static"], 1, "`let` is block scoped."),
  makeQuestion(quizzes[0]._id, "What does JSON stand for?", ["JavaScript Object Notation", "Java Source Open Network", "Joined Script Object Node", "Java Standard Object Name"], 0, "JSON is a lightweight data format."),
  makeQuestion(quizzes[0]._id, "Which method converts JSON text into an object?", ["JSON.toObject", "JSON.parse", "Object.fromJSON", "parse.JSON"], 1, "JSON.parse converts a JSON string to a JavaScript value."),
  makeQuestion(quizzes[0]._id, "Which array method returns a new filtered array?", ["map", "filter", "reduce", "forEach"], 1, "filter keeps values that pass a predicate."),
  makeQuestion(quizzes[0]._id, "What does an async function return?", ["String", "Promise", "Callback", "Iterator"], 1, "Async functions always return promises."),
  makeQuestion(quizzes[1]._id, "What planet is known as the Red Planet?", ["Venus", "Mars", "Jupiter", "Mercury"], 1, "Iron oxide on Mars gives it a reddish appearance."),
  makeQuestion(quizzes[1]._id, "What gas do plants absorb for photosynthesis?", ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], 2, "Plants use carbon dioxide, water, and light."),
  makeQuestion(quizzes[1]._id, "What is H2O commonly called?", ["Hydrogen", "Salt", "Water", "Ozone"], 2, "H2O is water."),
  makeQuestion(quizzes[1]._id, "What force keeps planets in orbit?", ["Friction", "Gravity", "Magnetism", "Buoyancy"], 1, "Gravity attracts bodies with mass."),
  makeQuestion(quizzes[1]._id, "What part of the cell contains DNA?", ["Ribosome", "Nucleus", "Membrane", "Cytoplasm"], 1, "The nucleus stores genetic material in eukaryotic cells."),
  makeQuestion(quizzes[2]._id, "Which continent has the most countries?", ["Asia", "Africa", "Europe", "South America"], 1, "Africa has the highest number of recognized countries."),
  makeQuestion(quizzes[2]._id, "Who wrote 'Discovery of India'?", ["Mahatma Gandhi", "Jawaharlal Nehru", "B. R. Ambedkar", "Sardar Patel"], 1, "Nehru wrote it while imprisoned."),
  makeQuestion(quizzes[2]._id, "What is the largest ocean?", ["Atlantic", "Indian", "Pacific", "Arctic"], 2, "The Pacific Ocean is the largest."),
  makeQuestion(quizzes[2]._id, "Which currency is used in Japan?", ["Won", "Yen", "Yuan", "Baht"], 1, "Japan uses the yen."),
  makeQuestion(quizzes[2]._id, "What is the capital of Australia?", ["Sydney", "Melbourne", "Canberra", "Perth"], 2, "Canberra is Australia's capital.")
]);

console.log("Seed completed");
console.log(`Admin: ${admin.email} / Admin@12345`);
console.log(`User: ${student.email} / Student@12345`);

await mongoose.disconnect();
