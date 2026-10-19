/* ============================================================
   FormulaSheet Component — DSE Physics Revision
   Displays ALL formulas with symbol-by-symbol explanations
   Grouped by topic category with color coding
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formulaSheet, type FormulaSheetEntry } from "../physics-content";

const COLOR_MAP: Record<string, { border: string; text: string; bg: string; badge: string; dot: string; glow: string }> = {
  cyan:   { border: "border-[#00d4ff]/20", text: "text-[#00d4ff]",   bg: "bg-[#00d4ff]/6",   badge: "bg-[#00d4ff]/15 text-[#00d4ff]",   dot: "#00d4ff", glow: "rgba(0,212,255,0.15)" },
  orange: { border: "border-[#f97316]/20", text: "text-[#f97316]",   bg: "bg-[#f97316]/6",   badge: "bg-[#f97316]/15 text-[#f97316]",   dot: "#f97316", glow: "rgba(249,115,22,0.15)" },
  red:    { border: "border-[#ef4444]/20", text: "text-[#ef4444]",   bg: "bg-[#ef4444]/6",   badge: "bg-[#ef4444]/15 text-[#ef4444]",   dot: "#ef4444", glow: "rgba(239,68,68,0.15)" },
  purple: { border: "border-[#a855f7]/20", text: "text-[#a855f7]",   bg: "bg-[#a855f7]/6",   badge: "bg-[#a855f7]/15 text-[#a855f7]",   dot: "#a855f7", glow: "rgba(168,85,247,0.15)" },
};

function FormulaRender({ latex }: { latex: string }) {
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
  return <span ref={ref} />;
}

function FormulaCard({ entry, index }: { entry: FormulaSheetEntry; index: number }) {
  const [open, setOpen] = useState(false);
  const c = COLOR_MAP[entry.color] || COLOR_MAP.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      className={`formula-sheet-card rounded-xl border ${c.border} overflow-hidden`}
      style={{ background: "rgba(255,255,255,0.025)" }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-start gap-4 transition-colors duration-200 hover:bg-white/5"
      >
        {/* Formula display */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${c.badge}`}>
              {entry.topic}
            </span>
            <span className="text-xs" style={{ color: "rgba(230,237,243,0.35)", fontFamily: "Noto Sans TC, sans-serif" }}>
              {entry.topicZh}
            </span>
          </div>
          <div className="text-sm font-semibold text-white mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
            {entry.name}
            <span className="ml-2 text-xs font-normal" style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}>
              {entry.nameZh}
            </span>
          </div>
          <div className="overflow-x-auto py-1">
            <FormulaRender latex={entry.latex} />
          </div>
        </div>

        {/* Expand icon */}
        <div
          className={`shrink-0 mt-1 text-xs transition-all duration-200 ${c.text}`}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </div>
      </button>

      {/* Symbol table */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs mt-3 mb-3 font-semibold uppercase tracking-wider" style={{ color: "rgba(230,237,243,0.35)", letterSpacing: "0.08em" }}>
                Symbol Reference &nbsp;·&nbsp; <span style={{ fontFamily: "Noto Sans TC, sans-serif", textTransform: "none" }}>符號說明</span>
              </p>
              <div className="space-y-2">
                {entry.symbols.map((sym, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    {/* Symbol pill */}
                    <div
                      className="shrink-0 min-w-[2.5rem] text-center px-2 py-1 rounded-md text-sm font-bold"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        background: `${c.dot}18`,
                        border: `1px solid ${c.dot}30`,
                        color: c.dot,
                      }}
                    >
                      {sym.symbol}
                    </div>
                    {/* Meaning */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: "rgba(230,237,243,0.85)" }}>{sym.meaning}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}>
                        {sym.meaningZh}
                      </p>
                    </div>
                    {/* Unit */}
                    <div
                      className="shrink-0 text-xs px-2 py-1 rounded-md"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(230,237,243,0.5)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {sym.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const CATEGORY_GROUPS = [
  { key: "cyan",   label: "Optics",     labelZh: "光學",   dot: "#00d4ff" },
  { key: "orange", label: "Mechanics",  labelZh: "力學",   dot: "#f97316" },
  { key: "red",    label: "Heat",       labelZh: "熱學",   dot: "#ef4444" },
  { key: "purple", label: "Waves",      labelZh: "波動",   dot: "#a855f7" },
];

export default function FormulaSheet() {
  const [activeGroup, setActiveGroup] = useState<string>("all");

  const filtered = activeGroup === "all"
    ? formulaSheet
    : formulaSheet.filter(e => e.color === activeGroup);

  return (
    <section id="formula-sheet" className="themed-formula-sheet py-16" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              📐
            </div>
            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Formula Reference Sheet
            </h2>
          </div>
          <p className="text-sm mb-1" style={{ color: "rgba(230,237,243,0.5)" }}>
            All DSE Physics formulas with complete symbol explanations. Click any formula to expand.
          </p>
          <p className="text-xs" style={{ color: "rgba(230,237,243,0.3)", fontFamily: "Noto Sans TC, sans-serif" }}>
            所有 DSE 物理公式及完整符號說明。點擊任何公式展開查看。
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveGroup("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              activeGroup === "all"
                ? "bg-white/10 text-white border-white/25"
                : "bg-transparent border-white/10 text-white/40 hover:border-white/25 hover:text-white/70"
            }`}
          >
            All Formulas <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>所有公式</span>
            <span className="ml-1.5 opacity-60">({formulaSheet.length})</span>
          </button>
          {CATEGORY_GROUPS.map(g => {
            const count = formulaSheet.filter(e => e.color === g.key).length;
            return (
              <button
                key={g.key}
                onClick={() => setActiveGroup(g.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200`}
                style={{
                  background: activeGroup === g.key ? `${g.dot}18` : "transparent",
                  borderColor: activeGroup === g.key ? `${g.dot}50` : "rgba(255,255,255,0.1)",
                  color: activeGroup === g.key ? g.dot : "rgba(230,237,243,0.4)",
                }}
              >
                {g.label} <span style={{ fontFamily: "Noto Sans TC, sans-serif" }}>{g.labelZh}</span>
                <span className="ml-1.5 opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Formula grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry, i) => (
            <FormulaCard key={`${entry.topic}-${i}`} entry={entry} index={i} />
          ))}
        </div>

        {/* Quick reference table */}
        <div className="mt-10 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-base font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
              Common Units Reference &nbsp;
              <span className="text-sm font-normal" style={{ color: "rgba(230,237,243,0.4)", fontFamily: "Noto Sans TC, sans-serif" }}>常用單位參考</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Quantity 物理量", "Symbol 符號", "Unit 單位", "Abbreviation 縮寫"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(230,237,243,0.35)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Force 力", "F", "Newton 牛頓", "N = kg·m/s²"],
                  ["Mass 質量", "m", "Kilogram 千克", "kg"],
                  ["Displacement 位移", "s, x, y", "Metre 米", "m"],
                  ["Velocity 速度", "u, v", "Metres per second 米每秒", "m/s"],
                  ["Acceleration 加速度", "a", "metres per second squared", "m/s²"],
                  ["Momentum 動量", "p", "kilogram metre per second", "kg·m/s = N·s"],
                  ["Impulse 衝量", "J", "Newton second 牛頓秒", "N·s"],
                  ["Radius 半徑", "r", "Metre 米", "m"],
                  ["Energy / Work 能量/功", "E, W", "Joule 焦耳", "J = N·m"],
                  ["Power 功率", "P", "Watt 瓦特", "W = J/s"],
                  ["Temperature 溫度", "T", "Kelvin / Celsius 開爾文/攝氏", "K / °C"],
                  ["Heat 熱量", "Q", "Joule 焦耳", "J"],
                  ["Heat Capacity 熱容", "C", "Joule per kelvin 焦耳每開爾文", "J/K"],
                  ["Specific Heat Capacity 比熱容", "c", "Joule per kilogram kelvin", "J/(kg·K)"],
                  ["Specific Latent Heat 比潛熱", "ℓ", "Joule per kilogram", "J/kg"],
                  ["Pressure 壓力", "p", "Pascal 帕斯卡", "Pa = N/m²"],
                  ["Volume 體積", "V", "Cubic metre 立方米", "m³"],
                  ["Amount of Gas 氣體物質的量", "n", "Mole 莫耳", "mol"],
                  ["Frequency 頻率", "f", "Hertz 赫茲", "Hz = s⁻¹"],
                  ["Wavelength 波長", "λ", "Metre 米", "m"],
                  ["Wave speed 波速", "v", "metres per second", "m/s"],
                  ["Refractive index 折射率", "n", "Dimensionless 無單位", "—"],
                  ["Angle 角度", "θ, i, r, C", "Degrees 度", "°"],
                ].map(([qty, sym, unit, abbr], i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    className="hover:bg-white/3 transition-colors duration-150">
                    <td className="px-5 py-3" style={{ color: "rgba(230,237,243,0.75)" }}>{qty}</td>
                    <td className="px-5 py-3 font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: "#00d4ff" }}>{sym}</td>
                    <td className="px-5 py-3" style={{ color: "rgba(230,237,243,0.6)" }}>{unit}</td>
                    <td className="px-5 py-3 font-medium" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(230,237,243,0.5)" }}>{abbr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
