import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import DemoFlashcard from "./DemoFlashcard";

const features = [
  {
    icon: "&#x1F9E0;",
    title: "Spaced Repetition",
    desc: "Het SM-2 algoritme bepaalt wanneer je elk woord moet herhalen voor maximale retentie.",
    color: "violet"
  },
  {
    icon: "&#x1F4F7;",
    title: "AI Woordscan",
    desc: "Foto van een woordenlijst? De AI haalt automatisch alle woordparen eruit.",
    color: "blue"
  },
  {
    icon: "&#x1F3AF;",
    title: "4 Leermodi",
    desc: "Flashcards, intypen, multiple choice en dictee voor afwisselend leren.",
    color: "green"
  },
  {
    icon: "&#x1F4CA;",
    title: "Voortgang bijhouden",
    desc: "Gedetailleerde statistieken per sessie en per woordenlijst.",
    color: "orange"
  },
];

const colorMap = {
  violet: { bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)", icon: "rgba(124,58,237,0.2)", text: "#a78bfa" },
  blue:   { bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", icon: "rgba(59,130,246,0.2)", text: "#60a5fa" },
  green:  { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", icon: "rgba(52,211,153,0.2)", text: "#34d399" },
  orange: { bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", icon: "rgba(251,146,60,0.2)", text: "#fb923c" },
};

const steps = [
  { n: "01", title: "Maak een lijst", desc: "Voeg woorden toe of scan een bestaande lijst met de AI." },
  { n: "02", title: "Kies een modus",  desc: "Flashcards, intypen, multiple choice of dictee." },
  { n: "03", title: "Leer slim",       desc: "Het algoritme zorgt dat je herhaalt op het juiste moment." },
];

export default function HomePage() {
  const { user, loginGoogle } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/dashboard");
  }, [user]);

  return (
    <div className="min-h-screen bg-[#07070f] text-white overflow-x-hidden">
      <Navbar />

      {/* Achtergrond orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* â”€â”€ HERO â”€â”€ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-20 items-center">

          {/* Links */}
          <div>
            <div className="badge badge-violet mb-8 animate-fadeUp">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
              Powered by AI + Spaced Repetition
            </div>

            <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight mb-6 animate-fadeUp d100">
              Leer woorden
              <span className="block gradient-text mt-1">razendsnel</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md animate-fadeUp d200">
              FlashLearn gebruikt AI en bewezen leerwetenschappen om jou woorden sneller en beter te laten onthouden.
            </p>

            <div className="flex flex-wrap gap-3 mb-12 animate-fadeUp d300">
              <button onClick={loginGoogle}
                className="btn-primary text-white font-semibold px-8 py-3.5 rounded-xl text-sm">
                <span>Gratis beginnen</span>
              </button>
              <a href="#demo"
                className="btn-ghost text-slate-300 font-medium px-8 py-3.5 rounded-xl text-sm">
                Bekijk demo
              </a>
            </div>

            <div className="flex items-center gap-8 animate-fadeUp d400">
              {[["4", "leermodi"], ["SM-2", "algoritme"], ["AI", "woordscan"]].map(([v, l]) => (
                <div key={l} className="text-center">
                  <p className="text-xl font-bold gradient-text-static">{v}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rechts â€“ demo card */}
          <div className="flex justify-center lg:justify-end animate-fadeUp d200">
            <div className="animate-float">
              <DemoFlashcard />
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ HOE HET WERKT â”€â”€ */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-medium mb-3 uppercase tracking-widest">Hoe het werkt</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Drie stappen naar succes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="glass glass-hover rounded-2xl p-6 transition-all">
                <p className="text-4xl font-bold mb-4" style={{ color: "rgba(124,58,237,0.4)" }}>{s.n}</p>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ DEMO â”€â”€ */}
      <section id="demo" className="relative py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-violet-400 text-sm font-medium mb-3 uppercase tracking-widest">Interactieve demo</p>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Probeer het nu</h2>
          <p className="text-slate-500 mb-12 text-sm">Klik de kaart om te draaien, beoordeel jezelf</p>
          <div className="flex justify-center">
            <DemoFlashcard interactive />
          </div>
        </div>
      </section>

      {/* â”€â”€ FEATURES â”€â”€ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-medium mb-3 uppercase tracking-widest">Functionaliteit</p>
            <h2 className="text-3xl lg:text-4xl font-bold">Alles wat je nodig hebt</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              return (
                <div key={i} className="rounded-2xl p-6 transition-all duration-300 group cursor-default"
                  style={{ background: c.bg, border: "1px solid " + c.border }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-5"
                    style={{ background: c.icon }}>
                    <span dangerouslySetInnerHTML={{ __html: f.icon }} />
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€ */}
      <section className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl p-px"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.2), rgba(52,211,153,0.2))" }}>
            <div className="rounded-3xl p-12 text-center"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(7,7,15,0.95))" }}>
              <h2 className="text-3xl font-bold mb-4">Klaar om te starten?</h2>
              <p className="text-slate-400 mb-8 text-sm">Gratis. Geen creditcard nodig. Begin meteen.</p>
              <button onClick={loginGoogle}
                className="btn-primary text-white font-semibold px-10 py-3.5 rounded-xl">
                <span>Inloggen met Google</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-white/5">
        <p className="text-slate-700 text-xs">FlashLearn &mdash; Gebouwd met React, Firebase en Ollama</p>
      </footer>
    </div>
  );
}