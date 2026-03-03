import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLists, getDueWords, getStats } from "../../firebase/db";
import AppLayout from "../Layout/AppLayout";
import { BookOpen, BarChart2, Clock, ArrowRight, Zap } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [due, setDue] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getLists(user.uid).then(setLists);
    getDueWords(user.uid).then(setDue);
    getStats(user.uid).then(setStats);
  }, [user.uid]);

  const avgScore = stats.length
    ? Math.round(stats.slice(0,10).reduce((a,s) => a+s.score,0) / Math.min(stats.length,10))
    : 0;

  const recentLists = lists.slice(0,3);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8 animate-fadeUp">
          <h1 className="text-2xl font-bold text-white">
            Goedemorgen, <span className="gradient-text-static">{user.displayName?.split(" ")[0]}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Hier is je overzicht voor vandaag</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Lijsten",      value: lists.length, color: "violet" },
            { icon: Clock,    label: "Te herhalen",  value: due.length,   color: due.length > 0 ? "orange" : "slate", alert: due.length > 0 },
            { icon: BarChart2, label: "Gem. score",  value: avgScore+"%", color: "green" },
          ].map((s, i) => (
            <div key={i} className={"glass rounded-2xl p-5 animate-fadeUp " + "d" + ((i+1)*100)}
              style={s.alert ? { borderColor: "rgba(251,146,60,0.25)" } : {}}>
              <s.icon size={16} className={"mb-3 " + (s.color === "violet" ? "text-violet-400" : s.color === "orange" ? "text-orange-400" : s.color === "green" ? "text-green-400" : "text-slate-500")} />
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Herhalen alert */}
        {due.length > 0 && (
          <div className="rounded-2xl p-4 mb-8 flex items-center justify-between animate-scale-in"
            style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(251,146,60,0.15)" }}>
                <Zap size={14} className="text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-300">{due.length} woorden klaar voor herhaling</p>
                <p className="text-xs text-slate-600 mt-0.5">Nu oefenen vergroot je retentie aanzienlijk</p>
              </div>
            </div>
            <Link to="/lists"
              className="text-xs font-medium px-4 py-2 rounded-lg transition-all"
              style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c" }}>
              Oefenen
            </Link>
          </div>
        )}

        {/* Recente lijsten */}
        <div className="mb-8 animate-fadeUp d300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Recente lijsten</h2>
            <Link to="/lists" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
              Alle lijsten <ArrowRight size={12} />
            </Link>
          </div>
          {recentLists.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center">
              <BookOpen size={32} className="mx-auto mb-3 text-slate-700" />
              <p className="text-slate-600 text-sm">Nog geen lijsten aangemaakt</p>
              <Link to="/lists" className="inline-block mt-4 btn-primary text-white text-xs px-5 py-2 rounded-lg">
                <span>Eerste lijst maken</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {recentLists.map(l => (
                <Link to={"/lists/" + l.id} key={l.id}
                  className="glass glass-hover rounded-xl p-4 flex items-center justify-between group">
                  <div>
                    <p className="font-medium text-white text-sm">{l.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{l.langFrom} &rarr; {l.langTo} &middot; {l.wordCount||0} woorden</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={"/study/" + l.id} onClick={e => e.stopPropagation()}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                      Oefenen
                    </Link>
                    <ArrowRight size={14} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Snelkoppelingen */}
        <div className="grid grid-cols-2 gap-4 animate-fadeUp d400">
          <Link to="/lists"
            className="glass glass-hover rounded-2xl p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ background: "rgba(124,58,237,0.12)" }}>
              <BookOpen size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Woordenlijsten</p>
              <p className="text-xs text-slate-600">Beheer je lijsten</p>
            </div>
          </Link>
          <Link to="/stats"
            className="glass glass-hover rounded-2xl p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(52,211,153,0.12)" }}>
              <BarChart2 size={18} className="text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Statistieken</p>
              <p className="text-xs text-slate-600">Bekijk je voortgang</p>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}