import { useMemo, useState } from "react";
import { ArrowLeft, Search, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";
import AppearanceControls from "../components/AppearanceControls";
import MathFormula from "../components/MathFormula";
import { formulaSheet } from "../physics-content";
import { examFormulaNotes } from "../paper-data";

const allFormulas = [...formulaSheet, ...examFormulaNotes];
const groups = ["All", "Optics", "Mechanics", "Heat", "Waves", "Exam formula library"];
const groupTopics: Record<string, string[]> = {
  Optics: ["Reflection", "Refraction", "Total Internal Reflection", "Double Slit", "Diffraction Grating", "Lenses & Images"],
  Mechanics: ["Newton's Laws", "Resultant Force", "Work Done", "Moments & Equilibrium", "Momentum", "Projectile Motion", "Motion"],
  Heat: ["Heat", "Heat & Temperature", "Gases & Kinetic Theory"],
  Waves: ["Waves", "Double Slit", "Diffraction", "Diffraction Grating", "Stationary & Travelling Waves", "Longitudinal Waves"],
};

export default function FormulaLibrary() {
  const [, navigate] = useLocation();
  const [group, setGroup] = useState("All");
  const [query, setQuery] = useState("");
  const formulas = useMemo(() => allFormulas.filter(f => (group === "All" || (groupTopics[group] ?? [group]).includes(f.topic)) && `${f.name} ${f.nameZh} ${f.topic} ${f.topicZh}`.toLowerCase().includes(query.toLowerCase())), [group, query]);
  return <div className="app-shell formula-library-page">
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between gap-3 px-4 sm:px-6"><button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}><ArrowLeft size={16} /> <span>All topics</span><span className="hidden sm:inline">所有主題</span></button><div className="flex items-center gap-2"><a href="https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/phy/Phy-Formulae-e.pdf" target="_blank" rel="noopener noreferrer" className="paper-nav-link hidden sm:inline-flex">HKEAA official sheet <ExternalLink size={12} /></a><AppearanceControls compact /></div></nav>
    <header className="pt-24 pb-9 px-4 sm:px-6 formula-hero"><div className="max-w-7xl mx-auto"><p className="eyebrow mb-3">FORMULA LIBRARY · 完整公式庫</p><h1 className="text-3xl md:text-4xl font-bold">所有用過的公式</h1><p className="lesson-en max-w-3xl mt-4">A searchable formula reference for the website, recent papers and supplementary exercises. It includes formulas beyond the official HKEAA sheet, clearly labelled as extended revision content.</p><p className="lesson-zh max-w-3xl">這裏收錄網站、近三年試卷及補充練習曾用過的公式；包括 HKEAA 公式表沒有列出的延伸溫習公式，並提供每個符號的意思和單位。</p></div></header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20"><div className="formula-toolbar"><div className="flex flex-wrap gap-2">{groups.map(item => <button key={item} onClick={() => setGroup(item)} className="formula-filter" style={{ color: group === item ? "var(--color-cyan)" : "var(--text-muted)", borderColor: group === item ? "var(--color-cyan)" : "var(--border-subtle)" }}>{item === "All" ? "全部" : item}</button>)}</div><label className="paper-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜尋公式 / topic" aria-label="Search formula library" /></label></div><p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>{formulas.length} formulas · 公式均可展開查看符號與單位</p><div className="grid md:grid-cols-2 gap-4">{formulas.map((formula, i) => <details className="formula-library-card" key={`${formula.topic}-${formula.name}-${i}`}><summary><div><p className="text-xs" style={{ color: "var(--text-muted)" }}>{formula.topic} · {formula.topicZh}</p><h2 className="text-base font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{formula.name}<span className="font-normal opacity-70 ml-2">{formula.nameZh}</span></h2><div className="formula-display mt-3"><MathFormula latex={formula.latex} /></div></div><span className="formula-plus">+</span></summary><div className="formula-library-body"><div className="formula-display mb-4"><MathFormula latex={formula.latex} /></div><div className="formula-symbol-grid">{formula.symbols.map((symbol, index) => <div className="formula-symbol" key={`${symbol.symbol}-${index}`}><strong>{symbol.symbol}</strong><span>{symbol.meaning}</span><span className="lesson-zh">{symbol.meaningZh}</span><small>{symbol.unit}</small></div>)}</div></div></details>)}</div></main>
  </div>;
}
