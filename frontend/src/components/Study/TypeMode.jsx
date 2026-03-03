import { useState, useRef, useEffect } from "react";
import { updateWordSRS, logSession } from "../../firebase/db";
import { sm2, qualityFromResult } from "../../hooks/useSpacedRepetition";
import { useAuth } from "../../context/AuthContext";
import Results from "./Results";
import { ArrowLeft } from "lucide-react";

export default function TypeMode({ words, listId, onBack }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, [idx]);

  const current = words[idx];
  const norm = s => s.trim().toLowerCase();

  const check = async () => {
    const ok = norm(input) === norm(current.definition);
    const na = attempts + 1;
    setAttempts(na);
    if (ok) {
      setState("correct");
      await updateWordSRS(current.id, sm2(current, qualityFromResult(true, na)));
      setCorrect(c => c + 1);
      setTimeout(() => advance(correct + 1), 800);
    } else {
      setState("wrong");
      if (na >= 2) {
        await updateWordSRS(current.id, sm2(current, 1));
        setTimeout(() => advance(correct), 1400);
      }
    }
  };

  const advance = async (c) => {
    if (idx + 1 >= words.length) {
      await logSession(user.uid, listId, "type", c, words.length);
      setDone(true);
    } else {
      setIdx(i => i + 1); setInput(""); setState("idle"); setAttempts(0);
    }
  };

  if (done) return <Results correct={correct} total={words.length} mode="Intypen" onBack={onBack}
    onRestart={() => { setIdx(0); setInput(""); setState("idle"); setAttempts(0); setCorrect(0); setDone(false); }} />;

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
      </div>
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 relative z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: ((idx/words.length)*100) + "%", background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
        </div>
        <span className="text-slate-500 text-sm">{idx+1}/{words.length}</span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
        <div className={"glass rounded-2xl p-10 w-full max-w-lg text-center mb-6 transition-all duration-300 " +
          (state === "correct" ? "glow-green" : state === "wrong" ? "glow-violet" : "")}
          style={state === "correct" ? { borderColor: "rgba(52,211,153,0.3)" } : state === "wrong" ? { borderColor: "rgba(239,68,68,0.3)" } : {}}>
          <p className="text-xs text-slate-600 uppercase tracking-widest mb-4">Wat is de vertaling van</p>
          <p className="text-3xl font-bold text-white">{current.term}</p>
          {state === "wrong" && attempts >= 2 && (
            <p className="text-green-400 text-sm mt-4 animate-fadeUp">Antwoord: {current.definition}</p>
          )}
        </div>

        <div className="w-full max-w-lg space-y-3">
          <input ref={inputRef}
            className={"input-dark w-full rounded-2xl px-5 py-4 text-base transition-all " +
              (state === "correct" ? "border-green-500/40 bg-green-500/5" :
               state === "wrong"   ? "border-red-500/40 bg-red-500/5" : "")}
            placeholder="Typ de vertaling..."
            value={input}
            onChange={e => { setInput(e.target.value); setState("idle"); }}
            onKeyDown={e => e.key === "Enter" && state === "idle" && check()}
            disabled={state === "correct" || (state === "wrong" && attempts >= 2)} />

          {state === "wrong" && attempts < 2 && (
            <p className="text-red-400/70 text-xs text-center animate-fadeIn">Niet goed â€” probeer nog een keer</p>
          )}

          <button onClick={check} disabled={!input.trim() || state !== "idle"}
            className="w-full btn-primary text-white py-3.5 rounded-2xl font-medium disabled:opacity-30 text-sm">
            <span>Controleren</span>
          </button>
        </div>
      </div>
    </div>
  );
}