import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ExternalLink, Eye, EyeOff, Loader2, ChevronDown, FileText } from "lucide-react";
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import AppearanceControls from "../components/AppearanceControls";
import OriginalPdfPage from "../components/OriginalPdfPage";
import AnnotatablePaper from "../components/AnnotatablePaper";
import { readerYears, getReaderSolution, questionPage, type PaperSection, type ReaderSolution } from "../exam-reader-data";

GlobalWorkerOptions.workerSrc = workerUrl;

const QUICK_MC_REASONS_2425: Record<number, string> = {
  1: "熱容量的單位只需 J K⁻¹，不涉及每公斤或每攝氏度。",
  2: "溫度上升代表粒子的平均動能增加；粒子數和平均粒子數目不會因此增加。",
  3: "平台段表示供給的能量主要用於改變狀態，溫度保持不變。",
  4: "固體粒子只可在固定位置附近振動，不能作整體對流移動。",
  5: "定容時 p/T 保持不變，絕對溫度要用 kelvin。",
  6: "定容及定量下由 pV=nRT 可知壓力與絕對溫度成正比。",
  7: "位移是有方向的：向前 200 m 再向後 30 m，結果為 +170 m。",
  8: "由 s=½at²，s=½(1.5)(6²)=27 m。",
  9: "列車突然加速時，乘客身體傾向保持原來狀態，這是慣性。",
  10: "擺由 A 到 B 下降，重力勢能轉化為動能；繩張力不做功。",
  11: "碰撞後黏在一起，用總動量守恆，再除以兩車總質量。",
  12: "水流撞牆後反彈，動量改變更大；增加流量會增加平均力。",
  13: "沿斜面分解重力並用能量守恆，所得速度與位移 4 m 對應。",
  14: "衝量等於 F–t 圖下面積；方向取決於初末動量的改變。",
  15: "平面鏡影像左右反轉，實際時間與鏡中顯示時間相加為 12:00。",
  16: "一般物體的影像由反射、折射或繞射等光學過程形成，按題目組合判斷。",
  17: "光進入光疏介質時速度增加、頻率不變，並且偏離法線。",
  18: "平行光經凸透鏡後會聚；遠物的像在焦點附近並為實像。",
  19: "虛像的光線不能在像的位置真正會聚，因此不能用屏幕接收。",
  20: "行波向右傳播時，粒子 X 的瞬時運動方向由波形斜率判斷。",
  21: "由圖上的平衡位置、振幅和波長格數逐項讀取，不能把粒子位置當波形位置。",
  22: "兩個相反脈衝重疊時按疊加原理相加，重疊部分會相消。",
  23: "波通過較窄的缺口後頻率和週期不變；速度及波長由介質決定。",
  24: "楊氏雙縫暗紋間距使用相鄰暗紋級次差，代入 β=λD/a。",
  25: "微波是電磁波，可在真空傳播；錯誤選項是把其用途或性質混淆。",
  26: "響度主要與振幅相關，要比較波形的最大位移而不是週期。",
  27: "光和聲的傳播性質不同；聲音需要介質，不能套用同一組描述。",
};

function quickMcReason(yearId: string, question: number, answer: string) {
  if (yearId === "2425") return QUICK_MC_REASONS_2425[question] ?? `答案為 ${answer}；請按題目給出的物理條件逐項排除其他選項。`;
  return `核對答案：${answer}。先圈出題目中的已知量和關鍵概念，再用相關公式或定律逐項排除其他選項；詳細公式可在主題頁及公式庫複習。`;
}

type AnswerPart = { label: string; answer: string; answerZh: string };
function answerParts(solution: ReaderSolution): AnswerPart[] {
  const split = (text: string) => {
    const markers = Array.from(text.matchAll(/(?:\([a-z]\)\([ivx]+\)|\([a-z]\))\s/gi));
    if (markers.length === 0) return [text.trim()].filter(Boolean);
    return markers.map((marker, index) => text.slice(marker.index ?? 0, markers[index + 1]?.index ?? text.length).trim()).filter(Boolean);
  };
  const answers = split(solution.answer);
  const answersZh = split(solution.answerZh);
  if (answers.length <= 1) return [{ label: "整題答案", answer: solution.answer, answerZh: solution.answerZh }];
  return answers.map((answer, index) => ({
    label: answer.match(/^\([a-z]\)(?:\([ivx]+\))?/i)?.[0] ?? `小問 ${index + 1}`,
    answer: answer.replace(/^\([a-z]\)(?:\([ivx]+\))?\s*/i, ""),
    answerZh: (answersZh[index] ?? solution.answerZh).replace(/^\([a-z]\)(?:\([ivx]+\))?\s*/i, ""),
  }));
}

