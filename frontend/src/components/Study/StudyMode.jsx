import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getWords } from "../../firebase/db";
import Flashcard from "./Flashcard";
import TypeMode from "./TypeMode";
import MultipleChoice from "./MultipleChoice";
import Dictee from "./Dictee";
import { ArrowLeft } from "lucide-react";

const MODES = [
  { id: "flashcard", emoji: "&#x1F0CF;", label: "Flashcards",      desc: "Draai kaarten en beoordeel jezelf" },
  { id: "type",      emoji: "&#x2328;",  label: "Intypen",          desc: "Typ de vertaling uit je hoofd" },
  { id: "choice",    emoji: "&#x1F3AF;", label: "Multiple choice",  desc: "Kies het juiste antwoord" },
  { id: "dictee",    emoji: "&#x1F50A;", label: "Dictee",           desc: "Luister en schrijf de vertaling" },
];

export default function StudyMode() {
  const { listId } = useParams();
  const [words, setWords] = useState([]);
  const [mode, setMode] = useState(null);
  const [direction, setDirection] = useState("normal");

  useEffect(() => { getWords(listId).then(setWords); }, [listId]);

  const getStudyWords = () => {
    let w = [...words];
    if (direction === "reverse") w = w.map(x => ({...x, term: x.definition, definition: x.term}));
    return w.sort(() => Math.random() - 0.5);
  };

  if (!mode) return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />
      </div>
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center gap-4 relative z-10">
        <Link to={"/lists/" + listId} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft size={18} /></Link>
        <span className="font-semibold text-white">Oefenen</span>
        <span className="text-slate-600 text-sm ml-auto">{words.length} woorden</span>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Richting */}
        <div className="glass rounded-2xl p-5 mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Richting</p>
          <div className="flex gap-2">
            {[["normal","Normaal"],["reverse","Omgekeerd"],["random","Willekeurig"]].map(([v,l]) => (
              <button key={v} onClick={() => setDirection(v)}
                className={"flex-1 py-2 rounded-xl text-sm font-medium transition-all " +
                  (direction === v
                    ? "text-violet-300"
                    : "text-slate-600 hover:text-slate-400")}
                style={direction === v
                  ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Modi */}
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Kies een modus</p>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m, i) => (
            <button key={m.id} onClick={() => setMode(m.id)} disabled={words.length < 2}
              className={"glass glass-hover rounded-2xl p-5 text-left transition-all animate-fadeUp disabled:opacity-30 " + "d"+(i*100+100)}>
              <span className="text-2xl mb-3 block" dangerouslySetInnerHTML={{ __html: m.emoji }} />
              <p className="font-semibold text-white text-sm">{m.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
        {words.length < 2 && (
          <p className="text-center text-xs text-red-400/70 mt-4">Voeg minimaal 2 woorden toe om te oefenen</p>
        )}
      </div>
    </div>
  );

  const props = { words: getStudyWords(), listId, onBack: () => setMode(null) };
  if (mode === "flashcard") return <Flashcard {...props} />;
  if (mode === "type")      return <TypeMode {...props} />;
  if (mode === "choice")    return <MultipleChoice {...props} />;
  if (mode === "dictee")    return <Dictee {...props} />;
}