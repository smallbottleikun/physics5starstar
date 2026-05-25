/* ============================================================
   Home Page — DSE Physics Revision
   Dark Physics Lab theme: hero banner + topic grid
   Color-coded categories: Optics=cyan, Mechanics=orange, Heat=red, Waves=purple
   ============================================================ */

import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { topics, categories } from "../physics-content";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663270507857/cjmJTL5QBoCEQwdsHw8PpA/hero-bg-hirUNhwm7AF9DZhG8mR8zt.webp";

const TOPIC_IMAGES: Record<string, string> = {
  Optics: "https://d2xsxph8kpxj0f.cloudfront.net/310519663270507857/cjmJTL5QBoCEQwdsHw8PpA/optics-card-dvva7LeJKgQ2hYXd5G3JjN.webp",
  Mechanics: "https://d2xsxph8kpxj0f.cloudfront.net/310519663270507857/cjmJTL5QBoCEQwdsHw8PpA/mechanics-card-4wSCajJCmTqVtSyUUaNwDk.webp",
  Heat: "https://d2xsxph8kpxj0f.cloudfront.net/310519663270507857/cjmJTL5QBoCEQwdsHw8PpA/heat-card-JCLBiLDC5gH7BfJ2qXR2zA.webp",
  Waves: "https://d2xsxph8kpxj0f.cloudfront.net/310519663270507857/cjmJTL5QBoCEQwdsHw8PpA/waves-card-h2FjX9svi3JgqHnHaYZ5fP.webp",
};

const COLOR_MAP: Record<string, { border: string; text: string; bg: string; badge: string; dot: string }> = {
  cyan:   { border: "border-[#00d4ff]/30", text: "text-[#00d4ff]",   bg: "bg-[#00d4ff]/10",   badge: "bg-[#00d4ff]/15 text-[#00d4ff]",   dot: "#00d4ff" },
  orange: { border: "border-[#f97316]/30", text: "text-[#f97316]",   bg: "bg-[#f97316]/10",   badge: "bg-[#f97316]/15 text-[#f97316]",   dot: "#f97316" },
  red:    { border: "border-[#ef4444]/30", text: "text-[#ef4444]",   bg: "bg-[#ef4444]/10",   badge: "bg-[#ef4444]/15 text-[#ef4444]",   dot: "#ef4444" },
  purple: { border: "border-[#a855f7]/30", text: "text-[#a855f7]",   bg: "bg-[#a855f7]/10",   badge: "bg-[#a855f7]/15 text-[#a855f7]",   dot: "#a855f7" },
};

