import React from "react";

export const StatCard = ({ label, value, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-700"
  };

  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-3 inline-flex rounded px-3 py-1 text-2xl font-black ${tones[tone]}`}>
        {value}
      </p>
    </div>
  );
};
