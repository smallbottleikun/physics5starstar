import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Ellipsis, Eraser, Highlighter, Pencil, Ruler, Trash2, Undo2 } from "lucide-react";
import { getStroke } from "perfect-freehand";
import { anchorScrollDelta, broadcastPaperPreferences, canvasBitmapSize, clampPaperZoom, paperCoordinateAt, pinchGeometry, subscribePaperPreferences } from "./paper-zoom";
import type { PaperPosition } from "./paper-zoom";
import { createDeferredInkStorage, inkStartDecision, isInkMove, isPenButtonDown, isPenContact, takeInkSession, touchMayNavigate } from "./ink-input";
import { remapSplitInk } from "./split-paper-ink";

export interface AnnotatablePaperProps {
  children: ReactNode;
  pageLabel: string;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  toolbarTargetId?: string;
  active?: boolean;
  legacyInkRegion?: { pageLabel: string; x0: number; x1: number; y0?: number; y1?: number };
}

type InkPoint = { x: number; y: number; pressure: number };
export type InkStroke = {
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
type TouchGesture = PaperPosition & { blocked: boolean };
type Pinch = { ids: [number, number]; distance: number; zoom: number; paperPoint: PaperPosition };
type ZoomAnchor = { zoom: number; midpoint: PaperPosition; paperPoint: PaperPosition };
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
// These v2 keys intentionally remain compatible with all previously saved ink.
const PREFERENCES_KEY = "dse-physics-ink-preferences-v2";
const STORAGE_WARNING = "未能儲存批註或設定（儲存空間已滿或私人瀏覽限制）。目前內容只保留於本次開啟，請勿關閉頁面。";
const controlStyle: CSSProperties = { width: 44, height: 44, minWidth: 44, minHeight: 44, padding: 0, flexShrink: 0, touchAction: "manipulation" };
const hiddenStyle: CSSProperties = { position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" };

function storageKey(pageLabel: string) { return `dse-physics-ink-v2:${pageLabel}`; }
function readStorage<T>(key: string): T | null {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : null; } catch { return null; }
}
function writeStorage(key: string, value: unknown): string {
  try { window.localStorage.setItem(key, JSON.stringify(value)); return ""; } catch { return STORAGE_WARNING; }
}
function initialPreferences(): Preferences {
  const saved = typeof window !== "undefined" ? readStorage<Partial<Preferences>>(PREFERENCES_KEY) : null;
  return {
    thickness: saved?.thickness === 1.5 || saved?.thickness === 4 || saved?.thickness === 6 ? saved.thickness : 2.5,
    color: COLORS.some(option => option.value === saved?.color) ? saved!.color! : COLORS[0].value,
    tool: saved?.tool && ["pen", "highlighter", "eraser", "ruler"].includes(saved.tool) ? saved.tool : "pen",
    writing: saved?.writing !== false,
  };
}
function distanceToSegment(point: PaperPosition, start: PaperPosition, end: PaperPosition) {
  const dx = end.x - start.x; const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return Math.hypot(point.x - start.x - t * dx, point.y - start.y - t * dy);
}
function segmentDistance(a: PaperPosition, b: PaperPosition, c: PaperPosition, d: PaperPosition) {
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
function fillFreehandStroke(context: CanvasRenderingContext2D, stroke: InkStroke, width: number, height: number) {
  if (stroke.points.length === 1) {
    const first = stroke.points[0];
    context.beginPath(); context.arc(first.x * width, first.y * height, strokeWidth(stroke, first.pressure, width) / 2, 0, Math.PI * 2); context.fill();
    return;
  }
  const input = stroke.points.map(point => [point.x * width, point.y * height, point.pressure] as [number, number, number]);
  const outline = getStroke(input, {
    size: Math.max(1.5, stroke.width * width),
    thinning: 0.35,
    smoothing: 0.55,
    streamline: 0.35,
    simulatePressure: false,
    last: true,
  });
  if (outline.length < 3) {
    const first = stroke.points[0];
    context.beginPath(); context.arc(first.x * width, first.y * height, strokeWidth(stroke, first.pressure, width) / 2, 0, Math.PI * 2); context.fill();
    return;
  }
  context.beginPath();
  context.moveTo(outline[0][0], outline[0][1]);
  for (const [x, y] of outline.slice(1)) context.lineTo(x, y);
  if (typeof context.closePath === "function") context.closePath(); context.fill();
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
  // Composite a highlighter as ONE path, not overlapping translucent segments.
  // Its live preview always starts with a cleared canvas, so opacity never builds up.
  if (stroke.kind === "highlighter" && stroke.points.length > 1) {
    context.lineWidth = strokeWidth(stroke, 0.5, width);
    context.beginPath(); context.moveTo(stroke.points[0].x * width, stroke.points[0].y * height);
    for (const point of stroke.points.slice(1)) context.lineTo(point.x * width, point.y * height);
    context.stroke(); context.restore(); return;
  }
  if (stroke.points.length > 0 && stroke.kind === "pen") {
    fillFreehandStroke(context, stroke, width, height);
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
function capturePointer(canvas: HTMLCanvasElement, pointerId: number) { try { canvas.setPointerCapture(pointerId); return true; } catch { return false; } }
function releasePointer(canvas: HTMLCanvasElement | null, pointerId: number) { try { if (canvas?.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId); } catch { /* Already released. */ } }
function hasCapture(canvas: HTMLCanvasElement, pointerId: number) { try { return canvas.hasPointerCapture(pointerId); } catch { return false; } }

export function AnnotatablePaper({ children, pageLabel, zoom: zoomProp, onZoomChange, toolbarTargetId, active = true, legacyInkRegion }: AnnotatablePaperProps) {
  const viewportRef = useRef<HTMLDivElement>(null); const hostRef = useRef<HTMLDivElement>(null); const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<InkStroke[]>([]); const historyRef = useRef<InkStroke[][]>([]); const activeRef = useRef<Gesture | null>(null);
  const touchesRef = useRef(new Map<number, TouchGesture>()); const pinchRef = useRef<Pinch | null>(null);
  const lastPenRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const metricsRef = useRef({ width: 0, height: 0 }); const frameRef = useRef<number | null>(null); const fullRedrawRef = useRef(true); const paintedPointsRef = useRef(0);
  const anchorFrameRef = useRef<number | null>(null); const pendingAnchorRef = useRef<ZoomAnchor | null>(null);
  const touchScrollFrameRef = useRef<number | null>(null); const pendingTouchScrollRef = useRef({ x: 0, y: 0 });
  const loadedPageRef = useRef(pageLabel);
  const [storage] = useState(() => createDeferredInkStorage(writeStorage));
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const preferencesRef = useRef(preferences); const writingRef = useRef(preferences.writing);
  const { thickness, color, tool, writing } = preferences;
  const [localZoom, setLocalZoom] = useState(1);
  const zoom = clampPaperZoom(zoomProp ?? localZoom); // Uncontrolled legacy instances default to 100%.
  const zoomRef = useRef(zoom);
  const [baseSize, setBaseSize] = useState({ width: 0, height: 0 });
  const [toolbarTarget, setToolbarTarget] = useState<HTMLElement | null>(null);
  const [strokeCount, setStrokeCount] = useState(0); const [undoCount, setUndoCount] = useState(0);
  const [inkWarning, setInkWarning] = useState(""); const [preferencesWarning, setPreferencesWarning] = useState("");
  const thicknessId = useId();

  const saveStrokes = useCallback(() => {
    const page = loadedPageRef.current;
    // Committed strokes and history snapshots are immutable; queue only the
    // latest reference. JSON serialization and storage never run on pointerup.
    storage.enqueue(storageKey(page), strokesRef.current, warning => {
      if (loadedPageRef.current === page) setInkWarning(warning);
    });
  }, [storage]);
  const schedulePaint = useCallback((full = false) => {
    if (full) fullRedrawRef.current = true;
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null; const canvas = canvasRef.current; const { width, height } = metricsRef.current;
      if (!canvas || width <= 0 || height <= 0) return;
      const context = canvas.getContext("2d"); if (!context) return;
      const gesture = activeRef.current;
      const redraw = fullRedrawRef.current || gesture?.tool === "pen" || gesture?.tool === "ruler" || gesture?.tool === "highlighter";
      if (redraw) { context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, canvas.width, canvas.height); }
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      if (redraw) { strokesRef.current.forEach(stroke => paintStroke(context, stroke, width, height)); paintedPointsRef.current = 0; fullRedrawRef.current = false; }
      if (gesture && gesture.tool !== "eraser") {
        paintStroke(context, gesture.stroke, width, height, 0);
        paintedPointsRef.current = gesture.stroke.points.length;
      }
    });
  }, []);
  const paintFirstPointNow = useCallback((stroke: InkStroke) => {
    const canvas = canvasRef.current; const { width, height } = metricsRef.current;
    if (!canvas || width <= 0 || height <= 0 || stroke.kind === "ruler" || fullRedrawRef.current) return false;
    const context = canvas.getContext("2d"); if (!context) return false;
    context.save();
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    paintStroke(context, stroke, width, height, 0);
    context.restore();
    return true;
  }, []);
  const scheduleTouchScroll = useCallback((deltaX: number, deltaY: number) => {
    pendingTouchScrollRef.current.x += deltaX; pendingTouchScrollRef.current.y += deltaY;
    if (touchScrollFrameRef.current !== null) return;
    touchScrollFrameRef.current = window.requestAnimationFrame(() => {
      touchScrollFrameRef.current = null;
      const delta = pendingTouchScrollRef.current;
      pendingTouchScrollRef.current = { x: 0, y: 0 };
      if (viewportRef.current && delta.x) viewportRef.current.scrollLeft += delta.x;
      if (delta.y) window.scrollBy({ left: 0, top: delta.y, behavior: "instant" });
    });
  }, []);
  const refreshCounts = useCallback(() => { setStrokeCount(strokesRef.current.length); setUndoCount(historyRef.current.length); }, []);
  const finishGesture = useCallback((pointerId?: number) => {
    const gesture = takeInkSession(activeRef, pointerId); if (!gesture) return;
    if (gesture.tool !== "eraser" && gesture.stroke.points.length > (gesture.tool === "ruler" ? 1 : 0)) {
      historyRef.current.push(gesture.before); strokesRef.current = [...strokesRef.current, gesture.stroke]; saveStrokes();
    } else if (gesture.tool === "eraser" && gesture.changed) { historyRef.current.push(gesture.before); saveStrokes(); }
    releasePointer(canvasRef.current, gesture.pointerId); paintedPointsRef.current = 0; refreshCounts(); schedulePaint(true);
  }, [refreshCounts, saveStrokes, schedulePaint]);
  const cancelGesture = useCallback(() => {
    const gesture = takeInkSession(activeRef); if (!gesture) return;
    if (gesture.tool === "eraser") strokesRef.current = gesture.before;
    releasePointer(canvasRef.current, gesture.pointerId); paintedPointsRef.current = 0; refreshCounts(); schedulePaint(true);
  }, [refreshCounts, schedulePaint]);
  const scheduleAnchor = useCallback(() => {
    if (anchorFrameRef.current !== null) return;
    anchorFrameRef.current = window.requestAnimationFrame(() => {
      anchorFrameRef.current = null;
      const anchor = pendingAnchorRef.current; const host = hostRef.current; const viewport = viewportRef.current;
      // Controlled state may not have committed yet. The layout effect retries after commit.
      if (!anchor || !host || !viewport || Math.abs(zoomRef.current - anchor.zoom) > 0.0001) return;
      pendingAnchorRef.current = null;
      const rect = host.getBoundingClientRect();
      const delta = anchorScrollDelta(anchor.paperPoint, anchor.midpoint, { x: rect.left, y: rect.top }, zoomRef.current);
      viewport.scrollLeft += delta.x;
      window.scrollBy({ left: 0, top: delta.y, behavior: "instant" });
    });
  }, []);
  useLayoutEffect(() => { zoomRef.current = zoom; scheduleAnchor(); }, [zoom, baseSize, scheduleAnchor]);

  useLayoutEffect(() => {
    finishGesture(); storage.flush(); loadedPageRef.current = pageLabel;
    let loaded = readStorage<InkStroke[]>(storageKey(pageLabel));
    let migrated = false;
    // An existing [] is intentional (the page was cleared), so never reimport
    // legacy spread ink unless the new single-page key has no saved value.
    if (loaded === null && legacyInkRegion) {
      const legacy = readStorage<InkStroke[]>(storageKey(legacyInkRegion.pageLabel));
      if (Array.isArray(legacy)) {
        loaded = remapSplitInk(legacy, legacyInkRegion);
        migrated = true;
      }
    }
    strokesRef.current = Array.isArray(loaded) ? loaded.filter(stroke => stroke && Array.isArray(stroke.points) && Number.isFinite(stroke.width) && stroke.width > 0 && ["pen", "highlighter", "ruler"].includes(stroke.kind) && stroke.points.every(point => point && Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.pressure))) : [];
    historyRef.current = []; setInkWarning(""); refreshCounts(); schedulePaint(true);
    // Keep the old spread key; deferred persistence uses the normal page-scoped
    // warning reporter, including quota/private-browsing errors.
    if (migrated) saveStrokes();
  }, [pageLabel, legacyInkRegion?.pageLabel, legacyInkRegion?.x0, legacyInkRegion?.x1, legacyInkRegion?.y0, legacyInkRegion?.y1, finishGesture, refreshCounts, saveStrokes, schedulePaint, storage]);
  useEffect(() => subscribePaperPreferences<Preferences>(update => {
    // A deferred persistence result is only a warning update, not a new tool
    // selection, and must not interrupt the next in-progress Pencil stroke.
    if (preferencesRef.current !== update.preferences) {
      storage.cancel(PREFERENCES_KEY);
      finishGesture(); preferencesRef.current = update.preferences; writingRef.current = update.preferences.writing;
      setPreferences(update.preferences);
    }
    setPreferencesWarning(update.warning);
  }), [finishGesture, storage]);
  // No mount-time preference writes: inactive pages must never overwrite the global settings.
  const changePreferences = (patch: Partial<Preferences>) => {
    finishGesture();
    const next = { ...preferencesRef.current, ...patch };
    preferencesRef.current = next; writingRef.current = next.writing; setPreferences(next);
    broadcastPaperPreferences({ preferences: next, warning: preferencesWarning });
    storage.enqueue(PREFERENCES_KEY, next, warning => {
      if (preferencesRef.current !== next) return;
      setPreferencesWarning(warning); broadcastPaperPreferences({ preferences: next, warning });
    });
  };
  useLayoutEffect(() => {
    if (!toolbarTargetId || !active) { setToolbarTarget(null); return; }
    const findTarget = () => {
      const target = document.getElementById(toolbarTargetId); setToolbarTarget(target); return !!target;
    };
    if (findTarget() || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(() => { if (findTarget()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [toolbarTargetId, active]);
  useLayoutEffect(() => {
    const viewport = viewportRef.current; const host = hostRef.current; const canvas = canvasRef.current;
    if (!viewport || !host || !canvas) return;
    const measure = () => {
      // Layout dimensions do not change when scale() changes; never use transformed rect sizes here.
      const viewportWidth = viewport.clientWidth; const width = host.clientWidth; const height = host.offsetHeight;
      if (viewportWidth <= 0 || width <= 0 || height <= 0) return;
      setBaseSize(previous => previous.width === viewportWidth && previous.height === height ? previous : { width: viewportWidth, height });
      // Keep normalized ink and paper layout, but release large offscreen bitmaps.
      // A first Pencil contact also restores its bitmap synchronously in down().
      const bounds = host.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement?.clientHeight || 1000;
      if (!activeRef.current && (bounds.bottom < -385 || bounds.top > viewportHeight + 385)) {
        metricsRef.current = { width, height };
        if (canvas.width !== 1 || canvas.height !== 1) { canvas.width = 1; canvas.height = 1; }
        fullRedrawRef.current = true;
        return;
      }
      const bitmap = canvasBitmapSize(width, height, window.devicePixelRatio);
      if (metricsRef.current.width === width && metricsRef.current.height === height && canvas.width === bitmap.width && canvas.height === bitmap.height) return;
      metricsRef.current = { width, height }; canvas.width = bitmap.width; canvas.height = bitmap.height; schedulePaint(true);
    };
    measure(); const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(viewport); observer?.observe(host);
    const visibilityObserver = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(() => measure(), { rootMargin: "384px 0px" }) : null;
    visibilityObserver?.observe(host);
    window.addEventListener("resize", measure); window.addEventListener("orientationchange", measure);
    return () => {
      observer?.disconnect(); visibilityObserver?.disconnect(); window.removeEventListener("resize", measure); window.removeEventListener("orientationchange", measure);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current); frameRef.current = null;
      if (anchorFrameRef.current !== null) window.cancelAnimationFrame(anchorFrameRef.current); anchorFrameRef.current = null; pendingAnchorRef.current = null;
      if (touchScrollFrameRef.current !== null) window.cancelAnimationFrame(touchScrollFrameRef.current); touchScrollFrameRef.current = null; pendingTouchScrollRef.current = { x: 0, y: 0 };
      const touchIds = Array.from(touchesRef.current.keys()); touchesRef.current.clear(); pinchRef.current = null;
      touchIds.forEach(id => releasePointer(canvas, id));
    };
  }, [schedulePaint]);

  const pointFromEvent = (event: PointerEvent, rect: DOMRect): InkPoint | null => !rect.width || !rect.height || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY) ? null : {
    x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
    y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), pressure: pressureFor(event),
  };
  const eraseBetween = (start: InkPoint, end: InkPoint, rect: DOMRect) => {
    const toPixels = (point: InkPoint): PaperPosition => ({ x: point.x * rect.width, y: point.y * rect.height }); const a = toPixels(start); const b = toPixels(end);
    const remaining = strokesRef.current.filter(stroke => {
      const radius = ERASER_RADIUS + stroke.width * rect.width * 1.55 / 2;
      for (let index = 0; index < stroke.points.length; index++) {
        if (segmentDistance(a, b, toPixels(stroke.points[Math.max(0, index - 1)]), toPixels(stroke.points[index])) <= radius) return false;
      }
      return true;
    });
    if (remaining.length !== strokesRef.current.length) { strokesRef.current = remaining; if (activeRef.current) activeRef.current.changed = true; schedulePaint(true); }
  };
  const isPalm = (event: PointerEvent) => {
    if (activeRef.current?.pointerType === "pen") return true;
    const last = lastPenRef.current;
    return !!last && performance.now() - last.time < PALM_DELAY && Math.hypot(event.clientX - last.x, event.clientY - last.y) < PALM_RADIUS;
  };
  const rememberPen = (event: PointerEvent) => {
    lastPenRef.current = { x: event.clientX, y: event.clientY, time: performance.now() };
    touchesRef.current.forEach(touch => { touch.blocked = true; }); pinchRef.current = null; pendingAnchorRef.current = null;
  };
  const appendSamples = (event: PointerEvent) => {
    const gesture = activeRef.current; const canvas = canvasRef.current;
    if (!gesture || gesture.pointerType !== "pen" || event.pointerType !== "pen" || gesture.pointerId !== event.pointerId || !canvas) return;
    const rect = canvas.getBoundingClientRect(); let samples: PointerEvent[] = [];
    try { if (typeof event.getCoalescedEvents === "function") samples = event.getCoalescedEvents(); } catch { /* Unsupported coalesced events. */ }
    for (const sample of [...samples, event]) {
      // An active ID can continue reporting hover after a missing pointerup.
      // Only actual contact samples extend its ink; completion preserves it.
      if (sample.pointerId !== gesture.pointerId || !isInkMove(sample)) continue;
      const point = pointFromEvent(sample, rect); if (!point) continue;
      if (gesture.tool === "eraser") eraseBetween(gesture.lastPoint, point, rect);
      else if (gesture.tool === "ruler") {
        if (gesture.stroke.points.length < 2) gesture.stroke.points.push(point); else gesture.stroke.points[1] = point; gesture.changed = true;
      } else if (point.x !== gesture.lastPoint.x || point.y !== gesture.lastPoint.y) { gesture.stroke.points.push(point); gesture.changed = true; }
      gesture.lastPoint = point;
    }
    if (gesture.pointerType === "pen") rememberPen(event);
    if (gesture.tool !== "eraser") schedulePaint(gesture.tool === "ruler" || gesture.tool === "highlighter");
  };
  const beginPinch = () => {
    const fingers = Array.from(touchesRef.current.entries()).filter(([, touch]) => !touch.blocked);
    if (!touchMayNavigate(activeRef.current) || fingers.length < 2 || !hostRef.current) { pinchRef.current = null; return; }
    // Touch navigation cannot turn a preview into a saved stroke.
    cancelGesture();
    const [first, second] = fingers; const geometry = pinchGeometry(first[1], second[1]); const rect = hostRef.current.getBoundingClientRect();
    pinchRef.current = {
      ids: [first[0], second[0]], distance: Math.max(1, geometry.distance), zoom: zoomRef.current,
      paperPoint: paperCoordinateAt(geometry.midpoint, { x: rect.left, y: rect.top }, zoomRef.current),
    };
  };
  const handlePointerDown = (native: PointerEvent, recovering = false) => {
    const canvas = canvasRef.current; if (!canvas) return;
    if (native.pointerType === "touch") {
      native.preventDefault();
      // Never capture the pen's ownership through a mismatched pointer type.
      if (activeRef.current?.pointerId === native.pointerId) return;
      touchesRef.current.set(native.pointerId, { x: native.clientX, y: native.clientY, blocked: isPalm(native) });
      capturePointer(canvas, native.pointerId);
      if (!pinchRef.current) beginPinch();
      return;
    }
    if (!writingRef.current) return;
    const decision = inkStartDecision(native, activeRef.current, recovering);
    if (decision === "ignore") return;
    // A missing terminal event must not block the next Pencil contact, including
    // platforms that reuse a pen pointer ID across contacts.
    if (decision === "replace") finishGesture();
    const host = hostRef.current;
    const baseWidth = host?.clientWidth ?? 0; const baseHeight = host?.offsetHeight ?? 0;
    if (baseWidth <= 0 || baseHeight <= 0) return;
    // Seed first-frame metrics from untransformed layout, NEVER rect.width at
    // zoom. Re-measure here even before ResizeObserver has delivered its event.
    const bitmap = canvasBitmapSize(baseWidth, baseHeight, window.devicePixelRatio);
    if (metricsRef.current.width !== baseWidth || metricsRef.current.height !== baseHeight || canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
      metricsRef.current = { width: baseWidth, height: baseHeight };
      canvas.width = bitmap.width; canvas.height = bitmap.height; fullRedrawRef.current = true;
    }
    const rect = canvas.getBoundingClientRect();
    const point = pointFromEvent(native, rect);
    if (!point) return;
    native.preventDefault(); touchesRef.current.forEach(touch => { touch.blocked = true; }); pinchRef.current = null;
    if (native.pointerType === "pen") rememberPen(native);
    const prefs = preferencesRef.current;
    const kind = prefs.tool === "highlighter" ? "highlighter" : prefs.tool === "ruler" ? "ruler" : "pen";
    const stroke: InkStroke = { points: [point], color: kind === "highlighter" ? HIGHLIGHTER_COLOR : kind === "ruler" ? "#4b5563" : prefs.color, width: prefs.thickness / baseWidth, kind, opacity: kind === "highlighter" ? 0.3 : undefined };
    activeRef.current = { pointerId: native.pointerId, pointerType: native.pointerType, tool: prefs.tool, stroke, before: strokesRef.current, lastPoint: point, changed: false };
    paintedPointsRef.current = 0;
    // Capture before painting so a synchronous first-dot draw cannot race the
    // browser's leave/capture events. The dot still paints even if capture fails.
    const captured = capturePointer(canvas, native.pointerId);
    if (prefs.tool === "eraser") eraseBetween(point, point, rect);
    else {
      const paintedImmediately = paintFirstPointNow(stroke);
      if (paintedImmediately) paintedPointsRef.current = 1;
      else schedulePaint();
      if (!captured) schedulePaint();
    }
  };
  const handlePointerMove = (native: PointerEvent) => {
    if (native.pointerType === "touch") {
      const touch = touchesRef.current.get(native.pointerId); if (!touch) return;
      native.preventDefault(); const previous = { x: touch.x, y: touch.y }; touch.x = native.clientX; touch.y = native.clientY;
      if (isPalm(native)) { touch.blocked = true; pinchRef.current = null; }
      if (touch.blocked) return;
      const fingers = Array.from(touchesRef.current.values()).filter(finger => !finger.blocked);
      if (fingers.length >= 2) {
        if (!pinchRef.current) beginPinch();
        const pinch = pinchRef.current; if (!pinch) return;
        const first = touchesRef.current.get(pinch.ids[0]); const second = touchesRef.current.get(pinch.ids[1]);
        if (!first || !second || first.blocked || second.blocked) { pinchRef.current = null; return; }
        const geometry = pinchGeometry(first, second); const nextZoom = clampPaperZoom(pinch.zoom * geometry.distance / pinch.distance);
        pendingAnchorRef.current = { zoom: nextZoom, midpoint: geometry.midpoint, paperPoint: pinch.paperPoint };
        if (zoomProp === undefined) setLocalZoom(nextZoom);
        onZoomChange?.(nextZoom);
        scheduleAnchor(); return;
      }
      pinchRef.current = null;
      if (fingers.length === 1 && !activeRef.current) {
        scheduleTouchScroll(previous.x - touch.x, previous.y - touch.y);
      }
      return;
    }
    // Check type BEFORE ownership/hover completion: a mouse with the same ID
    // must not extend, erase or finish the current pen contact.
    if (native.pointerType !== "pen" || !writingRef.current) return;
    if (activeRef.current?.pointerId !== native.pointerId) {
      // Recover a dropped down on either a pressure-bearing contact or a pen
      // down that Safari reported without pressed-button flags, never on hover,
      // mouse motion or touch. Normal down accepts Safari's flags.
      if (isPenContact(native) || isPenButtonDown(native)) handlePointerDown(native, true);
      else return;
    }
    if (activeRef.current?.pointerId !== native.pointerId) return;
    if (!isInkMove(native)) {
      if (native.pointerType === "pen") appendSamples(native);
      finishGesture(native.pointerId); return;
    }
    native.preventDefault(); appendSamples(native);
  };
  const endPointer = (native: PointerEvent, includeTip = false) => {
    if (native.pointerType === "touch") {
      if (activeRef.current?.pointerId === native.pointerId) return;
      touchesRef.current.delete(native.pointerId);
      if (pinchRef.current?.ids.includes(native.pointerId)) pinchRef.current = null;
      releasePointer(canvasRef.current, native.pointerId); return;
    }
    if (native.pointerType !== "pen" || activeRef.current?.pointerType !== "pen" || activeRef.current.pointerId !== native.pointerId) return;
    if (includeTip) appendSamples(native);
    if (native.pointerType === "pen" && lastPenRef.current) lastPenRef.current.time = performance.now();
    // Cancellation/capture loss/uncaptured leave preserve received contact.
    // Only intentional navigation calls cancelGesture to discard a preview.
    finishGesture(native.pointerId);
  };
  const nativeHandlersRef = useRef({ down: handlePointerDown, move: handlePointerMove, end: endPointer });
  useLayoutEffect(() => {
    nativeHandlersRef.current = { down: handlePointerDown, move: handlePointerMove, end: endPointer };
  });
  useLayoutEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const down = (event: PointerEvent) => nativeHandlersRef.current.down(event);
    const move = (event: PointerEvent) => nativeHandlersRef.current.move(event);
    const up = (event: PointerEvent) => nativeHandlersRef.current.end(event, true);
    const cancel = (event: PointerEvent) => nativeHandlersRef.current.end(event);
    const lost = (event: PointerEvent) => {
      // A late lostcapture notification for a replaced contact may arrive
      // after capture has already been reacquired for the new one.
      if (!hasCapture(canvas, event.pointerId)) nativeHandlersRef.current.end(event);
    };
    const leave = (event: PointerEvent) => {
      // A captured Pencil can leave the canvas while still drawing. If capture
      // failed, finish only after the first point has reached the canvas; an
      // immediate leave before the first frame must wait for a terminal event.
      if (activeRef.current?.pointerId === event.pointerId && !hasCapture(canvas, event.pointerId) && paintedPointsRef.current > 0) nativeHandlersRef.current.end(event);
    };
    const fallbackMove = (event: PointerEvent) => {
      if (event.pointerType === "pen" && event.target !== canvas && activeRef.current?.pointerId === event.pointerId) move(event);
    };
    const flush = () => { finishGesture(); storage.flush(); };
    const visibility = () => { if (document.visibilityState === "hidden") flush(); };
    const options = { capture: true, passive: false };
    canvas.addEventListener("pointerdown", down, options);
    canvas.addEventListener("pointermove", move, options);
    canvas.addEventListener("pointerup", up, options);
    canvas.addEventListener("pointercancel", cancel, options);
    canvas.addEventListener("lostpointercapture", lost, options);
    canvas.addEventListener("pointerleave", leave, options);
    // Native window capture sees terminal events even if React/the canvas
    // loses them. takeInkSession makes fallback and canvas completion once-only.
    window.addEventListener("pointerup", up, options);
    window.addEventListener("pointercancel", cancel, options);
    window.addEventListener("pointermove", fallbackMove, options);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      canvas.removeEventListener("pointerdown", down, true);
      canvas.removeEventListener("pointermove", move, true);
      canvas.removeEventListener("pointerup", up, true);
      canvas.removeEventListener("pointercancel", cancel, true);
      canvas.removeEventListener("lostpointercapture", lost, true);
      canvas.removeEventListener("pointerleave", leave, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", cancel, true);
      window.removeEventListener("pointermove", fallbackMove, true);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", visibility);
      flush();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current); frameRef.current = null;
      if (touchScrollFrameRef.current !== null) window.cancelAnimationFrame(touchScrollFrameRef.current); touchScrollFrameRef.current = null; pendingTouchScrollRef.current = { x: 0, y: 0 };
    };
  }, [finishGesture, scheduleTouchScroll, storage]);
  useEffect(() => { if (!active) finishGesture(); }, [active, finishGesture]);
  const chooseTool = (next: InkTool) => changePreferences({ tool: next });
  const undo = () => {
    finishGesture(); const previous = historyRef.current.pop(); if (!previous) return;
    strokesRef.current = previous; saveStrokes(); refreshCounts(); schedulePaint(true);
  };
  const clear = () => {
    finishGesture(); if (!strokesRef.current.length) return;
    historyRef.current.push(strokesRef.current); strokesRef.current = []; saveStrokes();
    refreshCounts(); schedulePaint(true);
  };
  const buttonClass = (selected: boolean) => `ink-button${selected ? " is-active" : ""}`;
  const toolbar = <div className="ink-toolbar" role="toolbar" aria-label={`${pageLabel}：批註工具列`} style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 4, padding: 4, marginBottom: toolbarTarget ? 0 : 4, overflowX: "auto", maxWidth: "100%", minWidth: 0 }}>
    <button type="button" className={buttonClass(writing)} style={controlStyle} title={writing ? "切換至閱讀模式" : "切換至書寫模式"} aria-label={writing ? "切換至閱讀模式" : "切換至書寫模式"} aria-pressed={writing} onClick={() => changePreferences({ writing: !writingRef.current })}>{writing ? <span style={{ fontSize: 14 }}>寫</span> : <BookOpen size={18} />}</button>
    <button type="button" className="ink-button ink-tool-toggle" style={{ ...controlStyle, width: 52 }} title={tool === "eraser" ? "切換為畫筆" : "切換為橡皮擦"} aria-label={tool === "eraser" ? "切換為畫筆" : "切換為橡皮擦"} aria-pressed={tool === "eraser"} disabled={!writing} onClick={() => chooseTool(tool === "eraser" ? "pen" : "eraser")}>{tool === "eraser" ? <Pencil size={18} /> : <Eraser size={18} />}<span className="ink-tool-toggle-label">{tool === "eraser" ? "筆" : "擦"}</span></button>
    <button type="button" className={buttonClass(tool === "pen")} style={controlStyle} title="畫筆" aria-label="畫筆" aria-pressed={tool === "pen"} disabled={!writing} onClick={() => chooseTool("pen")}><Pencil size={18} /></button>
    <button type="button" className={buttonClass(tool === "eraser")} style={controlStyle} title="擦膠：擦除整條筆跡" aria-label="擦膠：擦除整條筆跡" aria-pressed={tool === "eraser"} disabled={!writing} onClick={() => chooseTool("eraser")}><Eraser size={18} /></button>
    <button type="button" className={buttonClass(tool === "highlighter")} style={controlStyle} title="螢光筆" aria-label="螢光筆" aria-pressed={tool === "highlighter"} disabled={!writing} onClick={() => chooseTool("highlighter")}><Highlighter size={18} /></button>
    <button type="button" className={buttonClass(tool === "ruler")} style={controlStyle} title="尺規：畫直線" aria-label="尺規：畫直線" aria-pressed={tool === "ruler"} disabled={!writing} onClick={() => chooseTool("ruler")}><Ruler size={18} /></button>
    <div role="group" aria-label="筆跡顏色" style={{ display: "flex", flexWrap: "nowrap", gap: 2, flexShrink: 0 }}>{COLORS.map(option => <button key={option.value} type="button" className={`${buttonClass(color === option.value)} ${option.className}`} style={controlStyle} title={`${option.name}筆跡`} aria-label={`${option.name}筆跡`} aria-pressed={color === option.value} disabled={!writing} onClick={() => changePreferences({ color: option.value })}><span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: option.value }} /></button>)}</div>
    <label htmlFor={thicknessId} style={hiddenStyle}>粗幼</label><select id={thicknessId} className="ink-thickness" style={{ ...controlStyle, width: 68, padding: "0 4px" }} title="畫筆粗幼" aria-label="畫筆粗幼" disabled={!writing} value={thickness} onChange={event => changePreferences({ thickness: Number(event.target.value) })}><option value={1.5}>幼</option><option value={2.5}>中</option><option value={4}>粗</option><option value={6}>特粗</option></select>
    <button type="button" className="ink-button" style={controlStyle} title="復原上一步批註" aria-label={`復原${pageLabel}的上一步批註`} disabled={undoCount === 0} onClick={undo}><Undo2 size={18} /></button>
    <span className="ink-stroke-count" aria-live="polite" aria-atomic="true" style={{ fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}>筆跡 {strokeCount}</span>
    <details className="ink-more" style={{ flexShrink: 0 }}>
      <summary className="ink-button" title="更多批註選項" aria-label="更多批註選項" style={{ ...controlStyle, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", listStyle: "none" }}><Ellipsis size={18} /></summary>
      <div style={{ position: "fixed", zIndex: 50, padding: 8, background: "var(--surface, white)", border: "1px solid var(--border-subtle, #ddd)", borderRadius: 8, boxShadow: "0 4px 16px #0002" }}>
        <button type="button" className="ink-button" style={{ ...controlStyle, width: "auto", padding: "0 12px", whiteSpace: "nowrap" }} title="清除此頁筆跡" aria-label={`清除此頁筆跡：${pageLabel}`} disabled={strokeCount === 0} onClick={clear}><Trash2 size={16} />清除此頁</button>
      </div>
    </details>
  </div>;

  return <div className="annotatable-paper" data-writing={writing ? "true" : "false"} style={{ width: "100%", minWidth: 0 }}>
    {(!toolbarTargetId || active) && (toolbarTarget ? createPortal(toolbar, toolbarTarget) : toolbar)}
    {(inkWarning || (preferencesWarning && (!toolbarTargetId || active))) && <p className="ink-storage-warning" role="alert" style={{ margin: "4px 0", fontSize: 12, color: "#b45309" }}>{inkWarning || preferencesWarning}</p>}
    <div ref={viewportRef} className="paper-zoom-viewport" style={{ position: "relative", width: "100%", maxWidth: "100%", minWidth: 0, overflowX: "auto", overflowY: "hidden", overscrollBehaviorX: "contain", touchAction: "none" }}>
      <div className="paper-zoom-spacer" style={{ position: "relative", width: baseSize.width ? Math.max(baseSize.width, baseSize.width * zoom) : "100%", height: baseSize.height * zoom }}>
        <div ref={hostRef} className="annotatable-paper-page paper-zoom-content" style={{ position: "absolute", top: 0, left: baseSize.width && zoom < 1 ? baseSize.width * (1 - zoom) / 2 : 0, width: baseSize.width || "100%", transform: `scale(${zoom})`, transformOrigin: "top left" }}>
          {children}
          <canvas ref={canvasRef} className="paper-ink-canvas" data-strokes={strokeCount} role="img" aria-label={`${pageLabel}：${writing ? "書寫" : "閱讀"}模式的批註畫布；只限 Pencil 書寫／擦除；手指可拖動／縮放`} title="只限 Pencil 書寫／擦除；手指可拖動／縮放" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", background: "transparent", zIndex: 2, pointerEvents: "auto", touchAction: "none", cursor: writing ? (tool === "eraser" ? "cell" : "crosshair") : "grab", userSelect: "none" }} />
        </div>
      </div>
    </div>
  </div>;
}

export default AnnotatablePaper;
