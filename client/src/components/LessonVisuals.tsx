import { useState } from 'react';

function RmsExplorer({ showZh }: { showZh: boolean }) {
  const [raw, setRaw] = useState('100, 200, 300');
  const parts = raw.trim().split(/[，,\s]+/).filter(Boolean);
  const values = parts.map(Number);
  const valid = values.length > 0 && values.length <= 200 && values.every(v => Number.isFinite(v) && v >= 0 && v <= 1e12);
  const mean = valid ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const meanSquare = valid ? values.reduce((a, b) => a + b * b, 0) / values.length : 0;
  const rms = Math.sqrt(meanSquare);
  const fmt = (n: number) => n.toLocaleString('en-US', { maximumSignificantDigits: 7 });
  return <div className="lesson-card space-y-4">
    <h3>Try mean vs RMS {showZh && '· 親手計平均與均方根'}</h3>
    <label className="block"><span className="lesson-en text-sm">Molecular speeds in m/s, separated by commas</span>{showZh && <span className="lesson-zh block">輸入速率，用逗號分開。這是同質量粒子的等權樣本，不代表完整的氣體速率分佈。</span>}
      <input value={raw} onChange={e => setRaw(e.target.value)} className="mt-3 w-full rounded-lg p-3 text-sm" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }} aria-label="Molecular speed sample" />
    </label>
    {valid ? <div className="grid sm:grid-cols-2 gap-3" aria-live="polite">{[
      ['Mean speed 平均速率', fmt(mean), 'm/s'],
      ['Square of mean 平均速率的平方', fmt(mean * mean), 'm²/s²'],
      ['Mean square speed 均方速率', fmt(meanSquare), 'm²/s²'],
      ['Root mean square speed 均方根速率', fmt(rms), 'm/s'],
    ].map(([label, value, unit]) => <div key={label} className="lesson-rearrangement"><p className="lesson-zh">{label}</p><p className="font-mono text-lg mt-2">{value} <span className="text-xs opacity-60">{unit}</span></p></div>)}</div> : <p role="alert" className="lesson-zh" style={{ color: 'var(--color-red)' }}>Enter 1–200 finite, non-negative speeds (maximum 10¹² m/s).</p>}
    <p className="lesson-zh">Mean square：先平方，再平均。RMS：在 mean square 上再開平方。不能只把 mean speed 平方當作 mean square；除非所有速率相同。</p>
  </div>;
}

