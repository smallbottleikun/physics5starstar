/* ============================================================
   PracticeQuestion Component — DSE Physics Revision
   Displays a DSE-style exam question with:
   - Scenario description (EN + ZH)
   - Per-part input textareas
   - "Check Answer" button per part
   - Full model answer reveal with mark scheme
   ============================================================ */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PracticeQuestion as PQ } from "../practice-questions";

interface Props {
  question: PQ;
  accentColor: string;
  dotColor: string;
  showZh: boolean;
}

export default function PracticeQuestion({ question, accentColor, dotColor, showZh }: Props) {
  const [answers, setAnswers] = useState<string[]>(
    question.parts.map(() => "")
  );
  const [revealed, setRevealed] = useState<boolean[]>(
    question.parts.map(() => false)
  );
  const [allRevealed, setAllRevealed] = useState(false);

  const revealPart = (i: number) => {
    const next = [...revealed];
    next[i] = true;
    setRevealed(next);
  };

  const revealAll = () => {
    setRevealed(question.parts.map(() => true));
    setAllRevealed(true);
  };

  const resetAll = () => {
    setAnswers(question.parts.map(() => ""));
    setRevealed(question.parts.map(() => false));
    setAllRevealed(false);
  };

  return (
    <div
      className="themed-practice-question rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${dotColor}25`,
        background: "rgba(255,255,255,0.018)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-5 py-4 flex items-start justify-between gap-4"
        style={{
          background: `linear-gradient(135deg, ${dotColor}12, transparent)`,
          borderBottom: `1px solid ${dotColor}18`,
        }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-md"
              style={{ background: `${dotColor}20`, color: dotColor, border: `1px solid ${dotColor}35` }}
            >
              📝 {question.isOriginal ? "Original DSE-style" : "DSE Practice"}
            </span>
            <span className="text-xs font-medium" style={{ color: "rgba(230,237,243,0.45)" }}>
              {question.year}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(230,237,243,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {question.totalMarks} marks 分
            </span>
            {question.difficulty && (
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(230,237,243,0.42)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {question.difficulty}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(230,237,243,0.8)" }}>
            {question.scenario}
          </p>
          {showZh && (
            <p
              className="text-xs mt-1.5 leading-relaxed"
              style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}
            >
              {question.scenarioZh}
            </p>
          )}
          {question.diagram && (
            <div
              className="mt-3 rounded-lg px-3 py-2.5 text-xs leading-relaxed"
              style={{ background: "rgba(255,255,255,0.035)", border: "1px dashed rgba(255,255,255,0.13)", color: "rgba(230,237,243,0.55)", fontFamily: "JetBrains Mono, monospace" }}
            >
              <span style={{ color: dotColor, fontWeight: 700 }}>Diagram cue · 圖像提示: </span>
              {question.diagram}
            </div>
          )}
          {question.tags && question.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {question.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[0.68rem] px-2 py-0.5 rounded-full"
                  style={{ background: `${dotColor}0d`, border: `1px solid ${dotColor}20`, color: "rgba(230,237,243,0.48)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Parts ── */}
      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {question.parts.map((part, i) => (
          <div key={i} className="px-5 py-5">
            {/* Part label + question */}
            <div className="flex items-start gap-3 mb-3">
              <span
                className="shrink-0 text-sm font-bold px-2 py-0.5 rounded-md mt-0.5"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  background: `${dotColor}15`,
                  color: dotColor,
                  border: `1px solid ${dotColor}28`,
                }}
              >
                {part.label}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "rgba(230,237,243,0.9)" }}>
                  {part.question}
                  <span className="ml-2 text-xs" style={{ color: "rgba(230,237,243,0.35)" }}>
                    [{part.marks} mark{part.marks > 1 ? "s" : ""}]
                  </span>
                </p>
                {showZh && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(230,237,243,0.38)", fontFamily: "Noto Sans TC, sans-serif" }}
                  >
                    {part.questionZh}
                  </p>
                )}
              </div>
            </div>

            {/* Answer textarea */}
            <div className="ml-10">
              <textarea
                value={answers[i]}
                onChange={e => {
                  const next = [...answers];
                  next[i] = e.target.value;
                  setAnswers(next);
                }}
                placeholder="Write your answer here… 在此輸入你的答案…"
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm resize-y transition-all duration-200 outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${revealed[i] ? dotColor + "40" : "rgba(255,255,255,0.1)"}`,
                  color: "rgba(230,237,243,0.85)",
                  fontFamily: "DM Sans, sans-serif",
                  caretColor: dotColor,
                  minHeight: "80px",
                }}
                onFocus={e => {
                  e.currentTarget.style.border = `1px solid ${dotColor}60`;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${dotColor}12`;
                }}
                onBlur={e => {
                  e.currentTarget.style.border = `1px solid ${revealed[i] ? dotColor + "40" : "rgba(255,255,255,0.1)"}`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              {/* Check Answer button */}
              {!revealed[i] && (
                <button
                  onClick={() => revealPart(i)}
                  className="mt-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    background: `${dotColor}18`,
                    color: dotColor,
                    border: `1px solid ${dotColor}35`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${dotColor}28`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${dotColor}18`;
                  }}
                >
                  Check Answer 查看答案 →
                </button>
              )}

              {/* Model answer reveal */}
              <AnimatePresence>
                {revealed[i] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="mt-3 overflow-hidden"
                  >
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: `${dotColor}0c`,
                        border: `1px solid ${dotColor}30`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold" style={{ color: dotColor }}>
                          ✓ Model Answer
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}
                        >
                          參考答案
                        </span>
                        <span
                          className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${dotColor}20`, color: dotColor }}
                        >
                          {part.marks} mark{part.marks > 1 ? "s" : ""}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed whitespace-pre-line"
                        style={{ color: "rgba(230,237,243,0.85)" }}
                      >
                        {part.answer}
                      </p>
                      {showZh && (
                        <p
                          className="text-xs mt-2 leading-relaxed whitespace-pre-line"
                          style={{
                            color: "rgba(230,237,243,0.45)",
                            fontFamily: "Noto Sans TC, sans-serif",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            paddingTop: "8px",
                            marginTop: "8px",
                          }}
                        >
                          {part.answerZh}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer actions ── */}
      <div
        className="px-5 py-4 flex items-center justify-between gap-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
      >
        <div className="flex items-center gap-2">
          {/* Progress dots */}
          {question.parts.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: revealed[i] ? dotColor : "rgba(255,255,255,0.15)",
                boxShadow: revealed[i] ? `0 0 6px ${dotColor}80` : "none",
              }}
            />
          ))}
          <span className="text-xs ml-1" style={{ color: "rgba(230,237,243,0.3)" }}>
            {revealed.filter(Boolean).length}/{question.parts.length} answered
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetAll}
            className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "rgba(230,237,243,0.45)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            ↺ Reset 重置
          </button>
          {!allRevealed && (
            <button
              onClick={revealAll}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: `${dotColor}20`,
                color: dotColor,
                border: `1px solid ${dotColor}40`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${dotColor}30`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${dotColor}20`; }}
            >
              Show All Answers 顯示所有答案
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
