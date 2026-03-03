import { useState } from "react";
import { updateWordSRS, logSession } from "../../firebase/db";
import { sm2 } from "../../hooks/useSpacedRepetition";
import { useAuth } from "../../context/AuthContext";
import Results from "./Results";
import { ArrowLeft } from "lucide-react";

export default function Flashcard({ words, listId, onBack }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const current = words[idx];

  const rate = async (quality) => {
    await updateWordSRS(current.id, sm2(current, quality));
    const isOk = quality >= 3;
    const newCorrect = isOk ? correct + 1 : correct;
    if (isOk) setCorrect(c => c + 1);
    if (idx + 1 >= words.length) {
      await logSession(user.uid, listId, "flashcard", newCorrect, words.length);
      setDone(true);
    } else {
      setIdx(i => i + 1);
      setFlipped(false);
    }
  };

  if (done) return <Results correct={correct} total={words.length} mode="Flashcards" onBack={onBack}
    onRestart={() => { setIdx(0); setFlipped(false); setDone(false); setCorrect(0); }} />;

  const pct = (idx / words.length) * 100;

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 relative z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: pct + "%", background: "linear-gradient(90deg, #7c3aed, #4f46e5)" }} />
        </div>
        <span className="text-slate-500 text-sm">{idx + 1}/{words.length}</span>
      </nav>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
        <div className="card-3d w-full max-w-lg h-64 cursor-pointer" onClick={() => setFlipped(f => !f)}>
          <div className={"card-3d-inner w-full h-full " + (flipped ? "flipped" : "")}>
            {/* Front */}
            <div className="card-face absolute inset-0 glass rounded-2xl flex flex-col items-center justify-center p-10 glow-violet">
              <p className="text-xs text-slate-600 uppercase tracking-widest mb-4">Woord</p>
              <p className="text-3xl font-bold text-white text-center">{current.term}</p>
              <p className="text-xs text-slate-700 mt-6">Klik om te draaien</p>
            </div>
            {/* Back */}
            <div className="card-face card-back-face absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-10"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}>
              <p className="text-xs text-slate-600 uppercase tracking-widest mb-4">Vertaling</p>
              <p className="text-3xl font-bold text-white text-center">{current.definition}</p>
            </div>
          </div>
        </div>

        {/* Rating knoppen */}
        {flipped ? (
          <div className="flex gap-3 mt-8 w-full max-w-lg animate-fadeUp">
            {[
              { q: 1, label: "Fout",    bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)",   text: "#f87171" },
              { q: 3, label: "Twijfel", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.25)",   text: "#fbbf24" },
              { q: 5, label: "Goed",    bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)",  text: "#34d399" },
            ].map(b => (
              <button key={b.q} onClick={() => rate(b.q)}
                className="flex-1 py-3.5 rounded-2xl font-medium text-sm transition-all hover:scale-105"
                style={{ background: b.bg, border: "1px solid " + b.border, color: b.text }}>
                {b.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-700 text-sm mt-8">Weet je het antwoord?</p>
        )}
      </div>
    </div>
  );
}