const FILTER_COLORS: Record<string, string> = {
  all:       "bg-white/10 text-white border-white/20 hover:bg-white/20",
  Optics:    "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30 hover:bg-[#00d4ff]/20",
  Mechanics: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30 hover:bg-[#f97316]/20",
  Heat:      "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30 hover:bg-[#ef4444]/20",
  Waves:     "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 hover:bg-[#a855f7]/20",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [, navigate] = useLocation();

  const filtered = activeCategory === "all"
    ? topics
    : topics.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen" style={{ background: "#0d1117" }}>
      {/* ── Navigation Bar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(13,17,23,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}>
            ⚛
          </div>
          <div>
            <span className="font-bold text-white text-sm" style={{ fontFamily: "Syne, sans-serif" }}>DSE Physics</span>
            <span className="text-xs ml-2" style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}>物理溫習</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {categories.slice(1).map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 ${FILTER_COLORS[cat.id]}`}
            >
              {cat.label}
              <span className="ml-1.5 opacity-60" style={{ fontFamily: "Noto Sans TC, sans-serif", fontSize: "0.7rem" }}>{cat.labelZh}</span>
            </button>
          ))}
        </div>
        <div className="text-xs" style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}>
          {topics.length} Topics 個主題
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden" style={{ paddingTop: "72px", minHeight: "520px" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "brightness(0.35)",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,17,23,0.3) 0%, rgba(13,17,23,0.7) 70%, #0d1117 100%)" }} />

        <div className="relative container mx-auto px-6 py-20 flex flex-col items-start max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6" style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4ff" }} />
              HKDSE Physics Revision Guide &nbsp;·&nbsp; <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>物理考前溫習</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>
              Physics<br />
              <span style={{ color: "#00d4ff" }}>Revision</span>
            </h1>
            <p className="text-lg mb-2" style={{ color: "rgba(230,237,243,0.7)", maxWidth: "520px", fontFamily: "DM Sans, sans-serif" }}>
              Master DSE Physics with bilingual notes, key formulas, and exam tips.
            </p>
            <p className="text-sm" style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}>
              中英對照筆記，涵蓋光學、力學、熱學、波動等核心主題
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-wrap gap-6 mt-10"
          >
            {[
              { num: topics.length, label: "Topics", zh: "主題" },
              { num: topics.reduce((a, t) => a + t.formulas.length, 0), label: "Formulas", zh: "公式" },
              { num: topics.reduce((a, t) => a + t.keyPoints.length, 0), label: "Key Points", zh: "重點" },
              { num: 4, label: "Categories", zh: "類別" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>{stat.num}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(230,237,243,0.5)" }}>{stat.label} <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>{stat.zh}</span></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="sticky top-[72px] z-40 py-4" style={{ background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container mx-auto px-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs mr-2" style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}>篩選：</span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                activeCategory === cat.id
                  ? FILTER_COLORS[cat.id] + " opacity-100 scale-105"
                  : "bg-transparent border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
              }`}
            >
              {cat.label}
              <span className="ml-1.5" style={{ fontFamily: "Noto Sans TC, sans-serif", opacity: 0.7 }}>{cat.labelZh}</span>
            </button>
          ))}
          <span className="ml-auto text-xs" style={{ color: "rgba(230,237,243,0.3)" }}>
            {filtered.length} topic{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* ── Topic Grid ── */}
      <section className="container mx-auto px-6 py-10 max-w-7xl">
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map(topic => {
            const c = COLOR_MAP[topic.color] || COLOR_MAP.cyan;
            return (
              <motion.div
                key={topic.id}
                variants={cardVariants}
                onClick={() => navigate(`/topic/${topic.id}`)}
                className={`topic-card group relative overflow-hidden border ${c.border}`}
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                {/* Category image strip */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={TOPIC_IMAGES[topic.category]}
                    alt={topic.category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: "brightness(0.55)" }}
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(13,17,23,0.95) 100%)` }} />
                  {/* Category badge */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold ${c.badge}`} style={{ backdropFilter: "blur(8px)" }}>
                    {topic.category}
                    <span className="ml-1.5 opacity-70" style={{ fontFamily: "Noto Sans TC, sans-serif" }}>{topic.categoryZh}</span>
                  </div>
                  {/* Icon */}
                  <div className="absolute top-3 right-3 text-2xl">{topic.icon}</div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1 leading-snug" style={{ fontFamily: "Syne, sans-serif" }}>
                    {topic.title}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}>
                    {topic.titleZh}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(230,237,243,0.6)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {topic.summary}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs" style={{ color: "rgba(230,237,243,0.35)" }}>
                      <span>{topic.formulas.length} formula{topic.formulas.length !== 1 ? "s" : ""}</span>
                      <span>·</span>
                      <span>{topic.keyPoints.length} key points</span>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${c.text} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                      Study <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>溫習</span> →
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to right, transparent, ${c.dot}, transparent)` }} />
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-16 py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs" style={{ color: "rgba(230,237,243,0.25)", fontFamily: "Noto Sans TC, sans-serif" }}>
            DSE Physics Revision · 物理考前溫習 · Good luck in your exam! 考試加油！
          </p>
        </div>
      </footer>
    </div>
  );
}
