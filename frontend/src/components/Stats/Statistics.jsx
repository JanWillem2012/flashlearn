import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStats, getDueWords } from "../../firebase/db";
import AppLayout from "../Layout/AppLayout";
import { TrendingUp, Target, Clock, Zap } from "lucide-react";

const modeStyle = {
  flashcard: { bg: "rgba(124,58,237,0.12)", color: "#a78bfa", label: "Flashcards" },
  type:      { bg: "rgba(96,165,250,0.12)",  color: "#60a5fa", label: "Intypen" },
  choice:    { bg: "rgba(52,211,153,0.12)",  color: "#34d399", label: "Multiple choice" },
  dictee:    { bg: "rgba(251,146,60,0.12)",  color: "#fb923c", label: "Dictee" },
};

export default function Statistics() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [due, setDue] = useState([]);

  useEffect(() => {
    getStats(user.uid).then(setSessions);
    getDueWords(user.uid).then(setDue);
  }, []);

  const avg = sessions.length ? Math.round(sessions.reduce((a,s) => a+s.score,0)/sessions.length) : 0;
  const best = sessions.length ? Math.max(...sessions.map(s => s.score)) : 0;
  const last7 = sessions.slice(0,7).reverse();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Statistieken</h1>
          <p className="text-slate-500 text-sm mt-1">{sessions.length} sessies gespeeld</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: "Gemiddeld", value: avg+"%",          color: "violet" },
            { icon: Target,     label: "Beste",     value: best+"%",         color: "green"  },
            { icon: Zap,        label: "Sessies",   value: sessions.length,  color: "blue"   },
            { icon: Clock,      label: "Te herhalen",value: due.length,       color: "orange" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <s.icon size={16} className={"mb-3 " +
                (s.color==="violet"?"text-violet-400":s.color==="green"?"text-green-400":s.color==="blue"?"text-blue-400":"text-orange-400")} />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grafiek */}
        {last7.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">Laatste {last7.length} sessies</p>
            <div className="flex items-end gap-2 h-24">
              {last7.map((s, i) => {
                const color = s.score>=80 ? "#34d399" : s.score>=50 ? "#fbbf24" : "#f87171";
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs" style={{ color }}>{s.score}%</span>
                    <div className="w-full rounded-t-lg transition-all"
                      style={{ height: Math.max(s.score,4)+"%", background: color, opacity: 0.6 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sessie lijst */}
        <div className="glass rounded-2xl p-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-5">Geschiedenis</p>
          {sessions.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">Nog geen sessies gespeeld</p>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0,25).map((s, i) => {
                const ms = modeStyle[s.mode] || { bg: "rgba(255,255,255,0.06)", color: "#94a3b8", label: s.mode };
                const color = s.score>=80 ? "#34d399" : s.score>=50 ? "#fbbf24" : "#f87171";
                return (
                  <div key={s.id} className={"flex items-center gap-3 py-2 border-b border-white/[0.04] animate-slide-in"}
                    style={{ animationDelay: i*0.03+"s" }}>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: ms.bg, color: ms.color }}>{ms.label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: s.score+"%", background: color, opacity: 0.7 }} />
                    </div>
                    <span className="font-bold text-sm w-10 text-right" style={{ color }}>{s.score}%</span>
                    <span className="text-xs text-slate-700 w-12 text-right">{s.correct}/{s.total}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}