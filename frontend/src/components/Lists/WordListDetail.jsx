import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getWords, addWord, updateWord, deleteWord } from "../../firebase/db";
import ScanModal from "./ScanModal";
import AppLayout from "../Layout/AppLayout";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Camera, Check, X, BookOpen } from "lucide-react";

export default function WordListDetail() {
  const { listId } = useParams();
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [term, setTerm] = useState("");
  const [def, setDef] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTerm, setEditTerm] = useState("");
  const [editDef, setEditDef] = useState("");
  const [showScan, setShowScan] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => getWords(listId).then(setWords);
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!term.trim() || !def.trim()) return toast.error("Vul beide velden in");
    await addWord(listId, user.uid, term.trim(), def.trim());
    setTerm(""); setDef(""); load();
  };

  const handleEdit = async (id) => {
    await updateWord(id, editTerm, editDef);
    setEditId(null); load();
  };

  const handleDelete = async (id) => { await deleteWord(id, listId); load(); };

  const handleScanImport = async (pairs) => {
    for (const p of pairs) await addWord(listId, user.uid, p.term, p.definition);
    toast.success(pairs.length + " woorden toegevoegd!"); load();
  };

  const filtered = words.filter(w =>
    w.term.toLowerCase().includes(search.toLowerCase()) ||
    w.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Woordenlijst</h1>
            <p className="text-slate-500 text-sm mt-1">{words.length} woorden</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowScan(true)}
              className="btn-ghost text-slate-300 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <Camera size={14} /> AI Scan
            </button>
            <Link to={"/study/" + listId}
              className="btn-primary text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <span>Oefenen</span>
            </Link>
          </div>
        </div>

        {/* Toevoegen */}
        <div className="glass rounded-2xl p-5 mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Woord toevoegen</p>
          <div className="flex gap-3">
            <input className="input-dark flex-1 rounded-xl px-4 py-2.5 text-sm"
              placeholder="Woord / term"
              value={term} onChange={e => setTerm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <input className="input-dark flex-1 rounded-xl px-4 py-2.5 text-sm"
              placeholder="Vertaling / definitie"
              value={def} onChange={e => setDef(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <button onClick={handleAdd}
              className="btn-primary text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
              <span><Plus size={16} /></span>
            </button>
          </div>
        </div>

        {/* Zoekbalk */}
        {words.length > 5 && (
          <input className="input-dark w-full rounded-xl px-4 py-2.5 text-sm mb-4"
            placeholder="Zoeken in woorden..."
            value={search} onChange={e => setSearch(e.target.value)} />
        )}

        {/* Woorden */}
        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <BookOpen size={32} className="mx-auto mb-3 text-slate-700" />
            <p className="text-slate-600 text-sm">
              {words.length === 0 ? "Nog geen woorden toegevoegd" : "Geen resultaten"}
            </p>
          </div>
        )}

        <div className="grid gap-2">
          {filtered.map((w, i) => (
            <div key={w.id}
              className={"glass rounded-xl px-4 py-3 flex items-center gap-3 group animate-slide-in"}
              style={{ animationDelay: i * 0.03 + "s" }}>
              {editId === w.id ? (
                <>
                  <input className="input-dark flex-1 rounded-lg px-3 py-1.5 text-sm"
                    value={editTerm} onChange={e => setEditTerm(e.target.value)} />
                  <input className="input-dark flex-1 rounded-lg px-3 py-1.5 text-sm"
                    value={editDef} onChange={e => setEditDef(e.target.value)} />
                  <button onClick={() => handleEdit(w.id)} className="text-green-400 hover:text-green-300 p-1 transition-colors">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditId(null)} className="text-slate-600 hover:text-slate-400 p-1 transition-colors">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-white text-sm font-medium">{w.term}</span>
                  <span className="text-slate-600 text-xs mx-1">&rarr;</span>
                  <span className="flex-1 text-slate-400 text-sm">{w.definition}</span>
                  <span className="text-xs text-slate-700 w-6 text-center">{w.repetitions || 0}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditId(w.id); setEditTerm(w.term); setEditDef(w.definition); }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(w.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {showScan && <ScanModal onClose={() => setShowScan(false)} onImport={handleScanImport} />}
    </AppLayout>
  );
}