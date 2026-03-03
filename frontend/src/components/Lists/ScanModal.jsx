import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { X, Upload, Loader, Check, Trash2 } from "lucide-react";
const AI_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL;
export default function ScanModal({ onClose, onImport }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pairs, setPairs] = useState([]);
  const inputRef = useRef();
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { setImage(e.target.result.split(",")[1]); setPreview(e.target.result); setPairs([]); };
    reader.readAsDataURL(file);
  };
  const handleScan = async () => {
    if (!image) return toast.error("Upload eerst een afbeelding");
    setLoading(true);
    try {
      const res = await fetch(AI_PROXY_URL + "/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image }) });
      const data = await res.json();
      if (data.pairs && data.pairs.length > 0) { setPairs(data.pairs); toast.success(data.pairs.length + " woordparen gevonden!"); }
      else toast.error("Geen woorden gevonden. Probeer een duidelijkere foto.");
    } catch (err) { toast.error("AI server niet bereikbaar."); }
    setLoading(false);
  };
  const handleImport = () => {
    const valid = pairs.filter(p => p.term && p.definition);
    if (!valid.length) return toast.error("Geen geldige paren");
    onImport(valid); onClose();
  };
  const removePair = (i) => setPairs(p => p.filter((_, idx) => idx !== i));
  const updatePair = (i, field, val) => setPairs(p => p.map((pair, idx) => idx === i ? { ...pair, [field]: val } : pair));
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Woordenlijst scannen met AI</h2>
          <button onClick={onClose}><X size={22} className="text-gray-400 hover:text-gray-700" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div onClick={() => inputRef.current.click()} className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
            {preview ? <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-lg object-contain" /> : <><Upload size={36} className="mx-auto text-indigo-300 mb-2" /><p className="text-gray-500">Klik om een foto te uploaden</p></>}
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          <button onClick={handleScan} disabled={!image || loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
            {loading ? <><Loader size={20} className="animate-spin" /> AI analyseert...</> : "Woorden extraheren"}
          </button>
          {pairs.length > 0 && (
            <div>
              <p className="font-semibold text-gray-700 mb-3">{pairs.length} gevonden woordparen</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {pairs.map((p, i) => (
                  <div key={i} className="flex gap-2 items-center bg-gray-50 rounded-lg px-3 py-2">
                    <input className="flex-1 bg-transparent border-b border-gray-200 focus:outline-none text-sm" value={p.term} onChange={e => updatePair(i, "term", e.target.value)} />
                    <span className="text-gray-300">-</span>
                    <input className="flex-1 bg-transparent border-b border-gray-200 focus:outline-none text-sm" value={p.definition} onChange={e => updatePair(i, "definition", e.target.value)} />
                    <button onClick={() => removePair(i)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <button onClick={handleImport} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                <Check size={20} /> {pairs.length} woorden importeren
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}