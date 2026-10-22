/* ============================================================
   Home Page — DSE Physics Revision
   Focus Desk: a quiet, content-first revision workspace
   ============================================================ */

import { useState } from "react";
import { ArrowRight, Atom, BookOpen, ChevronRight, ExternalLink, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import AppearanceControls from "../components/AppearanceControls";
import FormulaSheet from "../components/FormulaSheet";
import { categories, topics } from "../physics-content";

const TOPIC_IMAGES: Record<string, string> = {
  Optics: "/manus-storage/optics-card-user_11e7935b.png",
  Mechanics: "/manus-storage/mechanics-card-user_6b1652a1.png",
  Heat: "/manus-storage/heat-card-user_3765ed0f.png",
  Waves: "/manus-storage/waves-card-user_da054b96.png",
};

const COLOR_MAP: Record<string, { accent: string; }> = {
  cyan: { accent: "var(--color-cyan)" },
  orange: { accent: "var(--color-orange)" },
  red: { accent: "var(--color-red)" },
  purple: { accent: "var(--color-purple)" },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
};

const OFFICIAL_FORMULA_SHEET_URL = "https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/phy/Phy-Formulae-e.pdf";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [, navigate] = useLocation();

  const filtered = activeCategory === "all"
    ? topics
    : topics.filter(topic => topic.category === activeCategory);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app-shell">
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            onClick={() => jumpTo("topic-grid")}
            className="flex items-center gap-2.5 shrink-0 text-left"
            aria-label="Go to topics"
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--color-cyan) 13%, transparent)", color: "var(--color-cyan)", border: "1px solid color-mix(in srgb, var(--color-cyan) 24%, var(--border-subtle))" }}>
              <Atom size={16} strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold" style={{ color: "var(--text-primary)", fontFamily: "Syne, sans-serif" }}>DSE Physics</span>
              <span className="block text-[0.65rem]" style={{ color: "var(--text-muted)", fontFamily: "Noto Sans TC, sans-serif" }}>物理溫習</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-5 text-xs" style={{ color: "var(--text-muted)" }}>
            <button onClick={() => jumpTo("topic-grid")} className="hover:opacity-70 transition-opacity">主題 Topics</button>
            <button onClick={() => jumpTo("formula-sheet")} className="hover:opacity-70 transition-opacity">公式表 Formula sheet</button>
            <a href={OFFICIAL_FORMULA_SHEET_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: "var(--color-cyan)" }}>
              官方公式表 <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>HKDSE</span> <ExternalLink size={12} />
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <AppearanceControls compact />
            <span className="hidden sm:inline text-xs whitespace-nowrap" style={{ color: "var(--text-muted)", fontFamily: "Noto Sans TC, sans-serif" }}>
              {topics.length} 個主題
            </span>
          </div>
        </div>
      </nav>

      <main>
        <section className="focus-hero pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-2xl"
            >
              <div className="eyebrow mb-4"><span className="eyebrow-dot" /> Revision desk · 考前溫習</div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                選擇一個主題開始溫習
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Bilingual notes, formulas and guided practice — keep the focus on the concept in front of you.
              </p>
              <p className="mt-1 text-xs sm:text-sm" style={{ color: "var(--text-muted)", fontFamily: "Noto Sans TC, sans-serif" }}>
                中英對照重點、公式符號說明及分步練習題。
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="inline-flex items-center gap-1.5"><BookOpen size={13} /> {topics.length} 個主題</span>
                <span className="inline-flex items-center gap-1.5"><FileText size={13} /> 按類別篩選</span>
                <button onClick={() => jumpTo("formula-sheet")} className="inline-flex items-center gap-1 text-left hover:opacity-70 transition-opacity" style={{ color: "var(--color-cyan)" }}>
                  查看公式表 <ArrowRight size={13} />
                </button>
                <a href={OFFICIAL_FORMULA_SHEET_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-left hover:opacity-70 transition-opacity" style={{ color: "var(--color-cyan)" }}>
                  官方 DSE 公式表 <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="sticky top-16 z-40 py-3 glass-nav" aria-label="Topic filters">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-2">
            <span className="hidden sm:inline text-xs mr-1" style={{ color: "var(--text-muted)", fontFamily: "Noto Sans TC, sans-serif" }}>篩選</span>
            {categories.map(category => {
              const color = category.id === "all" ? "var(--text-primary)" : (COLOR_MAP[category.color]?.accent ?? "var(--text-primary)");
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  aria-pressed={isActive}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150"
                  style={{
                    background: isActive ? "var(--surface)" : "transparent",
                    color: isActive ? color : "var(--text-muted)",
                    border: `1px solid ${isActive ? color : "var(--border-subtle)"}`,
                    boxShadow: isActive ? "0 1px 2px rgba(22, 34, 53, 0.08)" : "none",
                  }}
                >
                  <span>{category.label}</span>
                  <span style={{ fontFamily: "Noto Sans TC, sans-serif", opacity: 0.78 }}>{category.labelZh}</span>
                </button>
              );
            })}
            <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
              顯示 {filtered.length} / {topics.length}
            </span>
          </div>
        </section>

        <section id="topic-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-9 sm:py-11 scroll-mt-28">
          <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
            <div>
              <p className="eyebrow mb-2">Topics · 主題</p>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>選擇主題</h2>
            </div>
            <p className="hidden sm:block text-xs text-right max-w-48" style={{ color: "var(--text-muted)", fontFamily: "Noto Sans TC, sans-serif" }}>
              選取卡片以開啟筆記、公式與練習。
            </p>
          </div>

          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.045 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map(topic => {
              const color = COLOR_MAP[topic.color] ?? COLOR_MAP.cyan;
              return (
                <motion.button
                  key={topic.id}
                  variants={cardVariants}
                  onClick={() => navigate(`/topic/${topic.id}`)}
                  className="topic-card group text-left overflow-hidden relative"
                  style={{ borderTop: `3px solid ${color.accent}` }}
                >
                  <div className="relative h-20 sm:h-24 overflow-hidden" style={{ background: "var(--surface-muted)" }}>
                    <img src={TOPIC_IMAGES[topic.category]} alt="" className="topic-thumb w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--page-bg) 72%, transparent), transparent)" }} />
                    <div className="absolute inset-x-4 top-3 flex items-center justify-between gap-3">
                      <span className="px-2 py-1 rounded-md text-[0.65rem] font-semibold" style={{ background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)", color: color.accent, backdropFilter: "blur(8px)" }}>
                        {topic.category} <span className="opacity-70" style={{ fontFamily: "Noto Sans TC, sans-serif" }}>{topic.categoryZh}</span>
                      </span>
                      <span className="text-xl" aria-hidden="true">{topic.icon}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{topic.title}</h3>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-muted)", fontFamily: "Noto Sans TC, sans-serif" }}>{topic.titleZh}</p>
                    <p className="mt-3 text-sm leading-relaxed line-clamp-1" style={{ color: "var(--text-secondary)" }}>{topic.summary}</p>

                    <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{topic.formulas.length} formulas · {topic.keyPoints.length} key points</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: color.accent }}>
                        Study <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>溫習</span><ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        <FormulaSheet />
      </main>

      <footer className="py-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <p className="text-center text-xs" style={{ color: "var(--text-muted)", fontFamily: "Noto Sans TC, sans-serif" }}>
          DSE Physics Revision · 溫習時專注一個概念，逐步建立信心。
        </p>
      </footer>
    </div>
  );
}