function WaveExplorer({ showZh }: { showZh: boolean }) {
  const [time, setTime] = useState(0);
  const omegaT = Number(time) * Math.PI * 2;
  const width = 500;
  const path = (standing: boolean, baseline: number) => Array.from({ length: 251 }, (_, i) => {
    const x = width * i / 250;
    const phase = 4 * Math.PI * x / width;
    const y = baseline - 32 * (standing ? Math.sin(phase) * Math.cos(omegaT) : Math.sin(phase - omegaT));
    return `${i === 0 ? 'M' : 'L'}${(x + 40).toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  return <div className="lesson-card">
    <h3>Compare snapshots {showZh && '· 比較不同時間的波形'}</h3>
    <div className="lesson-diagram"><svg viewBox="0 0 590 300" role="img" aria-label="Travelling wave shifts right; stationary wave nodes stay at fixed positions">
      <text x="40" y="28" fill="var(--text-primary)" fontSize="14">Travelling wave · 行波 →</text>
      <line x1="40" y1="85" x2="540" y2="85" stroke="var(--border-strong)" />
      <path d={path(false, 85)} fill="none" stroke="var(--color-cyan)" strokeWidth="2.5" />
      <text x="40" y="146" fill="var(--text-primary)" fontSize="14">Stationary wave · 駐波</text>
      <line x1="40" y1="205" x2="540" y2="205" stroke="var(--border-strong)" />
      <path d={path(true, 205)} fill="none" stroke="var(--color-purple)" strokeWidth="2.5" />
      {[0, 1, 2, 3, 4].map(i => <g key={i}><circle cx={40 + i * 125} cy="205" r="4" fill="var(--color-red)" /><text x={40 + i * 125} y="265" textAnchor="middle" fill="var(--text-muted)" fontSize="11">N</text></g>)}
      {[0, 1, 2, 3].map(i => <text key={i} x={102.5 + i * 125} y="265" textAnchor="middle" fill="var(--text-muted)" fontSize="11">A</text>)}
    </svg></div>
    <label className="block text-sm">Time / period 時間／週期: {Number(time).toFixed(2)} T<input type="range" min="0" max="1" step="0.01" value={time} onChange={e => setTime(Number(e.target.value))} className="block mt-3 w-full" /></label>
    <p className="lesson-zh mt-4">N = node 波節；A = antinode 波腹。移動時間滑桿，行波波峰向右移；駐波的波節位置不移動。駐波經過平衡位置時整條曲線可瞬時為零，但只有波節一直不動。</p>
  </div>;
}

function GratingGeometry({ showZh }: { showZh: boolean }) {
  const d = 1e-3 / 600;
  const wavelength = 500e-9;
  return <div className="lesson-card"><h3>Orders on both sides {showZh && '· 中央與兩側級次'}</h3>
    <div className="lesson-diagram"><svg viewBox="0 0 600 340" role="img" aria-label="Normal incidence diffraction grating: zero order central, symmetric first and second orders">
      <line x1="20" y1="170" x2="220" y2="170" stroke="var(--color-cyan)" strokeWidth="2" />
      <text x="25" y="150" fill="var(--text-muted)" fontSize="13">Normal incidence · 正入射</text>
      <line x1="220" y1="25" x2="220" y2="315" stroke="var(--text-muted)" strokeWidth="5" />
      <line x1="380" y1="25" x2="380" y2="315" stroke="var(--border-strong)" strokeWidth="2" />
      <line x1="220" y1="170" x2="380" y2="170" stroke="var(--color-red)" strokeWidth="2" />
      <text x="398" y="174" fill="var(--text-primary)" fontSize="12">0: central 中央</text>
      {[-2, -1, 1, 2].map(order => {
        const angle = Math.asin(Math.abs(order) * wavelength / d);
        const y = 170 - Math.sign(order) * 160 * Math.tan(angle);
        return <g key={order}><line x1="220" y1="170" x2="380" y2={y} stroke="var(--color-purple)" strokeWidth="2" /><circle cx="380" cy={y} r="4" fill="var(--color-purple)" /><text x="398" y={y + 4} fill="var(--text-primary)" fontSize="12">{order > 0 ? '+' : '−'}{Math.abs(order)}: {angle * 180 / Math.PI > 0 ? (angle * 180 / Math.PI).toFixed(1) : '0'}°</text></g>;
      })}
      <text x="80" y="335" fill="var(--text-muted)" fontSize="12">500 nm · 600 lines/mm · angles measured from central axis</text>
    </svg></div><p className="lesson-zh">這是按 d sin θ = qλ 計出的幾何。級次符號只表示中央左右兩邊；圖中上／下代表兩側方向，不是氣體的莫耳數 n。</p>
  </div>;
}

function LensGeometry({ showZh }: { showZh: boolean }) {
  return <div className="lesson-card"><h3>Three principal rays {showZh && '· 凸透鏡三條主光線'}</h3>
    <div className="lesson-diagram"><svg viewBox="0 0 550 270" role="img" aria-label="Convex lens real inverted image formed by three principal rays for object beyond twice focal length">
      <line x1="25" y1="160" x2="515" y2="160" stroke="var(--border-strong)" />
      <path d="M280 50 Q300 160 280 250 Q260 160 280 50Z" fill="color-mix(in srgb, var(--color-cyan) 15%, transparent)" stroke="var(--color-cyan)" />
      <line x1="100" y1="160" x2="100" y2="110" stroke="var(--color-orange)" strokeWidth="3" /><path d="M94 120 L100 110 L106 120" fill="none" stroke="var(--color-orange)" strokeWidth="2" />
      <line x1="370" y1="160" x2="370" y2="185" stroke="var(--color-red)" strokeWidth="3" /><path d="M364 175 L370 185 L376 175" fill="none" stroke="var(--color-red)" strokeWidth="2" />
      <polyline points="100,110 280,110 370,185" fill="none" stroke="var(--color-cyan)" strokeWidth="1.8" />
      <polyline points="100,110 280,160 370,185" fill="none" stroke="var(--color-purple)" strokeWidth="1.8" />
      <polyline points="100,110 280,185 370,185" fill="none" stroke="var(--color-orange)" strokeWidth="1.8" />
      {[160, 220, 340, 400].map((x, i) => <g key={x}><line x1={x} y1="155" x2={x} y2="165" stroke="var(--text-muted)" /><text x={x} y="146" textAnchor="middle" fill="var(--text-muted)" fontSize="12">{i === 0 || i === 3 ? '2F' : 'F'}</text></g>)}
      <text x="58" y="94" fill="var(--text-primary)" fontSize="13">Object 物體</text><text x="370" y="209" fill="var(--text-primary)" fontSize="13">Image 像</text>
      <text x="35" y="248" fill="var(--text-muted)" fontSize="12">u = 3f → v = 1.5f: real, inverted, diminished</text>
    </svg></div><p className="lesson-zh">實線真正相交形成實像；本例物體在 2F 外，像在 F 與 2F 之間、倒立且縮小。光線近似適用於薄透鏡及近軸光。</p>
  </div>;
}

export default function LessonVisuals({ topicId, showZh }: { topicId: string; showZh: boolean }) {
  if (topicId === 'gases-kinetic-theory') return <RmsExplorer showZh={showZh} />;
  if (topicId === 'stationary-travelling-waves') return <WaveExplorer showZh={showZh} />;
  if (topicId === 'diffraction-grating') return <GratingGeometry showZh={showZh} />;
  if (topicId === 'lenses') return <LensGeometry showZh={showZh} />;
  return null;
}