function AnswerBelow({ solution, visible, referenceOnly }: { solution: ReaderSolution; visible: boolean; referenceOnly: boolean }) {
  const [open, setOpen] = useState(visible);
  useEffect(() => setOpen(visible), [visible]);
  const parts = useMemo(() => answerParts(solution), [solution]);
  return <section className="reader-answer reader-sq-answer" id={`answer-q${solution.question}`} data-question={solution.question}>
    <button className="reader-answer-heading" onClick={() => setOpen(v => !v)} aria-expanded={open}>
      <div><span className="reader-answer-label">SQ Q{solution.question} · 答案與講解</span><h3>{solution.titleZh}</h3></div>
      <ChevronDown size={18} className={open ? "rotate-180" : ""} />
    </button>
    {open && <div className="reader-answer-content">
      <div className="reader-source-note">{referenceOnly ? "自行解題的參考答案 · 非學校官方答案" : "對照學校答案的溫習解說 · 中文解釋由網站補充"}</div>
      <div className="reader-sq-part-grid" aria-label={`SQ Q${solution.question} 各小問答案`}>
        {parts.map((part, index) => <article className="reader-sq-part" key={`${part.label}-${index}`}>
          <span className="reader-sq-part-label">{part.label}</span>
          <h4>Answer · 答案</h4><p className="reader-preserve-lines">{part.answer}</p>
          <h4>中文答案／概念翻譯</h4><p className="reader-preserve-lines">{part.answerZh}</p>
        </article>)}
      </div>
      <div className="reader-sq-explanation"><h4>為甚麼這樣做？</h4><p className="reader-preserve-lines">{solution.explanationZh}</p><details className="reader-english"><summary>English reasoning · 英文作答思路</summary><p className="mt-2 reader-preserve-lines">{solution.explanation}</p></details></div>
      <div><h4>用甚麼公式？</h4><div className="reader-formulas">{solution.formulas.map((formula, i) => <code key={i}>{formula}</code>)}</div></div>
      {solution.steps && solution.steps.length > 0 && <div><h4>一步一步講解</h4><ol className="reader-steps">{solution.steps.map((step, i) => <li key={i}><span>{i + 1}</span><div><h5>{step.label}</h5><p className="reader-preserve-lines">{step.zh}</p><details className="reader-english"><summary>English</summary><p className="mt-2">{step.en}</p></details></div></li>)}</ol></div>}
      {solution.sourceNotes && <p className="reader-source-note">{solution.sourceNotes}</p>}
    </div>}
  </section>;
}

