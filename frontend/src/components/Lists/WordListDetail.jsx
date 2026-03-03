import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getWords, addWord, updateWord, deleteWord } from "../../firebase/db";
import ScanModal from "./ScanModal";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Camera, Check, X } from "lucide-react";
export default function WordListDetail() {
  const { listId } = useParams();
  const { user } = useAuth();
  const [words, setWords] = useState([]);
  const [term, setTerm] = useState(""); const [def, setDef] = useState("");
  const [editId, setEditId] = useState(null); const [editTerm, setEditTerm] = useState(""); const [editDef, setEditDef] = useState("");
  const [showScan, setShowScan] = useState(false);
  const load = () => getWords(listId).then(setWords);
  useEffect(() => { load(); }, []);
  const handleAdd = async () => {
    if (!term.trim() || !def.trim()) return toast.error("Vul beide velden in");
    await addWord(listId, user.uid, term.trim(), def.trim());
    setTerm(""); setDef(""); load();
  };
  const handleEdit = async (id) => { await updateWord(id, editTerm, editDef); setEditId(null); load(); };
  const handleDelete = async (id) => { await deleteWord(id, listId); load(); };
  const handleScanImport = async (pairs) => {
    for (const p of pairs) await addWord(listId, user.uid, p.term, p.definition);
    toast.success(pairs.length + " woorden toegevoegd!"); load();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center gap-4 shadow">
        <Link to="/lists"><ArrowLeft size={20} /></Link>
        <span className="text-xl font-bold">Woordenlijst</span>
        <div className="ml-auto flex gap-3">
          <button onClick={() => setShowScan(true)} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 px-3 py-1 rounded-lg text-sm"><Camera size={16} /> Scannen met AI</button>
          <Link to={"/study/" + listId} className="bg-white text-indigo-700 font-semibold px-3 py-1 rounded-lg text-sm">Oefenen</Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-5 mb-6 border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3">Woord toevoegen</h3>
          <div className="flex gap-3">
            <input className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Woord / term" value={term} onChange={e => setTerm(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <input className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" placeholder="Vertaling / definitie" value={def} onChange={e => setDef(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} />
            <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"><Plus size={20} /></button>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-3">{words.length} woorden</p>
        <div className="grid gap-2">
          {words.map(w => (
            <div key={w.id} className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
              {editId === w.id ? (
                <>
                  <input className="flex-1 border rounded px-2 py-1 text-sm" value={editTerm} onChange={e => setEditTerm(e.target.value)} />
                  <input className="flex-1 border rounded px-2 py-1 text-sm" value={editDef} onChange={e => setEditDef(e.target.value)} />
                  <button onClick={() => handleEdit(w.id)} className="text-green-500"><Check size={18} /></button>
                  <button onClick={() => setEditId(null)} className="text-gray-400"><X size={18} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium text-gray-800">{w.term}</span>
                  <span className="flex-1 text-gray-500">{w.definition}</span>
                  <span className="text-xs text-gray-300">x{w.repetitions}</span>
                  <button onClick={() => { setEditId(w.id); setEditTerm(w.term); setEditDef(w.definition); }} className="text-gray-300 hover:text-indigo-500"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(w.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {showScan && <ScanModal onClose={() => setShowScan(false)} onImport={handleScanImport} />}
    </div>
  );
}