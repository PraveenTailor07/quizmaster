import React from "react";
export const ErrorBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div className="rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
      {message}
    </div>
  );
};
