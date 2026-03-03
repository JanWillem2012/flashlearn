import { useState } from "react";
import { updateWordSRS, logSession } from "../../firebase/db";
import { sm2 } from "../../hooks/useSpacedRepetition";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, RotateCcw } from "lucide-react";
function Results({ correct, total, onBack, onRestart }) {
  const pct = Math.round((correct/total)*100);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 text-center max-w-sm w-full mx-4">
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
export default function MultipleChoice({ words, listId, onBack }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0); const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0); const [done, setDone] = useState(false);
  const current = words[idx];
  const getOptions = () => {
    const others = words.filter(w => w.id !== current.id);
    const shuffled = [...others].sort(() => Math.random()-0.5).slice(0,3);
    return [...shuffled.map(w => w.definition), current.definition].sort(() => Math.random()-0.5);
  };
  const [options] = useState(getOptions);
  const choose = async (opt) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt === current.definition;
    if (isCorrect) setCorrect(c => c+1);
    await updateWordSRS(current.id, sm2(current, isCorrect?4:1));
    setTimeout(async () => {
      if (idx+1 >= words.length) { await logSession(user.uid, listId, "choice", isCorrect?correct+1:correct, words.length); setDone(true); }
      else { setIdx(i=>i+1); setSelected(null); }
    }, 1000);
  };
  if (done) return <Results correct={correct} total={words.length} onBack={onBack} onRestart={()=>{setIdx(0);setSelected(null);setCorrect(0);setDone(false);}} />;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between">
        <button onClick={onBack}><ArrowLeft size={22} /></button>
        <span>{idx+1}/{words.length}</span>
      </div>
      <div className="max-w-lg mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-8 mb-6 text-center">
          <p className="text-xs text-gray-400 uppercase mb-3">Wat betekent</p>
          <p className="text-3xl font-bold text-gray-800">{current.term}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt,i) => {
            let cls = "bg-white border-2 border-gray-100 hover:border-indigo-400 text-gray-700";
            if (selected) {
              if (opt===current.definition) cls="bg-green-100 border-green-500 text-green-800";
              else if (opt===selected) cls="bg-red-100 border-red-500 text-red-800";
              else cls="bg-white border-gray-100 text-gray-400";
            }
            return <button key={i} onClick={() => choose(opt)} className={"rounded-xl p-4 font-medium text-left transition-all shadow-sm " + cls}>{opt}</button>;
          })}
        </div>
      </div>
    </div>
  );
}