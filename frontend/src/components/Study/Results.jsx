import { RotateCcw, ArrowLeft, Trophy } from "lucide-react";

export default function Results({ correct, total, mode, onBack, onRestart }) {
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 90 ? "&#x1F3C6;" : pct >= 70 ? "&#x1F44D;" : pct >= 50 ? "&#x1F4AA;" : "&#x1F4DA;";
  const label = pct >= 90 ? "Uitstekend!" : pct >= 70 ? "Goed gedaan!" : pct >= 50 ? "Blijven oefenen!" : "Niet opgeven!";

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
      </div>
      <div className="relative glass rounded-3xl p-10 text-center max-w-sm w-full animate-scale-in glow-violet">
        <span className="text-5xl mb-4 block" dangerouslySetInnerHTML={{ __html: emoji }} />
        <h2 className="text-xl font-bold text-white mb-1">{label}</h2>
        <p className="text-slate-500 text-sm mb-6">{mode}</p>

        <div className="mb-8">
          <p className="text-6xl font-bold gradient-text-static">{pct}%</p>
          <p className="text-slate-500 text-sm mt-2">{correct} van {total} goed</p>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full mb-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{
              width: pct + "%",
              background: pct >= 70 ? "linear-gradient(90deg,#34d399,#059669)" : pct >= 50 ? "linear-gradient(90deg,#fbbf24,#d97706)" : "linear-gradient(90deg,#f87171,#dc2626)"
            }} />
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={onRestart}
            className="btn-primary text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <span><RotateCcw size={16} /></span>
            <span>Opnieuw</span>
          </button>
          <button onClick={onBack}
            className="btn-ghost text-slate-400 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <ArrowLeft size={14} /> Andere modus
          </button>
        </div>
      </div>
    </div>
  );
}