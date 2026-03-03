import { useState } from "react";
import { updateWordSRS, logSession } from "../../firebase/db";
import { sm2 } from "../../hooks/useSpacedRepetition";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, RotateCcw } from "lucide-react";
function Results({ correct, total, onBack, onRestart }) {
  const pct = Math.round((correct/total)*100);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm w-full mx-4">
        <p className="text-5xl mb-4">{pct>=80?"Geweldig!":pct>=50?"Goed bezig!":"Blijven oefenen!"}</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Klaar!</h2>
        <p className="text-4xl font-bold text-indigo-600 mb-1">{pct}%</p>
        <p className="text-gray-400 mb-8">{correct} / {total} goed</p>
        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium"><RotateCcw size={18} /> Opnieuw</button>
          <button onClick={onBack} className="border py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">Andere modus</button>
        </div>
      </div>
    </div>
  );
}
export default function Flashcard({ words, listId, onBack }) {
  const { user } = useAuth();
  const [idx, setIdx] = useState(0); const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false); const [correct, setCorrect] = useState(0);
  const current = words[idx];
  const rate = async (quality) => {
    await updateWordSRS(current.id, sm2(current, quality));
    const isCorrect = quality >= 3;
    if (isCorrect) setCorrect(c => c+1);
    if (idx+1 >= words.length) { await logSession(user.uid, listId, "flashcard", isCorrect?correct+1:correct, words.length); setDone(true); }
    else { setIdx(i => i+1); setFlipped(false); }
  };
  if (done) return <Results correct={correct} total={words.length} onBack={onBack} onRestart={() => { setIdx(0); setFlipped(false); setDone(false); setCorrect(0); }} />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 text-white">
        <button onClick={onBack}><ArrowLeft size={22} /></button>
        <span className="text-sm opacity-70">{idx+1} / {words.length}</span>
      </div>
      <div className="mx-6 h-1.5 bg-white/20 rounded-full mb-8">
        <div className="h-full bg-white rounded-full transition-all" style={{ width: ((idx/words.length)*100) + "%" }} />
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div onClick={() => setFlipped(f => !f)} className="w-full max-w-lg min-h-48 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 cursor-pointer select-none">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{flipped ? "Vertaling" : "Woord"}</p>
          <p className="text-3xl font-bold text-gray-800 text-center">{flipped ? current.definition : current.term}</p>
          {!flipped && <p className="text-sm text-gray-400 mt-6">Klik om om te draaien</p>}
        </div>
      </div>
      {flipped && (
        <div className="px-6 pb-8 grid grid-cols-3 gap-3 max-w-lg mx-auto w-full">
          <button onClick={() => rate(1)} className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold">Fout</button>
          <button onClick={() => rate(3)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold">Twijfel</button>
          <button onClick={() => rate(5)} className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold">Goed</button>
        </div>
      )}
    </div>
  );
}