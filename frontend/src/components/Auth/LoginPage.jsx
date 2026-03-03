import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function LoginPage() {
  const { user, loginGoogle } = useAuth();
  if (user) return <Navigate to="/" />;
  const handleLogin = async () => { try { await loginGoogle(); } catch { toast.error("Inloggen mislukt"); } };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        <div className="text-5xl mb-4">&#x1F0CF;</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">FlashLearn</h1>
        <p className="text-gray-500 mb-8">Leer woorden met slimme flashcards en AI</p>
        <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all shadow-sm">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Inloggen met Google
        </button>
      </div>
    </div>
  );
}