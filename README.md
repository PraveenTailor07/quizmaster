# QuizMaster - Smart Online Quiz Platform

QuizMaster is a full stack MERN application with JWT authentication, quiz attempts, score history, responsive dashboards, and an admin panel for managing quizzes, categories, questions, users, and analytics.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT with bcrypt password hashing

## Project Structure

```text
client/   React + Tailwind frontend
server/   Express MVC backend
```

## Setup

1. Install dependencies:

```bash
npm.cmd run install:all
```

2. Configure backend environment:

```bash
copy server\.env.example server\.env
```

3. Update `server/.env` with your MongoDB connection string and JWT secret.

4. Seed demo data:

```bash
npm.cmd run seed --prefix server
```

5. Run both apps:

```bash
npm.cmd run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:5000

## Demo Accounts After Seeding

- Admin: `admin@quizmaster.test` / `Admin@12345`
- User: `student@quizmaster.test` / `Student@12345`

## Required API Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /user/dashboard`
- `GET /quizzes`
- `POST /quiz/submit`
- `GET /user/history`
- Admin CRUD routes under `/admin`
