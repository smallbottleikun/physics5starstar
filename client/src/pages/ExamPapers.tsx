import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Search, ChevronDown, PencilLine } from "lucide-react";
import AppearanceControls from "../components/AppearanceControls";
import MathFormula from "../components/MathFormula";
import { workedQuestions, type WorkedQuestion } from "../paper-data";
import { coverageAudit } from "../exam-audit";
import { readerYears } from "../exam-reader-data";

function WorkedCard({ item }: { item: WorkedQuestion }) {
  const [open, setOpen] = useState(false);
  return <article className="paper-worked-card">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{item.source} · {item.difficulty}</p><h3 className="text-lg font-bold">{item.titleZh}</h3><p className="lesson-en mt-1">{item.title}</p></div><button className="paper-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open}>{open ? "收起" : "逐步講解"}<ChevronDown size={15} className={open ? "rotate-180" : ""} /></button></div>
    <div className="paper-prompt mt-4"><p className="lesson-en">{item.prompt}</p><p className="lesson-zh">{item.promptZh}</p></div><div className="paper-answer mt-4"><strong>Answer · 答案</strong><p>{item.answer}</p><p className="lesson-zh">{item.answerZh}</p></div>
    {open && <div className="mt-5 space-y-3">{item.steps.map((step, i) => <div className="paper-step" key={i}><span className="lesson-step-number">{i + 1}</span><div className="min-w-0"><h4 className="font-semibold">{step.title}</h4><p className="lesson-en mt-1">{step.en}</p><p className="lesson-zh">{step.zh}</p>{step.formula && <div className="paper-formula"><MathFormula latex={step.formula} /></div>}{step.result && <div className="paper-result"><MathFormula latex={step.result} /></div>}</div></div>)}</div>}
  </article>;
}

export default function ExamPapers() {
  const [query, setQuery] = useState("");
  // Year-specific examples now live below the ORIGINAL PDF in the reader, not in a detached answer list.
  const supplementary = workedQuestions.filter(q => q.id.startsWith("supp-") && `${q.title} ${q.titleZh} ${q.topic}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="app-shell paper-page">
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between gap-3 px-4 sm:px-6"><Link href="/" className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}><ArrowLeft size={16} />所有主題</Link><div className="flex items-center gap-2"><a href="/formula-library" target="_blank" rel="noopener noreferrer" className="paper-nav-link hidden sm:inline-flex">完整公式庫 <ExternalLink size={12} /></a><AppearanceControls compact /></div></nav>
    <header className="pt-24 pb-9 px-4 sm:px-6 paper-hero"><div className="max-w-7xl mx-auto"><p className="eyebrow mb-3">PAST PAPERS · 歷屆試卷</p><h1 className="text-3xl md:text-4xl font-bold">選擇年份與試卷</h1><p className="lesson-en mt-4">Original PDF above. Matching answers and explanations immediately below.</p><p className="lesson-zh">先選年份，再選 MC 或 SQ。答案、公式與中文講解放在相應原卷頁面的下方，不用另外找答案區。</p></div></header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-12">
      <section className="paper-section"><div className="paper-section-heading"><div><p className="eyebrow">SOURCE SET · 原題本</p><h2>近三年試卷</h2></div><span className="paper-count">MC：選擇題 · SQ：長答題</span></div>
        <div className="grid md:grid-cols-3 gap-5">{readerYears.map(year => <article className="paper-year-card year-entry-card" key={year.id}><div className="flex justify-between items-start"><div><span className="paper-year">{year.year}</span><h3 className="mt-2 font-bold">First Assessment · Form 5 Physics</h3></div><FileText size={20} style={{ color: "var(--color-cyan)" }} /></div><p className="lesson-zh mt-4">{year.note}</p><p className="year-question-count">27 MC 選擇題 · 10 SQ 長答題</p>
          <div className="year-entry-links"><Link href={`/papers/${year.id}/mc`} className="year-entry-link mc"><span><b>MC 選擇題</b><small>Section A · 原卷＋本頁答案</small></span><ArrowRight size={17} /></Link><Link href={`/papers/${year.id}/sq`} className="year-entry-link sq"><span><b>SQ 長答題</b><small>Section B · 原卷＋中文講解</small></span><ArrowRight size={17} /></Link><Link href={`/papers/${year.id}/answers`} className="year-entry-link answer"><span><b>答案與講解</b><small>{year.referenceOnly ? "自行解題的參考答案" : "對照學校答案的溫習解說"}</small></span><ArrowRight size={17} /></Link></div>
          <p className="year-status">{year.referenceOnly ? "2024–25 答案與其他年份位於相同入口及原題下方；非學校官方答案。" : "有學校答案檔；中文翻譯及解說已隨題放置。"}</p>
        </article>)}</div>
        <div className="paper-pencil-note mt-5"><PencilLine size={20} className="shrink-0" /><div><strong>iPad 閱讀與標記</strong><p className="lesson-zh">網站按原 PDF 頁面顯示，保留所有圖表及掃描筆跡。要用 Apple Pencil 標記並保存，請在閱讀頁按「開啟原 PDF」，下載至 iPad「檔案」後使用「標示」。</p></div></div>
      </section>
      <section className="paper-section"><div className="paper-section-heading"><div><p className="eyebrow">SUPPLEMENTARY · 補充練習</p><h2>經典與高難度題目</h2></div><label className="paper-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜尋補充練習" aria-label="搜尋補充練習" /></label></div><p className="lesson-zh mb-4">歷年試卷題目已移到各年份的 MC／SQ 閱讀頁；此處只保留子資料夾的精選練習。</p><div className="space-y-4">{supplementary.map(q => <WorkedCard item={q} key={q.id} />)}{supplementary.length === 0 && <p className="paper-empty">找不到符合的補充題目。</p>}</div></section>
      <section className="paper-section"><div className="paper-section-heading"><div><p className="eyebrow">COVERAGE AUDIT · 內容審核</p><h2>考試概念與公式覆蓋</h2></div></div><p className="lesson-zh mb-4">此為 2023–24、2025–26 長答題的既有覆蓋審核，不代表整個 DSE 考綱已全部收錄。</p><div className="coverage-grid">{coverageAudit.map(item => <div className={`coverage-card ${item.status}`} key={item.area}><span className="coverage-status">{item.status === "covered" ? "Covered · 已涵蓋" : "Add detail · 待加深"}</span><strong>{item.area}</strong><span className="lesson-zh">{item.zh}</span><p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{item.note}</p></div>)}</div></section>
    </main>
  </div>;
}
