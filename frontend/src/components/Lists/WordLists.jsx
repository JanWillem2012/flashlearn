import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLists, createList, deleteList } from "../../firebase/db";
import AppLayout from "../Layout/AppLayout";
import toast from "react-hot-toast";
import { Plus, Trash2, BookOpen, ChevronRight, X } from "lucide-react";

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
    toast.success("Lijst aangemaakt!");
    setName(""); setShowForm(false); load();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Lijst en alle woorden verwijderen?")) return;
    await deleteList(id); toast.success("Verwijderd"); load();
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Woordenlijsten</h1>
            <p className="text-slate-500 text-sm mt-1">{lists.length} lijst{lists.length !== 1 ? "en" : ""}</p>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            className="btn-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <span><Plus size={15} /></span>
            <span>Nieuwe lijst</span>
          </button>
        </div>

        {/* Formulier */}
        {showForm && (
          <div className="glass rounded-2xl p-6 mb-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">Nieuwe woordenlijst</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-600 hover:text-slate-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <input className="input-dark w-full rounded-xl px-4 py-2.5 mb-4 text-sm"
              placeholder="Naam (bijv. Hoofdstuk 3)"
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()} />
            <div className="flex gap-3 mb-5">
              <div className="flex-1">
                <label className="text-xs text-slate-600 mb-1.5 block">Van</label>
                <input className="input-dark w-full rounded-xl px-3 py-2 text-sm"
                  value={langFrom} onChange={e => setLangFrom(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-600 mb-1.5 block">Naar</label>
                <input className="input-dark w-full rounded-xl px-3 py-2 text-sm"
                  value={langTo} onChange={e => setLangTo(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate}
                className="btn-primary text-white px-5 py-2 rounded-xl text-sm font-medium">
                <span>Aanmaken</span>
              </button>
              <button onClick={() => setShowForm(false)}
                className="btn-ghost text-slate-400 px-5 py-2 rounded-xl text-sm">
                Annuleren
              </button>
            </div>
          </div>
        )}

        {/* Lege staat */}
        {lists.length === 0 && !showForm && (
          <div className="glass rounded-2xl p-16 text-center">
            <BookOpen size={40} className="mx-auto mb-4 text-slate-700" />
            <p className="text-slate-500 text-sm mb-4">Nog geen woordenlijsten</p>
            <button onClick={() => setShowForm(true)}
              className="btn-primary text-white text-sm px-6 py-2.5 rounded-xl font-medium">
              <span>Eerste lijst maken</span>
            </button>
          </div>
        )}

        {/* Lijst */}
        <div className="grid gap-3">
          {lists.map((l, i) => (
            <div key={l.id} onClick={() => nav("/lists/" + l.id)}
              className={"glass glass-hover rounded-2xl p-5 flex items-center justify-between cursor-pointer group animate-fadeUp"}
              style={{ animationDelay: i * 0.05 + "s" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "rgba(124,58,237,0.1)" }}>
                  &#x1F4DA;
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{l.name}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{l.langFrom} &rarr; {l.langTo} &middot; {l.wordCount||0} woorden</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={"/study/" + l.id} onClick={e => e.stopPropagation()}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa" }}>
                  Oefenen
                </Link>
                <button onClick={e => handleDelete(l.id, e)}
                  className="p-1.5 rounded-lg text-slate-700 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
                <ChevronRight size={14} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}