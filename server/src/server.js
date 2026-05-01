import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

await connectDB();

const app = createApp();

app.listen(PORT, () => {
  console.log(`QuizMaster API running on port ${PORT}`);
});
