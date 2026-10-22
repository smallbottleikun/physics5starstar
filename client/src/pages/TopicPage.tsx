/* ============================================================
   Topic Detail Page — DSE Physics Revision
   Dark Physics Lab theme: full topic content with formulas,
   key points, Chinese annotations, and exam tips
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { topics } from "../physics-content";
import PracticeQuestionBlock from "../components/PracticeQuestion";
import { practiceQuestions } from "../practice-questions";
import AppearanceControls from "../components/AppearanceControls";

const COLOR_MAP: Record<string, {
  border: string; text: string; bg: string; badge: string;
  dot: string; glow: string; gradFrom: string;
}> = {
  cyan:   { border: "border-[#00d4ff]/25", text: "text-[#00d4ff]",   bg: "bg-[#00d4ff]/8",   badge: "bg-[#00d4ff]/15 text-[#00d4ff]",   dot: "#00d4ff", glow: "rgba(0,212,255,0.25)",   gradFrom: "rgba(0,212,255,0.08)" },
  orange: { border: "border-[#f97316]/25", text: "text-[#f97316]",   bg: "bg-[#f97316]/8",   badge: "bg-[#f97316]/15 text-[#f97316]",   dot: "#f97316", glow: "rgba(249,115,22,0.25)",  gradFrom: "rgba(249,115,22,0.08)" },
  red:    { border: "border-[#ef4444]/25", text: "text-[#ef4444]",   bg: "bg-[#ef4444]/8",   badge: "bg-[#ef4444]/15 text-[#ef4444]",   dot: "#ef4444", glow: "rgba(239,68,68,0.25)",   gradFrom: "rgba(239,68,68,0.08)" },
  purple: { border: "border-[#a855f7]/25", text: "text-[#a855f7]",   bg: "bg-[#a855f7]/8",   badge: "bg-[#a855f7]/15 text-[#a855f7]",   dot: "#a855f7", glow: "rgba(168,85,247,0.25)",  gradFrom: "rgba(168,85,247,0.08)" },
};

const OFFICIAL_FORMULA_SHEET_URL = "https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/phy/Phy-Formulae-e.pdf";

// Render LaTeX using KaTeX (loaded via CDN in index.html)
function FormulaDisplay({ latex }: { latex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current && (window as any).katex) {
      try {
        (window as any).katex.render(latex, ref.current, { displayMode: true, throwOnError: false });
      } catch {
        if (ref.current) ref.current.textContent = latex;
      }
    } else if (ref.current) {
      ref.current.textContent = latex;
    }
  }, [latex]);
  return <span ref={ref} className="katex-display-wrapper" />;
}

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const topic = topics.find(t => t.id === id);
  const [expandedFormula, setExpandedFormula] = useState<number | null>(null);
  const [showZh, setShowZh] = useState(true);

  if (!topic) {
    return (
      <div className="app-shell min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔭</div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Topic Not Found</h2>
          <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 rounded-lg text-sm font-medium" style={{ background: "rgba(0,212,255,0.15)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)" }}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const c = COLOR_MAP[topic.color] || COLOR_MAP.cyan;
  const topicIndex = topics.findIndex(t => t.id === id);
  const prevTopic = topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic = topicIndex < topics.length - 1 ? topics[topicIndex + 1] : null;
  const topicQuestions = practiceQuestions.filter(question => question.topicId === topic.id);

  return (
    <div className="app-shell themed-topic-page min-h-screen">
      {/* ── Top Navigation ── */}
      <nav
        className="glass-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 whitespace-nowrap text-sm transition-colors duration-200"
          style={{ color: "rgba(230,237,243,0.5)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(230,237,243,0.9)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(230,237,243,0.5)")}
        >
          ← <span className="topic-back-en">All Topics</span>
          <span className="topic-back-zh" style={{ fontFamily: "Noto Sans TC, sans-serif", fontSize: "0.75rem" }}>所有主題</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="topic-appearance"><AppearanceControls compact /></div>
          <a href={OFFICIAL_FORMULA_SHEET_URL} target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center gap-1 text-xs hover:opacity-70 transition-opacity" style={{ color: "var(--color-cyan)" }}>
            官方公式表 <ExternalLink size={12} />
          </a>
          {/* Chinese toggle */}
          <button
            onClick={() => setShowZh(!showZh)}
            className="flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: showZh ? "rgba(255,255,255,0.08)" : "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: showZh ? "rgba(230,237,243,0.9)" : "rgba(230,237,243,0.4)",
            }}
          >
            <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>中文注釋</span>
            <span className="opacity-60">{showZh ? "ON" : "OFF"}</span>
          </button>

          <div className={`topic-category-badge px-3 py-1.5 rounded-lg text-xs font-semibold ${c.badge}`}>
            {topic.category} · {topic.categoryZh}
          </div>
        </div>
      </nav>

      {/* ── Hero Header ── */}
      <div className="pt-20 pb-10 px-6" style={{ background: `linear-gradient(135deg, ${c.gradFrom} 0%, transparent 60%)` }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{topic.icon}</span>
              <div className={`w-12 h-0.5`} style={{ background: `linear-gradient(to right, ${c.dot}, transparent)` }} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
              {topic.title}
            </h1>
            <p className="text-xl mb-6" style={{ color: c.dot, fontFamily: "Noto Sans TC, sans-serif", fontWeight: 300 }}>
              {topic.titleZh}
            </p>
            <p className="text-base leading-relaxed mb-2" style={{ color: "rgba(230,237,243,0.75)", maxWidth: "680px" }}>
              {topic.summary}
            </p>
            <AnimatePresence>
              {showZh && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm leading-relaxed zh-note"
                  style={{ maxWidth: "680px" }}
                >
                  {topic.summaryZh}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-10">

        {/* ── Formulas Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Key Formulas</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>{topic.formulas.length}</span>
            <span className="text-sm" style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}>重要公式</span>
          </div>

          <div className="space-y-3">
            {topic.formulas.map((formula, i) => (
              <motion.div
                key={i}
                className={`formula-box border ${c.border} cursor-pointer`}
                onClick={() => setExpandedFormula(expandedFormula === i ? null : i)}
                whileHover={{ scale: 1.005 }}
                style={{ boxShadow: expandedFormula === i ? `0 0 20px ${c.glow}` : "none" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 overflow-x-auto py-1">
                    <FormulaDisplay latex={formula.latex} />
                  </div>
                  <div className={`text-xs mt-1 transition-transform duration-200 ${c.text} shrink-0`} style={{ transform: expandedFormula === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                    ▼
                  </div>
                </div>

                <AnimatePresence>
                  {expandedFormula === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <p className="text-sm" style={{ color: "rgba(230,237,243,0.75)" }}>{formula.description}</p>
                      {showZh && (
                        <p className="zh-note mt-1">{formula.descriptionZh}</p>
                      )}
                      {/* Symbol reference table */}
                      {formula.symbols && formula.symbols.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(230,237,243,0.3)", letterSpacing: "0.08em" }}>
                            Symbol Reference &nbsp;·&nbsp; <span style={{ fontFamily: "Noto Sans TC, sans-serif", textTransform: "none" }}>符號說明</span>
                          </p>
                          <div className="space-y-1.5">
                            {formula.symbols.map((sym, si) => (
                              <div key={si} className="flex items-start gap-3 p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                                <div
                                  className="shrink-0 min-w-[2.2rem] text-center px-2 py-0.5 rounded-md text-xs font-bold"
                                  style={{ fontFamily: "JetBrains Mono, monospace", background: `${c.dot}18`, border: `1px solid ${c.dot}30`, color: c.dot }}
                                >
                                  {sym.symbol}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs" style={{ color: "rgba(230,237,243,0.8)" }}>{sym.meaning}</p>
                                  {showZh && (
                                    <p className="text-xs mt-0.5" style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}>{sym.meaningZh}</p>
                                  )}
                                </div>
                                <div
                                  className="shrink-0 text-xs px-1.5 py-0.5 rounded"
                                  style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(255,255,255,0.05)", color: "rgba(230,237,243,0.4)", border: "1px solid rgba(255,255,255,0.07)", whiteSpace: "nowrap" }}
                                >
                                  {sym.unit}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Key Points Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Key Points</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>{topic.keyPoints.length}</span>
            <span className="text-sm" style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}>重要概念</span>
          </div>

          <div className="space-y-3">
            {topic.keyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i, ease: [0.23, 1, 0.32, 1] }}
                className={`p-4 rounded-xl border ${c.border}`}
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <div className="flex gap-3">
                  <div className="mt-1 shrink-0">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: c.gradFrom, border: `1px solid ${c.dot}40`, color: c.dot }}>
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(230,237,243,0.85)" }}>{point.en}</p>
                    <AnimatePresence>
                      {showZh && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="zh-note mt-1.5"
                        >
                          {point.zh}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Exam Tips Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Exam Tips</h2>
            <span className="text-sm" style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}>考試貼士</span>
          </div>

          <div className="rounded-2xl p-1" style={{ background: `linear-gradient(135deg, ${c.dot}20, transparent)`, border: `1px solid ${c.dot}25` }}>
            <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(13,17,23,0.7)" }}>
              {topic.examTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-lg shrink-0">⚡</span>
                  <div>
                    <p className="text-sm leading-relaxed font-medium" style={{ color: "rgba(230,237,243,0.9)" }}>{tip.en}</p>
                    <AnimatePresence>
                      {showZh && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="zh-note mt-1"
                        >
                          {tip.zh}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── Practice Questions Section ── */}
        {topicQuestions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Practice Questions</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>{topicQuestions.length}</span>
              <span className="text-sm" style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}>練習題</span>
            </div>
            <div className="space-y-5">
              {topicQuestions.map((question, questionIndex) => (
                <PracticeQuestionBlock
                  key={question.id ?? `${question.topicId}-${questionIndex}`}
                  question={question}
                  accentColor={c.text}
                  dotColor={c.dot}
                  showZh={showZh}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Navigation between topics ── */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {prevTopic ? (
            <button
              onClick={() => navigate(`/topic/${prevTopic.id}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(230,237,243,0.6)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            >
              ← <span>{prevTopic.title}</span>
            </button>
          ) : <div />}

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2.5 rounded-xl text-xs transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(230,237,243,0.4)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          >
            All Topics 所有主題
          </button>

          {nextTopic ? (
            <button
              onClick={() => navigate(`/topic/${nextTopic.id}`)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(230,237,243,0.6)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            >
              <span>{nextTopic.title}</span> →
            </button>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
