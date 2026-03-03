import { useState, useRef, useEffect } from "react";
import { updateWordSRS, logSession } from "../../firebase/db";
import { sm2 } from "../../hooks/useSpacedRepetition";
import { useAuth } from "../../context/AuthContext";
import Results from "./Results";
import { ArrowLeft, Volume2 } from "lucide-react";

export default function Dictee({ words, listId, onBack }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState("idle");
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const inputRef = useRef();

  const current = words[idx];

  const speak = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(current.term);
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => { inputRef.current?.focus(); speak(); }, [idx]);

  const check = async () => {
    const ok = input.trim().toLowerCase() === current.definition.trim().toLowerCase();
    setState(ok ? "correct" : "wrong");
    await updateWordSRS(current.id, sm2(current, ok ? 4 : 1));
    if (ok) setCorrect(c => c + 1);
    setTimeout(async () => {
      if (idx + 1 >= words.length) {
        await logSession(user.uid, listId, "dictee", ok ? correct + 1 : correct, words.length);
        setDone(true);
      } else { setIdx(i => i + 1); setInput(""); setState("idle"); }
    }, 1200);
  };

  if (done) return <Results correct={correct} total={words.length} mode="Dictee" onBack={onBack}
    onRestart={() => { setIdx(0); setInput(""); setState("idle"); setCorrect(0); setDone(false); }} />;

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.05) 0%, transparent 70%)" }} />
      </div>
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 relative z-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={18} /></button>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: ((idx/words.length)*100) + "%", background: "linear-gradient(90deg, #fb923c, #f97316)" }} />
        </div>
        <span className="text-slate-500 text-sm">{idx+1}/{words.length}</span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
        <div className="glass rounded-2xl p-10 w-full max-w-lg text-center mb-6">
          <p className="text-xs text-slate-600 uppercase tracking-widest mb-6">Luister en schrijf de vertaling</p>
          <button onClick={speak}
            className={"w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-all " +
              (speaking ? "animate-pulse" : "hover:scale-105")}
            style={{ background: speaking ? "rgba(251,146,60,0.25)" : "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)" }}>
            <Volume2 size={24} className="text-orange-400" />
          </button>
          <p className="text-xs text-slate-700 mt-4">Klik om opnieuw te horen</p>
          {state === "wrong" && (
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
            onKeyDown={e => e.key === "Enter" && state === "idle" && check()} />
          <button onClick={check} disabled={!input.trim() || state !== "idle"}
            className="w-full btn-primary text-white py-3.5 rounded-2xl font-medium disabled:opacity-30 text-sm">
            <span>Controleren</span>
          </button>
        </div>
      </div>
    </div>
  );
}