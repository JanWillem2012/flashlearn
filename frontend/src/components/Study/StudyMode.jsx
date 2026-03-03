import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getWords } from "../../firebase/db";
import Flashcard from "./Flashcard";
import TypeMode from "./TypeMode";
import MultipleChoice from "./MultipleChoice";
import Dictee from "./Dictee";
import { ArrowLeft } from "lucide-react";
const MODES = [
  { id: "flashcard", label: "Flashcards" },
  { id: "type", label: "Intypen" },
  { id: "choice", label: "Multiple choice" },
  { id: "dictee", label: "Dictee" }
];
export default function StudyMode() {
  const { listId } = useParams();
  const [words, setWords] = useState([]);
  const [mode, setMode] = useState(null);
  const [direction, setDirection] = useState("normal");
  useEffect(() => { getWords(listId).then(setWords); }, [listId]);
  const getStudyWords = () => {
    if (direction === "reverse") return words.map(w => ({ ...w, term: w.definition, definition: w.term }));
    return [...words].sort(() => Math.random() - 0.5);
  };
  if (!mode) return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center gap-4 shadow">
        <Link to={"/lists/" + listId}><ArrowLeft size={20} /></Link>
        <span className="text-xl font-bold">Oefenen</span>
      </nav>
      <div className="max-w-xl mx-auto p-6">
        <p className="text-gray-500 mb-4">{words.length} woorden beschikbaar</p>
        <div className="bg-white rounded-xl shadow p-5 mb-5 border border-gray-100">
          <p className="font-semibold text-gray-700 mb-3">Richting</p>
          <div className="flex gap-3">
            {["normal","reverse","random"].map(d => (
              <button key={d} onClick={() => setDirection(d)} className={"flex-1 py-2 rounded-lg text-sm font-medium border transition-all " + (direction===d ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600")}>
                {d==="normal" ? "Normaal" : d==="reverse" ? "Omgekeerd" : "Willekeurig"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} disabled={words.length < 2} className="bg-white hover:bg-indigo-50 border-2 border-gray-100 hover:border-indigo-400 rounded-xl p-6 text-lg font-semibold text-gray-700 transition-all shadow disabled:opacity-40">
              {m.label}
            </button>
          ))}
        </div>
        {words.length < 2 && <p className="text-sm text-red-400 mt-4 text-center">Voeg minimaal 2 woorden toe om te oefenen.</p>}
      </div>
    </div>
  );
  const props = { words: getStudyWords(), listId, onBack: () => setMode(null) };
  if (mode === "flashcard") return <Flashcard {...props} />;
  if (mode === "type") return <TypeMode {...props} />;
  if (mode === "choice") return <MultipleChoice {...props} />;
  if (mode === "dictee") return <Dictee {...props} />;
}