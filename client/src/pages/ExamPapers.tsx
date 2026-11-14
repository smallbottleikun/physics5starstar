import { useState } from "react";
import { ArrowLeft, ExternalLink, FileText, Search, Star, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import AppearanceControls from "../components/AppearanceControls";
import MathFormula from "../components/MathFormula";
import { paperYears, workedQuestions, type WorkedQuestion } from "../paper-data";
import { coverageAudit, longAnswerIndex } from "../exam-audit";
import { longAnswerSolutions } from "../long-answer-solutions";

const DIFFICULTY: Record<WorkedQuestion["difficulty"], string> = { Classic: "var(--color-cyan)", "High challenge": "var(--color-orange)" };

function WorkedCard({ item }: { item: WorkedQuestion }) {
  const [open, setOpen] = useState(false);
  return <article className="paper-worked-card" style={{ borderLeft: `3px solid ${DIFFICULTY[item.difficulty]}` }}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs" style={{ color: "var(--text-muted)" }}><span>{item.source}</span><span className="paper-pill" style={{ color: DIFFICULTY[item.difficulty] }}>{item.difficulty}</span><span>{item.topic}</span></div>
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
        <p className="lesson-zh mt-1">{item.titleZh}</p>
      </div>
      <button className="paper-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open}>{open ? "收起" : "逐步講解"} <ChevronDown size={15} className={open ? "rotate-180" : ""} /></button>
    </div>
    <div className="paper-prompt mt-4"><p className="lesson-en">{item.prompt}</p><p className="lesson-zh">{item.promptZh}</p></div>
    <div className="paper-answer mt-4"><strong>Answer · 答案</strong><p className="mt-1">{item.answer}</p><p className="lesson-zh">{item.answerZh}</p></div>
    {open && <div className="mt-5 space-y-3">{item.steps.map((step, index) => <div className="paper-step" key={step.title}><span className="lesson-step-number">{index + 1}</span><div className="min-w-0"><h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>{step.title}</h4><p className="lesson-en mt-1">{step.en}</p><p className="lesson-zh">{step.zh}</p>{step.formula && <div className="paper-formula"><MathFormula latex={step.formula} /></div>}{step.result && <div className="paper-result"><MathFormula latex={step.result} /></div>}</div></div>)}<div className="paper-used-formulas"><strong>Formulas used · 使用公式：</strong> {item.formulas.join(" · ")}</div></div>}
  </article>;
}

export default function ExamPapers() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const filtered = workedQuestions.filter(q => `${q.title} ${q.titleZh} ${q.topic} ${q.source}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="app-shell paper-page">
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between gap-3 px-4 sm:px-6">
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}><ArrowLeft size={16} /> <span>All topics</span><span className="hidden sm:inline">所有主題</span></button>
      <div className="flex items-center gap-2"><a href="/formula-library" target="_blank" rel="noopener noreferrer" className="paper-nav-link hidden sm:inline-flex">公式庫 Formula library <ExternalLink size={12} /></a><AppearanceControls compact /></div>
    </nav>
    <header className="pt-24 pb-9 px-4 sm:px-6 paper-hero"><div className="max-w-7xl mx-auto"><p className="eyebrow mb-3">PAST PAPERS · 歷屆試卷</p><h1 className="text-3xl md:text-4xl font-bold">試卷與逐題講解</h1><p className="lesson-en max-w-3xl mt-4">Three recent school assessment papers, supplied answer keys, and selected classic / high-challenge questions explained step by step.</p><p className="lesson-zh max-w-3xl">近三年試卷、附件中的兩年答案，以及經典和高難度題目的逐步推理。答案只會在附件有提供時標示，不會猜測未提供的官方答案。</p></div></header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-12">
      <section className="paper-section"><div className="paper-section-heading"><div><p className="eyebrow">SOURCE SET · 題本</p><h2>近三年試卷</h2></div><span className="paper-count">{paperYears.length} years · {paperYears.reduce((n,p) => n + p.mcqCount + p.structuredCount, 0)} questions</span></div><div className="paper-pencil-note"><span></span><div><strong>iPad + Apple Pencil Pro 使用方法</strong><p className="lesson-zh">按年份卡片中的「開啟原卷」後，PDF 會在新頁面開啟；在 iPad 用分享／標示（Markup）即可直接圈題、寫步驟和畫圖。完成後建議存到「檔案」或「圖書」，因為瀏覽器本身不會替你永久保存 PDF 筆記。</p></div></div><div className="grid md:grid-cols-3 gap-4 mt-4">{paperYears.map(paper => <article className="paper-year-card" key={paper.year}><div className="flex items-start justify-between gap-3"><div><span className="paper-year">{paper.year}</span><h3 className="mt-2 font-bold" style={{ color: "var(--text-primary)" }}>{paper.title}</h3></div><FileText size={18} style={{ color: "var(--color-cyan)" }} /></div><p className="lesson-zh mt-3">{paper.note}</p><div className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>Section A {paper.mcqCount} MCQ · Section B {paper.structuredCount} structured</div><div className="mt-4 flex flex-wrap gap-2">{paper.files.map(file => <a key={file.url} className={`paper-file-link ${file.kind === "answer" ? "answer" : ""}`} href={file.url} target="_blank" rel="noopener noreferrer">{file.kind === "paper" ? "開啟原卷 · Apple Pencil" : file.label} <ExternalLink size={11} /></a>)}</div><p className="mt-4 text-xs" style={{ color: paper.answerStatus.includes("not") ? "var(--color-orange)" : "var(--color-cyan)" }}>{paper.answerStatus}</p></article>)}</div></section>

      <section className="paper-section"><div className="paper-section-heading"><div><p className="eyebrow">LONG ANSWERS · 長答題索引</p><h2>全部已附答案的長答題</h2></div><span className="paper-count">{longAnswerIndex.length} questions</span></div><p className="lesson-zh mb-4">以下索引對照原版 Section B 題號；按下每題即可在題目下方查看答案、公式、英文答題邏輯及繁中解釋。精選題另有上方完整逐步計算。</p><div className="long-answer-index">{longAnswerIndex.map(q => { const solution = longAnswerSolutions[`${q.year}-${q.question}`]; return <details className="long-answer-detail" key={`${q.year}-${q.question}`}><summary className="long-answer-row"><span className="paper-year">{q.year} {q.question}</span><div><strong>{q.title}</strong><span className="lesson-zh">{q.titleZh}</span></div><div className="long-answer-topics">{q.topics.map(topic => <span key={topic}>{topic}</span>)}</div><span className="text-xs" style={{ color: "var(--text-muted)" }}>{q.marks} marks</span></summary>{solution && <div className="long-answer-solution"><div><strong>Answer · 答案</strong><p className="mt-1">{solution.answer}</p></div><div><strong>Formulae · 使用公式</strong><p className="mt-1 paper-formula-text">{solution.formulas.join("  ·  ")}</p></div><div><strong>Reasoning · 解題思路</strong><p className="mt-1 lesson-en">{solution.explanation}</p><p className="lesson-zh">{solution.explanationZh}</p></div></div>}</details>})}</div></section>
      <section className="paper-section"><div className="paper-section-heading"><div><p className="eyebrow">WORKED EXAMPLES · 精選逐步解題</p><h2>經典與高難度題目</h2></div><div className="paper-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜尋 topic / 題目" aria-label="Search worked questions" /></div></div><p className="lesson-zh mb-5">每題先列出答案，再展開「逐步講解」查看物理條件、公式選擇、代入及方向判斷。</p><div className="space-y-4">{filtered.map(item => <WorkedCard item={item} key={item.id} />)}{filtered.length === 0 && <div className="paper-empty">找不到符合的題目。試試 momentum、gas、heat 或力矩。</div>}</div></section>
      <section className="paper-section"><div className="paper-section-heading"><div><p className="eyebrow">COVERAGE AUDIT · 內容審核</p><h2>考試概念與公式覆蓋</h2></div><span className="paper-count">{coverageAudit.filter(item => item.status === "covered").length}/{coverageAudit.length} fully covered</span></div><p className="lesson-zh mb-4">這是按附件兩年 Section B 長答題及目前網站主題作出的檢查。partial 代表已有公式／概念，但仍值得補上實驗圖、特殊情境或評分要點。</p><div className="coverage-grid">{coverageAudit.map(item => <div className={`coverage-card ${item.status}`} key={item.area}><span className="coverage-status">{item.status === "covered" ? "✓ Covered" : "△ Add detail"}</span><strong>{item.area}</strong><span className="lesson-zh">{item.zh}</span><p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{item.note}</p></div>)}</div></section>
      <section className="paper-section paper-note"><Star size={18} style={{ color: "var(--color-orange)" }} /><div><h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>如何使用這一頁？</h3><p className="lesson-zh mt-1">先下載或開啟原卷，限時完成；再用本頁的精選題檢查「條件 → 公式 → 方向 → 單位」四步。補充練習中的經典題目已按動量、力矩、氣體動理論及 RMS 等主題加入。</p></div></section>
    </main>
  </div>;
}
