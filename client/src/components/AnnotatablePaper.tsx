import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

export interface AnnotatablePaperProps {
  children: ReactNode;
  pageLabel: string;
}

type InkPoint = { x: number; y: number; pressure: number };
type InkStroke = {
  points: InkPoint[];
  color: string;
  width: number;
  kind: "pen" | "highlighter" | "ruler";
  opacity?: number;
};
type InkTool = "pen" | "highlighter" | "eraser" | "ruler";
type Gesture = {
  pointerId: number;
  pointerType: string;
  tool: InkTool;
  stroke: InkStroke;
  before: InkStroke[];
  lastPoint: InkPoint;
  changed: boolean;
};
type TouchGesture = { x: number; y: number; blocked: boolean };
type Position = { x: number; y: number };
type Preferences = { thickness: number; color: string; tool: InkTool; writing: boolean };

const COLORS = [
  { name: "藍色", value: "#2563eb", className: "ink-color-blue" },
  { name: "紅色", value: "#dc2626", className: "ink-color-red" },
  { name: "黑色", value: "#171717", className: "ink-color-black" },
] as const;
const HIGHLIGHTER_COLOR = "#facc15";
const PALM_RADIUS = 140;
const PALM_DELAY = 1200;
const ERASER_RADIUS = 12;
const PREFERENCES_KEY = "dse-physics-ink-preferences-v2";
const controlStyle: CSSProperties = { minWidth: 44, minHeight: 44, padding: "0.5rem 0.75rem", touchAction: "manipulation" };

function storageKey(pageLabel: string) { return `dse-physics-ink-v2:${pageLabel}`; }
function cloneStrokes(strokes: InkStroke[]): InkStroke[] {
  return strokes.map(stroke => ({ ...stroke, points: stroke.points.map(point => ({ ...point })) }));
}
function readStorage<T>(key: string): T | null {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : null; } catch { return null; }
}
function writeStorage(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Privacy mode or quota restrictions. */ }
}
function distanceToSegment(point: Position, start: Position, end: Position) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return Math.hypot(point.x - start.x - t * dx, point.y - start.y - t * dy);
}
function segmentDistance(a: Position, b: Position, c: Position, d: Position) {
  const rx = b.x - a.x; const ry = b.y - a.y; const sx = d.x - c.x; const sy = d.y - c.y;
  const determinant = rx * sy - ry * sx;
  if (Math.abs(determinant) > 1e-8) {
    const cx = c.x - a.x; const cy = c.y - a.y;
    const t = (cx * sy - cy * sx) / determinant; const u = (cx * ry - cy * rx) / determinant;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return 0;
  }
  return Math.min(distanceToSegment(a, c, d), distanceToSegment(b, c, d), distanceToSegment(c, a, b), distanceToSegment(d, a, b));
}
function pressureFor(event: PointerEvent) {
  return event.pointerType === "pen" && Number.isFinite(event.pressure) && event.pressure > 0 ? Math.min(1, Math.max(0.05, event.pressure)) : 0.5;
}
function strokeWidth(stroke: InkStroke, pressure: number, pageWidth: number) {
  const multiplier = stroke.kind === "highlighter" ? 2.4 : stroke.kind === "ruler" ? 0.9 : 1;
  return stroke.width * pageWidth * multiplier * (0.45 + pressure * 1.1);
}
function paintStroke(context: CanvasRenderingContext2D, stroke: InkStroke, width: number, height: number, alreadyPainted = 0) {
  if (!stroke.points.length) return;
  context.save();
  context.globalAlpha = stroke.kind === "highlighter" ? (stroke.opacity ?? 0.3) : (stroke.opacity ?? 1);
  context.strokeStyle = stroke.color; context.fillStyle = stroke.color; context.lineCap = "round"; context.lineJoin = "round";
  if (stroke.kind === "ruler" && stroke.points.length > 1) {
    const start = stroke.points[0]; const end = stroke.points[1];
    const x1 = start.x * width; const y1 = start.y * height; const x2 = end.x * width; const y2 = end.y * height;
    const dx = x2 - x1; const dy = y2 - y1; const length = Math.hypot(dx, dy) || 1; const cap = 7;
    context.lineWidth = Math.max(1.5, strokeWidth(stroke, 0.5, width));
    context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.stroke();
    context.lineWidth = Math.max(1, context.lineWidth * 0.8);
    context.beginPath(); context.moveTo(x1 - dy / length * cap, y1 + dx / length * cap); context.lineTo(x1 + dy / length * cap, y1 - dx / length * cap); context.moveTo(x2 - dy / length * cap, y2 + dx / length * cap); context.lineTo(x2 + dy / length * cap, y2 - dx / length * cap); context.stroke();
    context.restore(); return;
  }
  if (alreadyPainted === 0) {
    const first = stroke.points[0]; context.beginPath(); context.arc(first.x * width, first.y * height, strokeWidth(stroke, first.pressure, width) / 2, 0, Math.PI * 2); context.fill();
  }
  for (let index = Math.max(1, alreadyPainted); index < stroke.points.length; index++) {
    const previous = stroke.points[index - 1]; const point = stroke.points[index];
    context.lineWidth = strokeWidth(stroke, (previous.pressure + point.pressure) / 2, width);
    context.beginPath(); context.moveTo(previous.x * width, previous.y * height); context.lineTo(point.x * width, point.y * height); context.stroke();
  }
  context.restore();
}
function capturePointer(canvas: HTMLCanvasElement, pointerId: number) { try { canvas.setPointerCapture(pointerId); } catch { /* Unsupported or already released. */ } }
function releasePointer(canvas: HTMLCanvasElement | null, pointerId: number) { try { if (canvas?.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId); } catch { /* Already released. */ } }
function hasCapture(canvas: HTMLCanvasElement, pointerId: number) { try { return canvas.hasPointerCapture(pointerId); } catch { return false; } }

