import React from "react";
import { useEffect, useState } from "react";
import { http } from "../api/http.js";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Loader } from "../components/Loader.jsx";
import { AttemptTable } from "./Dashboard.jsx";

export const History = () => {
  const [attempts, setAttempts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    http
      .get("/user/history")
      .then((response) => setAttempts(response.data.attempts))
      .catch((err) => setError(err.response?.data?.message || "Unable to load history"));
  }, []);

  if (error) return <ErrorBanner message={error} />;
  if (!attempts) return <Loader label="Loading history" />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-slate-950">Attempt History</h1>
        <p className="mt-1 text-slate-500">Every saved quiz attempt with score and answer counts.</p>
      </header>
      <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
        <AttemptTable attempts={attempts} />
      </div>
    </div>
  );
};