function McAnswer({ yearId, question, answer }: { yearId: string; question: number; answer: string }) {
  return <article className="reader-mc-answer-card">
    <div className="reader-mc-answer-top"><span>MC Q{question}</span><strong>{answer}</strong></div>
    <details><summary>少量講解 · 為甚麼？</summary><p>{quickMcReason(yearId, question, answer)}</p></details>
  </article>;
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
  return <div className={`app-shell exam-reader ${year.id === "2324" ? "reader-portrait" : ""} reader-single-sheet`}>
    <nav className="glass-nav reader-nav"><Link href="/papers" className="reader-back"><ArrowLeft size={17} /> <span>歷屆試卷</span></Link><span className="reader-nav-title">{year.year} · {section.toUpperCase()}</span><AppearanceControls compact /></nav>
    <header className="reader-header"><div className="reader-header-inner"><p className="eyebrow">ORIGINAL PAPER → ANSWER · 原卷 → 隨題解說</p><h1>{year.year} <span>{section === "mc" ? "MC 選擇題" : "SQ 長答題"}</span></h1><p>{section === "mc" ? "每題答案各自列出，按需要展開一行簡短理由。" : "每個小問分開顯示答案、中文解釋、公式及步驟。"} 原卷一頁一頁直向顯示。</p><div className="reader-section-tabs" aria-label="選擇試卷類型"><Link href={`/papers/${year.id}/mc`} className={section === "mc" ? "active" : ""}>MC 選擇題</Link><Link href={`/papers/${year.id}/sq`} className={section === "sq" ? "active" : ""}>SQ 長答題</Link><a href={sourceUrl} target="_blank" rel="noopener noreferrer">開啟原 PDF <ExternalLink size={13} /></a>{year.markingScheme && <a href={year.markingScheme} target="_blank" rel="noopener noreferrer">學校答案 PDF <ExternalLink size={13} /></a>}</div><p className="reader-disclaimer">{year.referenceOnly ? "2024–25：未附學校答案；以下為自行解題的參考答案，不代表學校評分標準。" : "計算與概念答案對照所附學校答案；中文翻譯及推理說明為溫習用。"}</p><p className="reader-disclaimer">原卷已移除附件中的舊藍色手寫標註。Apple Pencil 工具支援紅／黑／藍筆、筆劃橡皮擦、螢光筆、尺、粗細和壓力感應；標註只存於你目前的瀏覽器，不會上傳。重新載入後仍會保留，按「清除此頁」才會刪除。Apple Pencil 雙擊可循環切換工具。</p></div></header>
    <div className="reader-toolbar"><div><label htmlFor="reader-question">跳至題目</label><select id="reader-question" value={selectedQuestion} onChange={e => jumpTo(Number(e.target.value))} disabled={!pdf}>{Array.from({ length: questionCount }, (_, i) => <option key={i} value={i + 1}>{section.toUpperCase()} Q{i + 1}</option>)}</select></div><button onClick={() => setShowAnswers(v => !v)}>{showAnswers ? <EyeOff size={16} /> : <Eye size={16} />}{showAnswers ? "收起答案" : "顯示答案"}</button><span className="reader-toolbar-note">向下閱讀：原題 → 對應答案 → 下一頁</span></div>
    <main className="reader-main">
      {!pdf && !error && <div className="reader-loading" role="status"><Loader2 size={24} className="animate-spin" /><p>正在載入原版 PDF…</p>{year.id === "2425" && <p>2024–25 掃描卷較大，首次載入可能需要數秒。</p>}</div>}
      {error && <div className="reader-error" role="alert"><FileText size={24} /><p>{error}</p><button onClick={() => setRetry(v => v + 1)}>重新載入</button><a href={sourceUrl} target="_blank" rel="noopener noreferrer">開啟原 PDF</a></div>}
      {pdf && year.pages[section].map(page => <article className="reader-source-block" id={`source-page-${page.page}`} key={`${sourceUrl}-${page.page}`} data-source-page={page.page}>
        <div className="reader-page-heading"><span>原版 PDF · 第 {page.page} 頁</span><strong>{page.label ?? `${section.toUpperCase()} ${page.questions.map(q => `Q${q}`).join("、")}`}</strong></div>
        <AnnotatablePaper pageLabel={`${year.year} ${section.toUpperCase()} 原卷第 ${page.page} 頁`}><OriginalPdfPage pdf={pdf} pageNumber={page.page} accessibleLabel={`${year.year} ${section.toUpperCase()} 原卷第 ${page.page} 頁`} /></AnnotatablePaper>
        {page.questions.length === 0 && <p className="reader-continuation">本題尚有續頁；請向下閱讀，答案會放在完整題目最後一張原卷頁面之下。</p>}
        <div className="reader-under-pdf" data-answer-for-page={page.page}>
          {section === "mc" && <section className="reader-mc-answer"><div className="reader-mc-grid">{page.questions.map(q => <McAnswer key={q} yearId={year.id} question={q} answer={year.mcAnswers[q - 1] ?? "待核對"} />)}</div><p className="reader-mc-source">{year.referenceOnly ? "自行解題的參考答案 · 非學校官方答案" : "答案來源：附件中的學校評分標準"}</p></section>}
          {section === "sq" && page.questions.map(q => { const solution = getReaderSolution(year, q); return solution ? <AnswerBelow solution={solution} visible={showAnswers} referenceOnly={year.referenceOnly} key={`${year.id}-${q}`} /> : <p className="reader-error" key={q}>SQ Q{q} 答案尚未載入。</p>; })}
        </div>
      </article>)}
      <div className="reader-bottom-links"><Link href="/papers">返回年份選單</Link><Link href={`/papers/${year.id}/${section === "mc" ? "sq" : "mc"}`}>轉到 {section === "mc" ? "SQ 長答題" : "MC 選擇題"}</Link><a href="/formula-library" target="_blank" rel="noopener noreferrer">完整公式庫 <ExternalLink size={13} /></a></div>
    </main>
  </div>;
}
