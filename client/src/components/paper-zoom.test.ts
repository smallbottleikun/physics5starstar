import { afterEach, describe, expect, it, vi } from "vitest";
import { anchorScrollDelta, broadcastPaperPreferences, canvasBitmapSize, clampPaperZoom, MAX_CANVAS_PIXELS, paperCoordinateAt, pinchGeometry, subscribePaperPreferences } from "./paper-zoom";

afterEach(() => vi.unstubAllGlobals());

describe("paper zoom", () => {
  it("clamps zoom to the supported 100–300% range, including invalid inputs", () => {
    expect([0, 1, 1.5, 3, 8, NaN, Infinity].map(clampPaperZoom)).toEqual([1, 1, 1.5, 3, 3, 1, 1]);
  });

  it("measures pinch distance and midpoint", () => {
    expect(pinchGeometry({ x: 10, y: 20 }, { x: 40, y: 60 })).toEqual({ distance: 50, midpoint: { x: 25, y: 40 } });
  });

  it("keeps the original paper coordinate under a moving midpoint after scale and page layout changes", () => {
    const point = paperCoordinateAt({ x: 150, y: 300 }, { x: -50, y: 100 }, 2);
    expect(point).toEqual({ x: 100, y: 100 });
    // Earlier pages growing in a shared zoom can also shift this page's top.
    const newOrigin = { x: -50, y: 700 };
    const midpoint = { x: 180, y: 320 };
    const delta = anchorScrollDelta(point, midpoint, newOrigin, 3);
    expect(delta).toEqual({ x: 70, y: 680 });
    expect(paperCoordinateAt(midpoint, { x: newOrigin.x - delta.x, y: newOrigin.y - delta.y }, 3)).toEqual(point);
  });

  it("uses base paper dimensions independent of CSS zoom", () => {
    expect(canvasBitmapSize(800, 1100, 2)).toEqual({ width: 1600, height: 2200 });
    expect(canvasBitmapSize(800, 1100, 4)).toEqual(canvasBitmapSize(800, 1100, 2));
    expect(canvasBitmapSize(800, 1100, NaN)).toEqual({ width: 800, height: 1100 });
  });

  it("never exceeds the finite canvas pixel budget, even with extreme inputs", () => {
    for (const [width, height, ratio] of [[2048, 2896, 3], [10000, 14000, 2], [1e12, 1, 2], [1, 1e12, 2], [Number.MAX_VALUE, Number.MAX_VALUE, 3], [0, -1, NaN], [Infinity, NaN, Infinity]]) {
      const bitmap = canvasBitmapSize(width, height, ratio);
      expect(Number.isInteger(bitmap.width)).toBe(true);
      expect(Number.isInteger(bitmap.height)).toBe(true);
      expect(bitmap.width).toBeGreaterThanOrEqual(1);
      expect(bitmap.height).toBeGreaterThanOrEqual(1);
      expect(bitmap.width * bitmap.height).toBeLessThanOrEqual(MAX_CANVAS_PIXELS);
    }
  });
});

describe("shared ink preferences", () => {
  it("broadcasts state to every page without storage writes and supports unsubscribe", () => {
    const events = new EventTarget();
    class DetailEvent extends Event {
      detail: unknown;
      constructor(type: string, options: { detail: unknown }) { super(type); this.detail = options.detail; }
    }
    vi.stubGlobal("window", events);
    vi.stubGlobal("CustomEvent", DetailEvent);
    const first = vi.fn(); const second = vi.fn();
    const unsubscribeFirst = subscribePaperPreferences(first);
    const unsubscribeSecond = subscribePaperPreferences(second);
    const update = { preferences: { writing: false, color: "#dc2626" }, warning: "storage unavailable" };
    broadcastPaperPreferences(update);
    expect(first).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenCalledWith(update);
    expect(second).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith(update);
    unsubscribeFirst(); broadcastPaperPreferences(update);
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(2);
    unsubscribeSecond();
  });
});
