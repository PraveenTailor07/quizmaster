import React from "react";

export const Loader = ({ label = "Loading" }) => (
  <div className="flex min-h-52 items-center justify-center rounded border border-slate-200 bg-white">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
    <span className="ml-3 text-sm font-semibold text-slate-500">{label}</span>
  </div>
);
