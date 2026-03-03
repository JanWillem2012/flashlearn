import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, loginGoogle, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={"fixed top-0 left-0 right-0 z-50 transition-all duration-500 " +
      (scrolled ? "glass shadow-2xl" : "bg-transparent")}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm shadow-lg group-hover:shadow-violet-500/40 transition-all">
            F
          </div>
          <span className="font-bold text-white tracking-tight">FlashLearn</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button onClick={() => nav("/dashboard")}
                className="text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                Dashboard
              </button>
              <button onClick={logout}
                className="btn-ghost text-slate-300 text-sm px-4 py-2 rounded-lg">
                <span>Uitloggen</span>
              </button>
            </>
          ) : (
            <button onClick={loginGoogle}
              className="btn-primary text-white text-sm font-medium px-5 py-2 rounded-xl">
              <span>Inloggen</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}