import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ExternalLink, Eye, EyeOff, Loader2, ChevronDown, FileText } from "lucide-react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import AppearanceControls from "../components/AppearanceControls";
import OriginalPdfPage from "../components/OriginalPdfPage";
import { readerYears, getReaderSolution, questionPage, type PaperSection, type ReaderSolution } from "../exam-reader-data";

GlobalWorkerOptions.workerSrc = workerUrl;

function AnswerBelow({ solution, visible, referenceOnly }: { solution: ReaderSolution; visible: boolean; referenceOnly: boolean }) {
  const [open, setOpen] = useState(visible);
  useEffect(() => setOpen(visible), [visible]);
  return <section className="reader-answer" id={`answer-q${solution.question}`} data-question={solution.question}>
    <button className="reader-answer-heading" onClick={() => setOpen(v => !v)} aria-expanded={open}>
      <div><span className="reader-answer-label">SQ Q{solution.question} · 答案與講解</span><h3>{solution.titleZh}</h3></div>
      <ChevronDown size={18} className={open ? "rotate-180" : ""} />
    </button>
    {open && <div className="reader-answer-content">
      <div className="reader-source-note">{referenceOnly ? "自行解題的參考答案 · 非學校官方答案" : "對照學校答案的溫習解說 · 中文解釋由網站補充"}</div>
      <div className="reader-final-answer"><h4>Answer · 答案</h4><p className="reader-preserve-lines">{solution.answer}</p><h4 className="mt-3">中文答案／概念翻譯</h4><p className="reader-preserve-lines">{solution.answerZh}</p></div>
      <div><h4>用甚麼公式？</h4><div className="reader-formulas">{solution.formulas.map((formula, i) => <code key={i}>{formula}</code>)}</div></div>
      <div><h4>為甚麼這樣做？</h4><p className="reader-preserve-lines">{solution.explanationZh}</p><details className="reader-english"><summary>English reasoning · 英文作答思路</summary><p className="mt-2 reader-preserve-lines">{solution.explanation}</p></details></div>
      {solution.steps && solution.steps.length > 0 && <div><h4>一步一步講解</h4><ol className="reader-steps">{solution.steps.map((step, i) => <li key={i}><span>{i + 1}</span><div><h5>{step.label}</h5><p className="reader-preserve-lines">{step.zh}</p><details className="reader-english"><summary>English</summary><p className="mt-2">{step.en}</p></details></div></li>)}</ol></div>}
      {solution.sourceNotes && <p className="reader-source-note">{solution.sourceNotes}</p>}
    </div>}
  </section>;
}

