import React from "react";
import { BarChart3, ClipboardList, History, LogOut, ShieldCheck } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/quizzes", label: "Quizzes", icon: ClipboardList },
  { to: "/history", label: "History", icon: History }
];

export const Shell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-x-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:inset-y-0 lg:left-0 lg:right-auto lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center justify-between px-4 lg:h-full lg:flex-col lg:items-stretch lg:py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded bg-brand text-lg font-black text-white">
              Q
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">QuizMaster</p>
              <p className="text-xs text-slate-500">{user?.name}</p>
            </div>
          </div>

          <nav className="hidden gap-2 lg:flex lg:flex-col">
            {navItems.map((item) => (
              <NavButton key={item.to} {...item} />
            ))}
            {user?.role === "admin" && <NavButton to="/admin" label="Admin" icon={ShieldCheck} />}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white lg:hidden">
        {navItems.map((item) => (
          <MobileNavButton key={item.to} {...item} />
        ))}
        {user?.role === "admin" ? (
          <MobileNavButton to="/admin" label="Admin" icon={ShieldCheck} />
        ) : (
          <div />
        )}
      </nav>

      <main className="px-4 pb-24 pt-20 sm:px-6 lg:ml-64 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
};

const NavButton = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `focus-ring inline-flex items-center gap-3 rounded px-3 py-2 text-sm font-semibold ${
        isActive ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-100"
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

const MobileNavButton = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold ${
        isActive ? "text-brand" : "text-slate-500"
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);
