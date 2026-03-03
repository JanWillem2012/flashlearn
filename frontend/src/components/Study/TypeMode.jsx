import { useState, useRef, useEffect } from "react";
import { updateWordSRS, logSession } from "../../firebase/db";
import { sm2, qualityFromResult } from "../../hooks/useSpacedRepetition";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, RotateCcw } from "lucide-react";
function Results({ correct, total, onBack, onRestart }) {
  const pct = Math.round((correct/total)*100);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm w-full mx-4">
        <p className="text-4xl font-bold text-indigo-600 mb-1">{pct}%</p>
        <p className="text-gray-400 mb-8">{correct}/{total} goed</p>
        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl"><RotateCcw size={18} /> Opnieuw</button>
          <button onClick={onBack} className="border py-3 rounded-xl text-gray-600">Andere modus</button>
        </div>
      </div>
    </div>
  );
}
export default function TypeMode({ words, listId, onBack }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0); const [input, setInput] = useState(""); const [state, setState] = useState("idle");
  const [attempts, setAttempts] = useState(0); const [correct, setCorrect] = useState(0); const [done, setDone] = useState(false);
  const inputRef = useRef();
  useEffect(() => { inputRef.current?.focus(); }, [idx]);
  const current = words[idx];
  const normalize = s => s.trim().toLowerCase();
  const check = async () => {
    const isCorrect = normalize(input) === normalize(current.definition);
    const na = attempts+1; setAttempts(na);
    if (isCorrect) {
      setState("correct");
      await updateWordSRS(current.id, sm2(current, qualityFromResult(true, na)));
      setCorrect(c => c+1);
      setTimeout(() => advance(correct+1), 900);
    } else {
      setState("wrong");
      if (na >= 2) { await updateWordSRS(current.id, sm2(current, 1)); setTimeout(() => advance(correct), 1500); }
    }
  };
  const advance = async (c) => {
    if (idx+1 >= words.length) { await logSession(user.uid, listId, "type", c, words.length); setDone(true); }
    else { setIdx(i=>i+1); setInput(""); setState("idle"); setAttempts(0); }
  };
  if (done) return <Results correct={correct} total={words.length} onBack={onBack} onRestart={() => {setIdx(0);setInput("");setState("idle");setAttempts(0);setCorrect(0);setDone(false);}} />;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between">
        <button onClick={onBack}><ArrowLeft size={22} /></button>
        <span>{idx+1}/{words.length}</span>
      </div>
      <div className="max-w-lg mx-auto p-6">
        <div className={"bg-white rounded-2xl shadow p-8 mb-6 text-center border-2 transition-colors " + (state==="correct"?"border-green-400":state==="wrong"?"border-red-400":"border-transparent")}>
          <p className="text-xs text-gray-400 uppercase mb-3">Wat is de vertaling van</p>
          <p className="text-3xl font-bold text-gray-800">{current.term}</p>
          {state==="wrong"&&attempts>=2&&<p className="text-green-600 mt-3 font-medium">Antwoord: {current.definition}</p>}
        </div>
        <input ref={inputRef}
          className={"w-full border-2 rounded-xl px-4 py-3 text-lg focus:outline-none transition-colors " + (state==="correct"?"border-green-400 bg-green-50":state==="wrong"?"border-red-400 bg-red-50":"border-gray-200 focus:border-indigo-400")}
          placeholder="Typ de vertaling..." value={input}
          onChange={e => { setInput(e.target.value); setState("idle"); }}
          onKeyDown={e => e.key==="Enter"&&state==="idle"&&check()}
          disabled={state==="correct"||(state==="wrong"&&attempts>=2)} />
        {state==="wrong"&&attempts<2&&<p className="text-red-500 text-sm mt-2">Probeer nog een keer!</p>}
        <button onClick={check} disabled={!input.trim()||state!=="idle"} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold">Controleren</button>
      </div>
    </div>
  );
}