export default function ExamReader() {
  const [, params] = useRoute("/papers/:year/:section");
  const year = readerYears.find(y => y.id === params?.year);
  const validSection = params?.section === "mc" || params?.section === "sq" || params?.section === "answers";
  const section: PaperSection = params?.section === "mc" ? "mc" : "sq";
  const sourceUrl = year?.source[section];
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [showAnswers, setShowAnswers] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(1);

  useEffect(() => {
    if (!sourceUrl) return;
    setPdf(null); setError("");
    const task = getDocument({ url: sourceUrl });
    let cancelled = false;
    task.promise.then(document => { if (!cancelled) setPdf(document); }).catch(err => {
      if (!cancelled) { console.error("PDF load failed", err); setError("原卷暫時未能載入。請重試，或使用「開啟原 PDF」閱讀。"); }
    });
    return () => { cancelled = true; void task.destroy(); };
  }, [sourceUrl, retry]);

  useEffect(() => { setSelectedQuestion(1); setShowAnswers(true); window.scrollTo({ top: 0 }); }, [params?.year, params?.section]);

  if (!year || !validSection) return <main className="reader-not-found"><h1>找不到這份試卷</h1><Link href="/papers">返回歷屆試卷</Link></main>;

  const jumpTo = (question: number) => {
    setSelectedQuestion(question);
    const page = questionPage(year, section, question);
    if (page) document.getElementById(`source-page-${page}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const questionCount = section === "mc" ? 27 : 10;
  return <div className="app-shell exam-reader">
    <nav className="glass-nav reader-nav"><Link href="/papers" className="reader-back"><ArrowLeft size={17} /> <span>歷屆試卷</span></Link><span className="reader-nav-title">{year.year} · {section.toUpperCase()}</span><AppearanceControls compact /></nav>
    <header className="reader-header"><div className="reader-header-inner"><p className="eyebrow">ORIGINAL PAPER → ANSWER · 原卷 → 隨題解說</p><h1>{year.year} <span>{section === "mc" ? "MC 選擇題" : "SQ 長答題"}</span></h1><p>{section === "mc" ? "每頁原題下方列出該頁的 MC 答案。" : "答案、使用公式及中文講解就在相應原卷頁面的下方。"}原圖及掃描筆跡保持不變。</p><div className="reader-section-tabs" aria-label="選擇試卷類型"><Link href={`/papers/${year.id}/mc`} className={section === "mc" ? "active" : ""}>MC 選擇題</Link><Link href={`/papers/${year.id}/sq`} className={section === "sq" ? "active" : ""}>SQ 長答題</Link><a href={sourceUrl} target="_blank" rel="noopener noreferrer">開啟原 PDF <ExternalLink size={13} /></a>{year.markingScheme && <a href={year.markingScheme} target="_blank" rel="noopener noreferrer">學校答案 PDF <ExternalLink size={13} /></a>}</div><p className="reader-disclaimer">{year.referenceOnly ? "2024–25：未附學校答案；以下為自行解題的參考答案，不代表學校評分標準。" : "計算與概念答案對照所附學校答案；中文翻譯及推理說明為溫習用。"}{year.id === "2425" ? " 原卷為雙頁掃描，同一頁的兩題答案按題號排列在圖下方。" : ""}</p><p className="reader-disclaimer">Apple Pencil：要在 PDF 上標記並保存，請用「開啟原 PDF」下載至 iPad「檔案」，再用「標示」。本頁不會改寫原 PDF。</p></div></header>
    <div className="reader-toolbar"><div><label htmlFor="reader-question">跳至題目</label><select id="reader-question" value={selectedQuestion} onChange={e => jumpTo(Number(e.target.value))} disabled={!pdf}>{Array.from({ length: questionCount }, (_, i) => <option key={i} value={i + 1}>{section.toUpperCase()} Q{i + 1}</option>)}</select></div><button onClick={() => setShowAnswers(v => !v)}>{showAnswers ? <EyeOff size={16} /> : <Eye size={16} />}{showAnswers ? "收起答案" : "顯示答案"}</button><span className="reader-toolbar-note">向下閱讀：原題 → 答案 → 下一頁</span></div>
    <main className="reader-main">
      {!pdf && !error && <div className="reader-loading" role="status"><Loader2 size={24} className="animate-spin" /><p>正在載入原版 PDF…</p>{year.id === "2425" && <p>2024–25 掃描卷較大，首次載入可能需要數秒。</p>}</div>}
      {error && <div className="reader-error" role="alert"><FileText size={24} /><p>{error}</p><button onClick={() => setRetry(v => v + 1)}>重新載入</button><a href={sourceUrl} target="_blank" rel="noopener noreferrer">開啟原 PDF</a></div>}
      {pdf && year.pages[section].map(page => <article className="reader-source-block" id={`source-page-${page.page}`} key={`${sourceUrl}-${page.page}`} data-source-page={page.page}>
        <div className="reader-page-heading"><span>原版 PDF · 第 {page.page} 頁</span><strong>{page.label ?? `${section.toUpperCase()} ${page.questions.map(q => `Q${q}`).join("、")}`}</strong></div>
        <OriginalPdfPage pdf={pdf} pageNumber={page.page} accessibleLabel={`${year.year} ${section.toUpperCase()} 原卷第 ${page.page} 頁`} />
        {page.questions.length === 0 && <p className="reader-continuation">本題尚有續頁；完整答案緊接下一張原卷頁面下方。</p>}
        <div className="reader-under-pdf" data-answer-for-page={page.page}>
          {section === "mc" && <section className="reader-mc-answer"><button className="reader-answer-heading" onClick={() => setShowAnswers(v => !v)} aria-expanded={showAnswers}><h3>MC 答案 · 本頁 {page.questions.map(q => `Q${q}`).join("、")}</h3><ChevronDown size={18} className={showAnswers ? "rotate-180" : ""} /></button>{showAnswers && <div className="reader-mc-grid">{page.questions.map(q => <div key={q}><span>MC Q{q}</span><strong>{year.mcAnswers[q - 1] ?? "待核對"}</strong></div>)}<p>{year.referenceOnly ? "自行解題的參考答案 · 非學校官方答案" : "答案來源：附件中的學校評分標準"}</p></div>}</section>}
          {section === "sq" && page.questions.map(q => { const solution = getReaderSolution(year, q); return solution ? <AnswerBelow solution={solution} visible={showAnswers} referenceOnly={year.referenceOnly} key={`${year.id}-${q}`} /> : <p className="reader-error" key={q}>SQ Q{q} 答案尚未載入。</p>; })}
        </div>
      </article>)}
      <div className="reader-bottom-links"><Link href="/papers">返回年份選單</Link><Link href={`/papers/${year.id}/${section === "mc" ? "sq" : "mc"}`}>轉到 {section === "mc" ? "SQ 長答題" : "MC 選擇題"}</Link><a href="/formula-library" target="_blank" rel="noopener noreferrer">完整公式庫 <ExternalLink size={13} /></a></div>
    </main>
  </div>;
}
