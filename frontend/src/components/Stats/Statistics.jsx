import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStats, getDueWords } from "../../firebase/db";
import { ArrowLeft, TrendingUp, Target, Clock } from "lucide-react";
export default function Statistics() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]); const [due, setDue] = useState([]);
  useEffect(() => { getStats(user.uid).then(setSessions); getDueWords(user.uid).then(setDue); }, []);
  const avgScore = sessions.length ? Math.round(sessions.reduce((a,s)=>a+s.score,0)/sessions.length) : 0;
  const modeColors = { flashcard:"bg-purple-100 text-purple-700", type:"bg-blue-100 text-blue-700", choice:"bg-green-100 text-green-700", dictee:"bg-orange-100 text-orange-700" };
  const last7 = sessions.slice(0,7).reverse();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center gap-4 shadow">
        <Link to="/"><ArrowLeft size={20} /></Link>
        <span className="text-xl font-bold">Statistieken</span>
      </nav>
      <div className="max-w-3xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5"><TrendingUp className="text-indigo-500 mb-2" /><p className="text-2xl font-bold">{avgScore}%</p><p className="text-sm text-gray-400">Gemiddelde score</p></div>
          <div className="bg-white rounded-xl shadow p-5"><Target className="text-green-500 mb-2" /><p className="text-2xl font-bold">{sessions.length}</p><p className="text-sm text-gray-400">Sessies gespeeld</p></div>
          <div className="bg-white rounded-xl shadow p-5"><Clock className="text-orange-500 mb-2" /><p className="text-2xl font-bold">{due.length}</p><p className="text-sm text-gray-400">Klaar voor herhaling</p></div>
        </div>
        {last7.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-bold text-gray-700 mb-4">Laatste {last7.length} sessies</h3>
            <div className="flex items-end gap-2 h-24">
              {last7.map((s,i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{s.score}%</span>
                  <div className={"w-full rounded-t-md " + (s.score>=80?"bg-green-400":s.score>=50?"bg-yellow-400":"bg-red-400")} style={{height: Math.max(s.score,5)+"%"}} />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-gray-700 mb-4">Sessiegeschiedenis</h3>
          {sessions.length===0 ? <p className="text-gray-400 text-center py-6">Nog geen sessies gespeeld.</p> : (
            <div className="space-y-2">
              {sessions.slice(0,20).map(s => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-50">
                  <span className={"text-xs font-medium px-2 py-1 rounded-full " + (modeColors[s.mode]||"bg-gray-100 text-gray-600")}>{s.mode}</span>
                  <div className="flex-1"><div className="h-2 bg-gray-100 rounded-full"><div className={"h-full rounded-full " + (s.score>=80?"bg-green-400":s.score>=50?"bg-yellow-400":"bg-red-400")} style={{width:s.score+"%"}} /></div></div>
                  <span className="font-bold text-gray-700 w-12 text-right">{s.score}%</span>
                  <span className="text-xs text-gray-400">{s.correct}/{s.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}