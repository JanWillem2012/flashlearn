import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, BookOpen, BarChart2, LogOut } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/lists",     icon: BookOpen,        label: "Lijsten" },
  { to: "/stats",     icon: BarChart2,       label: "Stats" },
];

export default function AppLayout({ children, title, back }) {
  const { user, logout } = useAuth();
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      {/* Achtergrond */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Top nav */}
      <nav className="glass border-b border-white/5 px-6 py-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 mr-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">F</div>
          </Link>
          {navItems.map(n => (
            <Link key={n.to} to={n.to}
              className={"flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all " +
                (loc.pathname === n.to
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5")}>
              <n.icon size={14} />
              {n.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600">{user?.displayName}</span>
          <button onClick={logout}
            className="btn-ghost p-1.5 rounded-lg text-slate-500 hover:text-slate-300">
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}