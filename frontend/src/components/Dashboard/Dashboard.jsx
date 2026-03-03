import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLists, getDueWords, getStats } from "../../firebase/db";
import { BookOpen, BarChart2, Clock, LogOut } from "lucide-react";
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [lists, setLists] = useState([]);
  const [dueCount, setDueCount] = useState(0);
  const [stats, setStats] = useState([]);
  useEffect(() => {
    getLists(user.uid).then(setLists);
    getDueWords(user.uid).then(w => setDueCount(w.length));
    getStats(user.uid).then(setStats);
  }, [user.uid]);
  const avgScore = stats.length ? Math.round(stats.slice(0,10).reduce((a,s) => a+s.score,0) / Math.min(stats.length,10)) : 0;
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow">
        <span className="text-xl font-bold">FlashLearn</span>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80">{user.displayName}</span>
          <button onClick={logout} className="hover:bg-indigo-600 p-2 rounded-lg"><LogOut size={18} /></button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welkom terug, {user.displayName?.split(" ")[0]}!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<BookOpen className="text-indigo-500" />} label="Woordenlijsten" value={lists.length} />
          <StatCard icon={<Clock className="text-orange-500" />} label="Te herhalen" value={dueCount} highlight={dueCount > 0} />
          <StatCard icon={<BarChart2 className="text-green-500" />} label="Gem. score (10x)" value={avgScore + "%"} />
        </div>
        {dueCount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-orange-800">{dueCount} woorden klaar voor herhaling!</p>
              <p className="text-sm text-orange-600">Spaced repetition zorgt voor beter onthouden.</p>
            </div>
            <Link to="/lists" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Oefenen</Link>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/lists" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-6 flex items-center gap-4 transition-all shadow">
            <BookOpen size={28} /><div><p className="font-bold text-lg">Woordenlijsten</p><p className="text-sm opacity-80">Bekijk en beheer je lijsten</p></div>
          </Link>
          <Link to="/stats" className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 flex items-center gap-4 transition-all shadow">
            <BarChart2 size={28} /><div><p className="font-bold text-lg">Statistieken</p><p className="text-sm opacity-80">Bekijk je voortgang</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
function StatCard({ icon, label, value, highlight }) {
  return (
    <div className={"bg-white rounded-xl shadow p-5 flex items-center gap-4 " + (highlight ? "border-2 border-orange-300" : "")}>
      <div className="text-2xl">{icon}</div>
      <div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
    </div>
  );
}