import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLists, createList, deleteList } from "../../firebase/db";
import toast from "react-hot-toast";
import { Plus, Trash2, ArrowLeft, BookOpen } from "lucide-react";
export default function WordLists() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [lists, setLists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [langFrom, setLangFrom] = useState("Nederlands");
  const [langTo, setLangTo] = useState("Engels");
  const load = () => getLists(user.uid).then(setLists);
  useEffect(() => { load(); }, []);
  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Geef een naam op");
    await createList(user.uid, name.trim(), langFrom, langTo);
    toast.success("Lijst aangemaakt!"); setName(""); setShowForm(false); load();
  };
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Lijst en alle woorden verwijderen?")) return;
    await deleteList(id); toast.success("Verwijderd"); load();
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center gap-4 shadow">
        <Link to="/"><ArrowLeft size={20} /></Link>
        <span className="text-xl font-bold">Woordenlijsten</span>
      </nav>
      <div className="max-w-3xl mx-auto p-6">
        <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mb-6 font-medium">
          <Plus size={18} /> Nieuwe lijst
        </button>
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6 border border-indigo-100">
            <h3 className="font-bold text-lg mb-4">Nieuwe woordenlijst</h3>
            <input className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Naam (bijv. Hoofdstuk 3)" value={name} onChange={e => setName(e.target.value)} />
            <div className="flex gap-3 mb-4">
              <div className="flex-1"><label className="text-sm text-gray-500">Van taal</label><input className="w-full border rounded-lg px-3 py-2 mt-1" value={langFrom} onChange={e => setLangFrom(e.target.value)} /></div>
              <div className="flex-1"><label className="text-sm text-gray-500">Naar taal</label><input className="w-full border rounded-lg px-3 py-2 mt-1" value={langTo} onChange={e => setLangTo(e.target.value)} /></div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium">Aanmaken</button>
              <button onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg text-gray-600">Annuleren</button>
            </div>
          </div>
        )}
        {lists.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p>Nog geen lijsten. Maak er een aan!</p>
          </div>
        )}
        <div className="grid gap-4">
          {lists.map(l => (
            <div key={l.id} onClick={() => nav("/lists/" + l.id)} className="bg-white rounded-xl shadow hover:shadow-md cursor-pointer p-5 flex items-center justify-between border border-gray-100 transition-all">
              <div><p className="font-bold text-gray-800 text-lg">{l.name}</p><p className="text-sm text-gray-400">{l.langFrom} naar {l.langTo} - {l.wordCount || 0} woorden</p></div>
              <div className="flex items-center gap-3">
                <Link to={"/study/" + l.id} onClick={e => e.stopPropagation()} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">Oefenen</Link>
                <button onClick={e => handleDelete(l.id, e)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}