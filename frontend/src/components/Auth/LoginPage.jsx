import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { user, loginGoogle } = useAuth();
  if (user) return <Navigate to="/dashboard" />;

  const handleLogin = async () => {
    try { await loginGoogle(); }
    catch (err) { console.error("Login fout:", err.code); }
  };

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)" }} />
      </div>
      <div className="relative glass rounded-2xl p-10 w-full max-w-sm text-center animate-scale-in glow-violet">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg">
          F
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Welkom bij FlashLearn</h1>
        <p className="text-slate-500 text-sm mb-8">Log in om verder te gaan</p>
        <button onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 glass glass-hover text-slate-200 font-medium py-3 px-6 rounded-xl transition-all text-sm">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
          Inloggen met Google
        </button>
      </div>
    </div>
  );
}