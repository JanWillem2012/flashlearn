import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { X, Upload, Loader, Check, Trash2 } from "lucide-react";
const AI_URL = import.meta.env.VITE_AI_PROXY_URL;

export default function ScanModal({ onClose, onImport }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState([]);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = e => { setImage(e.target.result.split(",")[1]); setPreview(e.target.result); setPairs([]); };
    r.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!image) return toast.error("Upload eerst een afbeelding");
    setLoading(true);
    try {
      const res = await fetch(AI_URL + "/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image })
      });
      const data = await res.json();
      if (data.pairs?.length > 0) { setPairs(data.pairs); toast.success(data.pairs.length + " woordparen gevonden!"); }
      else toast.error("Geen woorden gevonden. Probeer een duidelijkere foto.");
    } catch { toast.error("AI server niet bereikbaar."); }
    setLoading(false);
  };

  const handleImport = () => {
    const valid = pairs.filter(p => p.term && p.definition);
    if (!valid.length) return toast.error("Geen geldige paren");
    onImport(valid); onClose();
  };

  const upd = (i, f, v) => setPairs(p => p.map((x, j) => j===i ? {...x,[f]:v} : x));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="glass rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="font-bold text-white">Woordenlijst scannen</h2>
            <p className="text-xs text-slate-500 mt-0.5">AI extraheert automatisch de woorden</p>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-400 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Upload zone */}
          <div onClick={() => inputRef.current.click()}
            className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
            style={{ borderColor: preview ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)" }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}>
            {preview
              ? <img src={preview} alt="preview" className="max-h-40 mx-auto rounded-xl object-contain" />
              : <>
                  <Upload size={28} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-500 text-sm">Klik of sleep een foto hierheen</p>
                  <p className="text-slate-700 text-xs mt-1">Foto van een woordenlijst, boekpagina of schrift</p>
                </>
            }
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => handleFile(e.target.files[0])} />

          <button onClick={handleScan} disabled={!image || loading}
            className="w-full btn-primary text-white font-medium py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40">
            <span>{loading ? <><Loader size={15} className="animate-spin" /> Analyseren...</> : "Woorden extraheren"}</span>
          </button>

          {pairs.length > 0 && (
            <div className="animate-fadeUp">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white">{pairs.length} woordparen gevonden</p>
                <p className="text-xs text-slate-600">Controleer en pas aan</p>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {pairs.map((p, i) => (
                  <div key={i} className="flex gap-2 items-center glass rounded-lg px-3 py-2">
                    <input className="input-dark flex-1 rounded-lg px-2 py-1 text-xs"
                      value={p.term} onChange={e => upd(i,"term",e.target.value)} />
                    <span className="text-slate-700 text-xs">&rarr;</span>
                    <input className="input-dark flex-1 rounded-lg px-2 py-1 text-xs"
                      value={p.definition} onChange={e => upd(i,"definition",e.target.value)} />
                    <button onClick={() => setPairs(p => p.filter((_,j) => j!==i))}
                      className="text-slate-700 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
              <button onClick={handleImport}
                className="mt-4 w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                <Check size={15} /> {pairs.length} woorden importeren
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}