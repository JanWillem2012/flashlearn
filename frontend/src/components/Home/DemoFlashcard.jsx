import { useState } from "react";

const cards = [
  { term: "Ephemeral",   def: "Kortstondig, vluchtig" },
  { term: "Serendipity", def: "Toevallige gelukkige ontdekking" },
  { term: "Eloquent",    def: "Welbespraakt, vloeiend" },
  { term: "Resilient",   def: "Veerkrachtig, weerbaar" },
];

export default function DemoFlashcard({ interactive = false }) {
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const next = (e) => {
    e.stopPropagation();
    setLeaving(true);
    setTimeout(() => {
      setFlipped(false);
      setIdx(i => (i + 1) % cards.length);
      setLeaving(false);
    }, 200);
  };

  const card = cards[idx];

  return (
    <div className="w-80 select-none">
      <div className={"card-3d w-full h-52 " + (interactive ? "cursor-pointer" : "")}
        onClick={() => interactive && setFlipped(f => !f)}>
        <div className={"card-3d-inner w-full h-full " + (flipped ? "flipped" : "") + (leaving ? " opacity-0 scale-95 transition-all duration-200" : "")}>

          {/* Front */}
          <div className="card-face absolute inset-0 glass-md rounded-2xl flex flex-col items-center justify-center p-8 glow-violet">
            <div className="badge badge-violet mb-4">Woord {idx + 1}/{cards.length}</div>
            <p className="text-2xl font-bold text-white text-center tracking-tight">{card.term}</p>
            {interactive && <p className="text-xs text-slate-600 mt-5">Klik om om te draaien</p>}
          </div>

          {/* Back */}
          <div className="card-face card-back-face absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))", border: "1px solid rgba(139,92,246,0.25)" }}>
            <div className="badge badge-violet mb-4">Vertaling</div>
            <p className="text-2xl font-bold text-white text-center">{card.def}</p>
          </div>
        </div>
      </div>

      {interactive && flipped && (
        <div className="flex gap-2 mt-4 animate-fadeUp">
          <button onClick={next} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
            Fout
          </button>
          <button onClick={next} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(234,179,8,0.12)", color: "#fbbf24", border: "1px solid rgba(234,179,8,0.2)" }}>
            Twijfel
          </button>
          <button onClick={next} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
            Goed
          </button>
        </div>
      )}
      {interactive && !flipped && (
        <p className="text-center text-slate-600 text-xs mt-4">{idx + 1} / {cards.length}</p>
      )}
    </div>
  );
}