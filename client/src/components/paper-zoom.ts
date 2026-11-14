export const MIN_PAPER_ZOOM = .25;
export const MAX_PAPER_ZOOM = 3;
export const MAX_CANVAS_PIXELS = 5_000_000;

export type PaperPosition = { x: number; y: number };
export type PinchGeometry = { distance: number; midpoint: PaperPosition };

export function clampPaperZoom(zoom: number): number {
  return Number.isFinite(zoom) ? Math.min(MAX_PAPER_ZOOM, Math.max(MIN_PAPER_ZOOM, zoom)) : 1;
}

/** Bitmap dimensions must come from untransformed layout sizes, never a DOMRect. */
export function canvasBitmapSize(width: number, height: number, deviceRatio = 1) {
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 1;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 1;
  const ratio = Math.min(
    Number.isFinite(deviceRatio) ? Math.max(1, deviceRatio) : 1,
    2,
    Math.sqrt(MAX_CANVAS_PIXELS / safeWidth / safeHeight),
  );
  const bitmapWidth = Math.min(MAX_CANVAS_PIXELS, Math.max(1, Math.floor(safeWidth * ratio)));
  const bitmapHeight = Math.min(Math.floor(MAX_CANVAS_PIXELS / bitmapWidth), Math.max(1, Math.floor(safeHeight * ratio)));
  return { width: bitmapWidth, height: bitmapHeight };
}

export function pinchGeometry(first: PaperPosition, second: PaperPosition): PinchGeometry {
  return {
    distance: Math.hypot(second.x - first.x, second.y - first.y),
    midpoint: { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 },
  };
}

/** Paper coordinates are unscaled CSS pixels; rect left/top include current scroll. */
export function paperCoordinateAt(midpoint: PaperPosition, origin: PaperPosition, zoom: number): PaperPosition {
  const scale = clampPaperZoom(zoom);
  return { x: (midpoint.x - origin.x) / scale, y: (midpoint.y - origin.y) / scale };
}

export function anchorScrollDelta(paperPoint: PaperPosition, midpoint: PaperPosition, origin: PaperPosition, zoom: number): PaperPosition {
  const scale = clampPaperZoom(zoom);
  return { x: origin.x + paperPoint.x * scale - midpoint.x, y: origin.y + paperPoint.y * scale - midpoint.y };
}

const PREFERENCES_EVENT = "dse-physics-ink-preferences-change";
export type PaperPreferencesUpdate<T> = { preferences: T; warning: string };

/** Subscribers only update local state; the explicit UI action is the sole writer. */
export function subscribePaperPreferences<T>(listener: (update: PaperPreferencesUpdate<T>) => void): () => void {
  const onChange = (event: Event) => listener((event as CustomEvent<PaperPreferencesUpdate<T>>).detail);
  window.addEventListener(PREFERENCES_EVENT, onChange);
  return () => window.removeEventListener(PREFERENCES_EVENT, onChange);
}

export function broadcastPaperPreferences<T>(update: PaperPreferencesUpdate<T>): void {
  window.dispatchEvent(new CustomEvent(PREFERENCES_EVENT, { detail: update }));
}
