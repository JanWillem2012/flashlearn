import { useState } from "react";
import { updateWordSRS, logSession } from "../../firebase/db";
import { sm2 } from "../../hooks/useSpacedRepetition";
import { useAuth } from "../../context/AuthContext";
import Results from "./Results";
import { ArrowLeft } from "lucide-react";

export default function MultipleChoice({ words, listId, onBack }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const current = words[idx];

  const getOptions = () => {
    const others = words.filter(w => w.id !== current.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled.map(w => w.definition), current.definition].sort(() => Math.random() - 0.5);
  };

  const [options] = useState(getOptions);

  const choose = async (opt) => {
    if (selected) return;
    setSelected(opt);
    const ok = opt === current.definition;
    if (ok) setCorrect(c => c + 1);
    await updateWordSRS(current.id, sm2(current, ok ? 4 : 1));
    setTimeout(async () => {
      if (idx + 1 >= words.length) {
        await logSession(user.uid, listId, "choice", ok ? correct + 1 : correct, words.length);
        setDone(true);
      } else { setIdx(i => i + 1); setSelected(null); }
    }, 900);
  };

  if (done) return <Results correct={correct} total={words.length} mode="Multiple choice" onBack={onBack}
    onRestart={() => { setIdx(0); setSelected(null); setCorrect(0); setDone(false); }} />;

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)" }} />
      </div>
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 relative z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: ((idx/words.length)*100) + "%", background: "linear-gradient(90deg, #34d399, #059669)" }} />
        </div>
        <span className="text-slate-500 text-sm">{idx+1}/{words.length}</span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
        <div className="glass rounded-2xl p-10 w-full max-w-lg text-center mb-6">
          <p className="text-xs text-slate-600 uppercase tracking-widest mb-4">Wat betekent</p>
          <p className="text-3xl font-bold text-white">{current.term}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
          {options.map((opt, i) => {
            const isCorrect = opt === current.definition;
            const isSelected = opt === selected;
            let style = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" };
            if (selected) {
              if (isCorrect)  style = { background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" };
              else if (isSelected) style = { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" };
              else style = { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#475569" };
            }
            return (
              <button key={i} onClick={() => choose(opt)}
                className={"rounded-2xl p-4 font-medium text-sm text-left transition-all duration-200 " +
                  (!selected ? "hover:border-violet-500/40 hover:bg-white/[0.06]" : "")}
                style={style}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}