export function AnnotatablePaper({ children, pageLabel }: AnnotatablePaperProps) {
  const hostRef = useRef<HTMLDivElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<InkStroke[]>([]); const historyRef = useRef<InkStroke[][]>([]); const activeRef = useRef<Gesture | null>(null);
  const touchesRef = useRef(new Map<number, TouchGesture>()); const lastPenRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const metricsRef = useRef({ width: 0, height: 0 }); const frameRef = useRef<number | null>(null); const fullRedrawRef = useRef(true); const paintedPointsRef = useRef(0);
  const writingRef = useRef(true); const statusTimerRef = useRef<number | null>(null);
  const initialPreferences = (): Preferences => {
    const saved = typeof window !== "undefined" ? readStorage<Partial<Preferences>>(PREFERENCES_KEY) : null;
    return { thickness: saved?.thickness === 1.5 || saved?.thickness === 4 || saved?.thickness === 6 ? saved.thickness : 2.5, color: COLORS.some(option => option.value === saved?.color) ? saved!.color! : COLORS[0].value, tool: saved?.tool && ["pen", "highlighter", "eraser", "ruler"].includes(saved.tool) ? saved.tool : "pen", writing: saved?.writing !== false };
  };
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const { thickness, color, tool, writing } = preferences;
  const [strokeCount, setStrokeCount] = useState(0); const [undoCount, setUndoCount] = useState(0); const [status, setStatus] = useState("");
  const thicknessId = useId();

  const saveStrokes = useCallback(() => writeStorage(storageKey(pageLabel), cloneStrokes(strokesRef.current)), [pageLabel]);
  const schedulePaint = useCallback((full = false) => {
    if (full) fullRedrawRef.current = true;
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null; const canvas = canvasRef.current; const { width, height } = metricsRef.current; if (!canvas || width <= 0 || height <= 0) return;
      const context = canvas.getContext("2d"); if (!context) return; const redraw = fullRedrawRef.current;
      if (redraw) { context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, canvas.width, canvas.height); }
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      if (redraw) { strokesRef.current.forEach(stroke => paintStroke(context, stroke, width, height)); paintedPointsRef.current = 0; fullRedrawRef.current = false; }
      const active = activeRef.current;
      if (active && active.tool !== "eraser") { paintStroke(context, active.stroke, width, height, active.tool === "ruler" ? 0 : paintedPointsRef.current); paintedPointsRef.current = active.stroke.points.length; }
    });
  }, []);

  useEffect(() => {
    const loaded = readStorage<InkStroke[]>(storageKey(pageLabel));
    if (Array.isArray(loaded)) strokesRef.current = loaded.filter(stroke => stroke && Array.isArray(stroke.points) && ["pen", "highlighter", "ruler"].includes(stroke.kind));
    setStrokeCount(strokesRef.current.length);
  }, [pageLabel]);
  useEffect(() => { writeStorage(PREFERENCES_KEY, preferences); }, [preferences]);
  useEffect(() => { writingRef.current = writing; }, [writing]);
  useEffect(() => {
    const host = hostRef.current; const canvas = canvasRef.current; if (!host || !canvas) return;
    const measure = () => { const rect = host.getBoundingClientRect(); if (rect.width <= 0 || rect.height <= 0) return; metricsRef.current = { width: rect.width, height: rect.height }; const ratio = Math.min(2, Math.max(1, window.devicePixelRatio || 1)); canvas.width = Math.max(1, Math.round(rect.width * ratio)); canvas.height = Math.max(1, Math.round(rect.height * ratio)); schedulePaint(true); };
    measure(); const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null; observer?.observe(host); window.addEventListener("resize", measure); window.addEventListener("orientationchange", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); window.removeEventListener("orientationchange", measure); if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current); frameRef.current = null; const active = activeRef.current; activeRef.current = null; if (active) releasePointer(canvas, active.pointerId); touchesRef.current.forEach((_, id) => releasePointer(canvas, id)); touchesRef.current.clear(); };
  }, [schedulePaint]);
  const refreshCounts = () => { setStrokeCount(strokesRef.current.length); setUndoCount(historyRef.current.length); };
  const announce = (message: string) => { setStatus(message); if (statusTimerRef.current !== null) window.clearTimeout(statusTimerRef.current); statusTimerRef.current = window.setTimeout(() => setStatus(""), 1600); };
  const finishGesture = () => {
    const active = activeRef.current; if (!active) return; activeRef.current = null;
    if (active.tool !== "eraser" && active.stroke.points.length > (active.tool === "ruler" ? 1 : 0) && active.changed) { historyRef.current.push(cloneStrokes(active.before)); strokesRef.current = [...strokesRef.current, active.stroke]; saveStrokes(); }
    else if (active.tool === "eraser" && active.changed) { historyRef.current.push(cloneStrokes(active.before)); saveStrokes(); }
    releasePointer(canvasRef.current, active.pointerId); paintedPointsRef.current = 0; refreshCounts(); schedulePaint(true);
  };
  const pointFromEvent = (event: PointerEvent, rect: DOMRect): InkPoint | null => !rect.width || !rect.height || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY) ? null : { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), pressure: pressureFor(event) };
  const eraseBetween = (start: InkPoint, end: InkPoint, rect: DOMRect) => {
    const toPixels = (point: InkPoint): Position => ({ x: point.x * rect.width, y: point.y * rect.height }); const a = toPixels(start); const b = toPixels(end);
    const remaining = strokesRef.current.filter(stroke => { const radius = ERASER_RADIUS + stroke.width * rect.width * 1.55 / 2; for (let index = 0; index < stroke.points.length; index++) { const c = toPixels(stroke.points[Math.max(0, index - 1)]); const d = toPixels(stroke.points[index]); if (segmentDistance(a, b, c, d) <= radius) return false; } return true; });
    if (remaining.length !== strokesRef.current.length) { strokesRef.current = remaining; if (activeRef.current) activeRef.current.changed = true; schedulePaint(true); }
  };
  const isPalm = (event: PointerEvent) => { if (activeRef.current?.pointerType === "pen") return true; const last = lastPenRef.current; return !!last && performance.now() - last.time < PALM_DELAY && Math.hypot(event.clientX - last.x, event.clientY - last.y) < PALM_RADIUS; };
  const rememberPen = (event: PointerEvent) => { lastPenRef.current = { x: event.clientX, y: event.clientY, time: performance.now() }; touchesRef.current.forEach(touch => { touch.blocked = true; }); };
  const appendSamples = (event: PointerEvent) => {
    const active = activeRef.current; const canvas = canvasRef.current; if (!active || active.pointerId !== event.pointerId || !canvas) return; const rect = canvas.getBoundingClientRect(); let samples: PointerEvent[] = [];
    try { if (typeof event.getCoalescedEvents === "function") samples = event.getCoalescedEvents(); } catch { /* Unsupported coalesced events. */ }
    for (const sample of [...samples, event]) { const point = pointFromEvent(sample, rect); if (!point) continue; if (active.tool === "eraser") eraseBetween(active.lastPoint, point, rect); else if (active.tool === "ruler") { if (active.stroke.points.length < 2) active.stroke.points.push(point); else active.stroke.points[1] = point; active.changed = true; } else if (point.x !== active.lastPoint.x || point.y !== active.lastPoint.y) { active.stroke.points.push(point); active.changed = true; } active.lastPoint = point; }
    if (active.pointerType === "pen") rememberPen(event); if (active.tool !== "eraser") schedulePaint();
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!writingRef.current) return; const native = event.nativeEvent;
    if (native.pointerType === "touch") { event.preventDefault(); const blocked = !!activeRef.current || touchesRef.current.size > 0 || isPalm(native); if (touchesRef.current.size > 0) touchesRef.current.forEach(touch => { touch.blocked = true; }); touchesRef.current.set(native.pointerId, { x: native.clientX, y: native.clientY, blocked }); capturePointer(event.currentTarget, native.pointerId); return; }
    if ((native.pointerType !== "pen" && native.pointerType !== "mouse") || native.button !== 0 || activeRef.current) return; const rect = event.currentTarget.getBoundingClientRect(); const point = pointFromEvent(native, rect); if (!point) return; event.preventDefault(); touchesRef.current.forEach(touch => { touch.blocked = true; }); if (native.pointerType === "pen") rememberPen(native);
    const kind = tool === "highlighter" ? "highlighter" : tool === "ruler" ? "ruler" : "pen"; const stroke: InkStroke = { points: [point], color: kind === "highlighter" ? HIGHLIGHTER_COLOR : kind === "ruler" ? "#4b5563" : color, width: thickness / rect.width, kind, opacity: kind === "highlighter" ? 0.3 : undefined };
    activeRef.current = { pointerId: native.pointerId, pointerType: native.pointerType, tool, stroke, before: cloneStrokes(strokesRef.current), lastPoint: point, changed: false }; paintedPointsRef.current = 0; capturePointer(event.currentTarget, native.pointerId); if (tool === "eraser") eraseBetween(point, point, rect); else schedulePaint();
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => { if (!writingRef.current) return; const native = event.nativeEvent; if (native.pointerType === "touch") { const touch = touchesRef.current.get(native.pointerId); if (!touch) return; event.preventDefault(); if (activeRef.current || isPalm(native)) touch.blocked = true; if (!touch.blocked && touchesRef.current.size === 1) window.scrollBy({ left: touch.x - native.clientX, top: touch.y - native.clientY, behavior: "instant" }); touch.x = native.clientX; touch.y = native.clientY; return; } if (activeRef.current?.pointerId !== native.pointerId) return; event.preventDefault(); appendSamples(native); };
  const endPointer = (event: ReactPointerEvent<HTMLCanvasElement>, includeTip: boolean) => { const native = event.nativeEvent; if (native.pointerType === "touch") { touchesRef.current.delete(native.pointerId); releasePointer(event.currentTarget, native.pointerId); return; } if (activeRef.current?.pointerId !== native.pointerId) return; if (includeTip) appendSamples(native); if (native.pointerType === "pen" && lastPenRef.current) lastPenRef.current.time = performance.now(); finishGesture(); };
  const changeWriting = (enabled: boolean) => { finishGesture(); touchesRef.current.forEach((_, id) => releasePointer(canvasRef.current, id)); touchesRef.current.clear(); writingRef.current = enabled; setPreferences(previous => ({ ...previous, writing: enabled })); };
  const chooseTool = (next: InkTool) => { finishGesture(); setPreferences(previous => ({ ...previous, tool: next })); };
  const cycleTool = () => { const tools: InkTool[] = ["pen", "highlighter", "eraser", "ruler"]; const next = tools[(tools.indexOf(tool) + 1) % tools.length]; chooseTool(next); announce(`工具：${next === "pen" ? "畫筆" : next === "highlighter" ? "螢光筆" : next === "eraser" ? "擦膠" : "尺規"}`); };
  const undo = () => { finishGesture(); const previous = historyRef.current.pop(); if (!previous) return; strokesRef.current = cloneStrokes(previous); saveStrokes(); refreshCounts(); schedulePaint(true); };
  const clear = () => { finishGesture(); if (!strokesRef.current.length) return; historyRef.current.push(cloneStrokes(strokesRef.current)); strokesRef.current = []; try { window.localStorage.removeItem(storageKey(pageLabel)); } catch { /* Privacy mode. */ } refreshCounts(); schedulePaint(true); };
  const buttonClass = (selected: boolean) => `ink-button${selected ? " is-active" : ""}`;

  return <div className="annotatable-paper" data-writing={writing ? "true" : "false"}>
    <div className="ink-toolbar" role="toolbar" aria-label={`${pageLabel}：批註工具列`} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
      <button type="button" className={buttonClass(writing)} style={controlStyle} aria-label="書寫模式" aria-pressed={writing} onClick={() => changeWriting(true)}>書寫</button>
      <button type="button" className={buttonClass(!writing)} style={controlStyle} aria-label="閱讀模式" aria-pressed={!writing} onClick={() => changeWriting(false)}>閱讀</button>
      <button type="button" className={buttonClass(tool === "pen")} style={controlStyle} aria-label="畫筆" aria-pressed={tool === "pen"} disabled={!writing} onClick={() => chooseTool("pen")}>畫筆</button>
      <button type="button" className={buttonClass(tool === "highlighter")} style={controlStyle} aria-label="螢光筆" aria-pressed={tool === "highlighter"} disabled={!writing} onClick={() => chooseTool("highlighter")}>螢光筆</button>
      <button type="button" className={buttonClass(tool === "eraser")} style={controlStyle} aria-label="擦膠：擦除整條筆跡" aria-pressed={tool === "eraser"} disabled={!writing} onClick={() => chooseTool("eraser")}>擦膠</button>
      <button type="button" className={buttonClass(tool === "ruler")} style={controlStyle} aria-label="尺規：畫直線" aria-pressed={tool === "ruler"} disabled={!writing} onClick={() => chooseTool("ruler")}>尺規</button>
      <div role="group" aria-label="筆跡顏色" style={{ display: "flex", gap: "0.25rem" }}>{COLORS.map(option => <button key={option.value} type="button" className={`${buttonClass(color === option.value)} ${option.className}`} style={{ ...controlStyle, display: "inline-flex", alignItems: "center", gap: "0.35rem" }} aria-label={`${option.name}筆跡`} aria-pressed={color === option.value} disabled={!writing} onClick={() => { finishGesture(); setPreferences(previous => ({ ...previous, color: option.value })); }}><span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: option.value }} />{option.name}</button>)}</div>
      <label htmlFor={thicknessId}>粗幼</label><select id={thicknessId} className="ink-thickness" style={controlStyle} aria-label="畫筆粗幼" disabled={!writing} value={thickness} onChange={event => { finishGesture(); setPreferences(previous => ({ ...previous, thickness: Number(event.target.value) })); }}><option value={1.5}>幼（1.5）</option><option value={2.5}>中（2.5）</option><option value={4}>粗（4）</option><option value={6}>特粗（6）</option></select>
      <button type="button" className="ink-button" style={controlStyle} aria-label={`復原${pageLabel}的上一步批註`} disabled={undoCount === 0} onClick={undo}>復原</button><button type="button" className="ink-button" style={controlStyle} aria-label={`清除此頁筆跡：${pageLabel}`} disabled={strokeCount === 0} onClick={clear}>清除此頁</button>
      <span className="ink-stroke-count" aria-live="polite" aria-atomic="true">筆跡：{strokeCount}</span><span aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>{status}</span>
    </div>
    <div ref={hostRef} className="annotatable-paper-page" style={{ position: "relative", width: "100%" }}>{children}<canvas ref={canvasRef} className="paper-ink-canvas" data-strokes={strokeCount} role="img" aria-label={`${pageLabel}：${writing ? "書寫" : "閱讀"}模式的批註畫布`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", background: "transparent", zIndex: 2, pointerEvents: writing ? "auto" : "none", touchAction: writing ? "none" : "auto", cursor: writing ? (tool === "eraser" ? "cell" : "crosshair") : "auto", userSelect: "none" }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={event => endPointer(event, true)} onPointerCancel={event => endPointer(event, false)} onLostPointerCapture={event => endPointer(event, false)} onDoubleClick={event => { if (writing) { event.preventDefault(); cycleTool(); } }} onPointerLeave={event => { if (!hasCapture(event.currentTarget, event.pointerId)) endPointer(event, false); }} /></div>
  </div>;
}

export default AnnotatablePaper;
