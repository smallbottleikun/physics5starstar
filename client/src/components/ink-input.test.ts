import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDeferredInkStorage, inkStartDecision, isInkMove, isPenContact, takeInkSession, touchMayNavigate } from "./ink-input";

// Exercise the actual component's effects/native handlers without a browser or
// adding a DOM dependency. The hook runner retains refs/state/dependency arrays;
// EventTarget supplies real add/removeEventListener/dispatchEvent behavior.
const hookContext = vi.hoisted(() => ({ current: null as any }));
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  const cell = () => {
    const runtime = hookContext.current;
    const index = runtime.cursor++;
    return { runtime, index, previous: runtime.cells[index] };
  };
  const unchanged = (a: unknown[] | undefined, b: unknown[] | undefined) => !!a && !!b && a.length === b.length && a.every((value, index) => Object.is(value, b[index]));
  const effect = (callback: () => void | (() => void), deps?: unknown[]) => {
    const { runtime, index, previous } = cell();
    if (previous && unchanged(previous.deps, deps)) return;
    runtime.effects.push(() => {
      previous?.cleanup?.();
      runtime.cells[index] = { deps, cleanup: callback() };
    });
  };
  return {
    ...actual,
    useRef(value: unknown) {
      const { runtime, index, previous } = cell();
      const refIndex = runtime.refCount++;
      return previous ?? (runtime.cells[index] = { current: refIndex < 3 ? runtime.elements[refIndex] : value });
    },
    useState(initial: unknown) {
      const { runtime, index, previous } = cell();
      const state = previous ?? (runtime.cells[index] = { value: typeof initial === "function" ? initial() : initial });
      return [state.value, (next: any) => { state.value = typeof next === "function" ? next(state.value) : next; }];
    },
    useCallback(callback: unknown, deps: unknown[]) {
      const { runtime, index, previous } = cell();
      return previous && unchanged(previous.deps, deps) ? previous.callback : (runtime.cells[index] = { deps, callback }).callback;
    },
    useEffect: effect,
    useLayoutEffect: effect,
    useId: () => "test-ink-thickness",
  };
});
import { AnnotatablePaper } from "./AnnotatablePaper";
import type { AnnotatablePaperProps } from "./AnnotatablePaper";

const pen = (overrides: Partial<PointerEvent> = {}) => ({ pointerId: 7, pointerType: "pen", button: 0, buttons: 1, pressure: 0.6, ...overrides });
function pointer(type: string, overrides: Partial<PointerEvent> = {}) {
  const event = new Event(type, { cancelable: true });
  Object.assign(event, { ...pen(), clientX: 160, clientY: 120, getCoalescedEvents: () => [], ...overrides });
  return event;
}

function findElement(tree: any, predicate: (element: any) => boolean): any {
  if (!tree || typeof tree !== "object") return null;
  if (Array.isArray(tree)) {
    for (const child of tree) { const found = findElement(child, predicate); if (found) return found; }
    return null;
  }
  return predicate(tree) ? tree : findElement(tree.props?.children, predicate);
}

function mountPaper({ zoom = 1, captureFails = false, lateMetrics = false, initialSaved = {}, legacyInkRegion }: {
  zoom?: number;
  captureFails?: boolean;
  lateMetrics?: boolean;
  initialSaved?: Record<string, string>;
  legacyInkRegion?: AnnotatablePaperProps["legacyInkRegion"];
} = {}) {
  const saved = new Map<string, string>(Object.entries(initialSaved));
  const localStorage = {
    getItem: vi.fn((key: string) => saved.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { saved.set(key, value); }),
  };
  const frames = new Map<number, FrameRequestCallback>(); let frameId = 0;
  const win = Object.assign(new EventTarget(), {
    localStorage, devicePixelRatio: 4, scrollBy: vi.fn(),
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => { frames.set(++frameId, callback); return frameId; }),
    cancelAnimationFrame: vi.fn((id: number) => frames.delete(id)),
  });
  const doc = Object.assign(new EventTarget(), { visibilityState: "visible", getElementById: () => null });
  vi.stubGlobal("window", win); vi.stubGlobal("document", doc);
  // Used by preference broadcast; no platform-specific hardware APIs involved.
  vi.stubGlobal("CustomEvent", class extends Event {
    detail: unknown;
    constructor(type: string, options: { detail?: unknown } = {}) { super(type); this.detail = options.detail; }
  });
  const viewport = { clientWidth: lateMetrics ? 0 : 800, scrollLeft: 0 };
  const host = {
    clientWidth: lateMetrics ? 0 : 800, offsetHeight: lateMetrics ? 0 : 1000,
    getBoundingClientRect: () => ({ left: 100, top: 80, width: 800 * zoom, height: 1000 * zoom }),
  };
  const context = Object.fromEntries(["save", "restore", "setTransform", "clearRect", "beginPath", "arc", "fill", "moveTo", "lineTo", "stroke"].map(name => [name, vi.fn()]));
  const captured = new Set<number>();
  const canvas = Object.assign(new EventTarget(), {
    width: 0, height: 0,
    getContext: () => context,
    getBoundingClientRect: host.getBoundingClientRect,
    hasPointerCapture: vi.fn((id: number) => captured.has(id)),
    setPointerCapture: vi.fn((id: number) => { if (captureFails) throw new Error("capture unavailable"); captured.add(id); }),
    releasePointerCapture: vi.fn((id: number) => {
      captured.delete(id);
      canvas.dispatchEvent(pointer("lostpointercapture", { pointerId: id, buttons: 0, pressure: 0 }));
    }),
  });
  const runtime = { cursor: 0, refCount: 0, cells: [] as any[], effects: [] as (() => void)[], elements: [viewport, host, canvas] };
  const onZoomChange = vi.fn();
  const render = (pageLabel = "test-pencil", region = legacyInkRegion) => {
    runtime.cursor = 0; runtime.refCount = 0; hookContext.current = runtime;
    const tree = AnnotatablePaper({ children: null, pageLabel, zoom, onZoomChange, legacyInkRegion: region });
    while (runtime.effects.length) runtime.effects.shift()!();
    return tree;
  };
  render();
  if (lateMetrics) { viewport.clientWidth = 800; host.clientWidth = 800; host.offsetHeight = 1000; }
  const emit = (type: string, values: Partial<PointerEvent> = {}, target: EventTarget = canvas) => target.dispatchEvent(pointer(type, values));
  const ink = (page = "test-pencil") => JSON.parse(saved.get(`dse-physics-ink-v2:${page}`) ?? "[]") as { points: { x: number; y: number }[]; width: number; color: string }[];
  const paint = () => { const batch = Array.from(frames.values()); frames.clear(); batch.forEach(callback => callback(0)); };
  const unmount = () => runtime.cells.forEach(cell => cell?.cleanup?.());
  return { canvas, host, win, doc, viewport, saved, localStorage, emit, ink, paint, context, frames, render, unmount, onZoomChange };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); hookContext.current = null; });

describe("Pencil lifecycle policy", () => {
  it("accepts explicit Safari pen down with unusual button flags", () => {
    expect(inkStartDecision(pen({ button: -1, buttons: 0, pressure: 0 }), null)).toBe("start");
  });
  it.each(["touch", "mouse", ""])("rejects %s ink even with pressure and tip/eraser contact flags", pointerType => {
    for (const buttons of [1, 32]) {
      const input = pen({ pointerType, pressure: 0.8, buttons });
      expect(isPenContact(input)).toBe(false);
      expect(isInkMove(input)).toBe(false);
      for (const active of [null, { pointerId: 7, pointerType: "pen" }]) {
        expect(inkStartDecision(input, active)).toBe("ignore");
        expect(inkStartDecision(input, active, true)).toBe("ignore");
      }
    }
    expect(isInkMove(pen({ pointerType, pressure: 0, buttons: 1 }))).toBe(false);
  });
  it("flushes stale pen contacts, including a reused pointer ID", () => {
    expect(inkStartDecision(pen(), { pointerId: 7, pointerType: "pen" })).toBe("replace");
    expect(inkStartDecision(pen({ pointerId: 8 }), { pointerId: 7, pointerType: "pen" })).toBe("replace");
  });
  it("never starts ink from touch or hover and recovers only pressure plus contact", () => {
    expect(inkStartDecision(pen({ pointerType: "touch" }), null)).toBe("ignore");
    for (const flags of [{ pressure: 0, buttons: 0 }, { pressure: 0.5, buttons: 0 }, { pressure: 0, buttons: 1 }]) {
      expect(isPenContact(pen(flags))).toBe(false);
      expect(inkStartDecision(pen(flags), null, true)).toBe("ignore");
    }
    expect(isPenContact(pen({ buttons: 32 }))).toBe(true);
    expect(inkStartDecision(pen(), null, true)).toBe("start");
    expect(isInkMove(pen({ pressure: 0, buttons: 0 }))).toBe(false);
    expect(touchMayNavigate({ pointerId: 7, pointerType: "pen" })).toBe(false);
  });
  it("takes a session exactly once before re-entrant completion and ignores other IDs", () => {
    const session = { pointerId: 7, pointerType: "pen" };
    const ref = { current: session as typeof session | null };
    expect(takeInkSession(ref, 8)).toBeNull();
    expect(takeInkSession(ref, 7)).toBe(session);
    expect(takeInkSession(ref, 7)).toBeNull();
  });
});

describe("actual native annotation handlers", () => {
  it.each(["touch", "mouse", ""])("%s cannot create a preview or erase saved ink with pressure", pointerType => {
    const h = mountPaper(); h.paint(); h.context.arc.mockClear();
    h.emit("pointerdown", { pointerType, pressure: 0.8 });
    h.emit("pointermove", { pointerType, pressure: 0.8, clientX: 180 });
    h.emit("pointerup", { pointerType, pressure: 0.8 }, h.win);
    h.paint();
    expect(h.context.arc).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(0);
    h.emit("pointerdown"); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(1);
    findElement(h.render(), element => element.props?.title === "擦膠：擦除整條筆跡").props.onClick();
    const original = h.ink();
    h.emit("pointerdown", { pointerType, pressure: 0.8, button: 5, buttons: 32 });
    h.emit("pointermove", { pointerType, pressure: 0.8, buttons: 32, clientX: 180 });
    h.emit("pointerup", { pointerType, pressure: 0.8 }, h.win);
    h.emit("pointercancel", { pointerType }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()).toEqual(original);
    expect(findElement(h.render(), element => element.type === "canvas").props["data-strokes"]).toBe(1);
    h.unmount();
  });
  it.each(["pointerup", "pointercancel"])("explicit zero-pressure Safari down saves its first dot on %s", ending => {
    const h = mountPaper(); h.paint(); h.context.arc.mockClear();
    h.emit("pointerdown", { pressure: 0, button: -1, buttons: 0 });
    h.paint(); expect(h.context.arc).toHaveBeenCalledTimes(1);
    h.emit(ending, { pressure: 0, button: -1, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(1); expect(h.ink()[0].points).toHaveLength(1);
    h.unmount();
  });
  it.each(["pen", "eraser"] as const)("same-ID non-pen events cannot disturb an active %s contact", tool => {
    for (const pointerType of ["touch", "mouse", ""]) {
      for (const captureFails of [false, true]) {
        const h = mountPaper({ captureFails });
        if (tool === "eraser") {
          for (const clientX of [160, 400]) {
            h.emit("pointerdown", { clientX }); h.emit("pointerup", { clientX, pressure: 0, buttons: 0 }, h.win);
          }
          findElement(h.render(), element => element.props?.title === "擦膠：擦除整條筆跡").props.onClick();
          vi.advanceTimersByTime(120);
        }
        h.localStorage.setItem.mockClear();
        h.emit("pointerdown");
        h.emit("pointerdown", { pointerType, clientX: 400, pressure: 0.8, buttons: 32 });
        h.emit("pointermove", { pointerType, clientX: 400, pressure: 0.8, buttons: 32 });
        h.emit("pointermove", { pointerType, clientX: 400, pressure: 0, buttons: 0 }, h.win);
        for (const ending of ["pointerup", "pointercancel", "lostpointercapture", "pointerleave"]) {
          h.emit(ending, { pointerType, clientX: 400, pressure: 0.8, buttons: 32 });
        }
        h.emit("pointerup", { pointerType, clientX: 400, pressure: 0.8 }, h.win);
        h.emit("pointercancel", { pointerType }, h.win);
        vi.advanceTimersByTime(120); expect(h.localStorage.setItem).not.toHaveBeenCalled();
        h.emit("pointermove", { clientX: 200 });
        h.emit("pointerup", { clientX: 200, pressure: 0, buttons: 0 }, h.win);
        vi.advanceTimersByTime(120);
        expect(h.ink()).toHaveLength(1);
        if (tool === "pen") expect(h.ink()[0].points.map(point => point.x)).toEqual([0.075, 0.125]);
        else expect(h.ink()[0].points[0].x).toBe(0.375);
        expect(h.localStorage.setItem).toHaveBeenCalledTimes(1);
        h.unmount();
      }
    }
  });
  it.each(["pen", "eraser"] as const)("filters non-pen and mismatched-ID coalesced samples during %s contact", tool => {
    const h = mountPaper();
    if (tool === "eraser") {
      h.emit("pointerdown", { clientX: 400 }); h.emit("pointerup", { clientX: 400, pressure: 0, buttons: 0 }, h.win);
      findElement(h.render(), element => element.props?.title === "擦膠：擦除整條筆跡").props.onClick();
      vi.advanceTimersByTime(120);
    }
    h.emit("pointerdown");
    h.emit("pointermove", {
      clientX: 200,
      getCoalescedEvents: () => [
        ...["touch", "mouse", ""].map(pointerType => ({ ...pen({ pointerType }), clientX: 400, clientY: 120 } as PointerEvent)),
        { ...pen({ pointerId: 99 }), clientX: 400, clientY: 120 } as PointerEvent,
        { ...pen(), clientX: 180, clientY: 120 } as PointerEvent,
      ],
    });
    h.emit("pointerup", { clientX: 200, pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(1);
    if (tool === "pen") expect(h.ink()[0].points.map(point => point.x)).toEqual([0.075, 0.1, 0.125]);
    else expect(h.ink()[0].points[0].x).toBe(0.375);
    h.unmount();
  });
  it.each(["pointercancel", "lostpointercapture", "pointerleave"])("preserves actual pen contact on %s and completes once", ending => {
    const h = mountPaper({ captureFails: ending !== "pointercancel" });
    h.emit("pointerdown"); h.emit("pointermove", { clientX: 180 });
    h.emit(ending, { pressure: 0, buttons: 0 });
    h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    h.emit("pointercancel", { pressure: 0, buttons: 0 });
    expect(h.localStorage.setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(1);
    expect(h.ink()[0].points).toHaveLength(2);
    expect(h.localStorage.setItem).toHaveBeenCalledTimes(1);
    h.unmount();
  });
  it("window fallback completes a captured stroke even when canvas receives no up", () => {
    const h = mountPaper();
    h.emit("pointerdown"); h.emit("pointermove", { clientX: 200 }, h.win);
    h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    h.emit("pointerup", { pressure: 0, buttons: 0 });
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(1);
    expect(h.ink()[0].points).toHaveLength(2);
    h.unmount();
  });
  it.each([7, 8])("a new down replaces stale pen ID %s without rejecting the next stroke", nextId => {
    const h = mountPaper();
    h.emit("pointerdown"); h.emit("pointermove", { clientX: 180 });
    h.emit("pointerdown", { pointerId: nextId, clientX: 220 });
    h.emit("pointermove", { pointerId: nextId, clientX: 240 });
    h.emit("pointerup", { pointerId: nextId, pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(2);
    expect(h.ink().map(stroke => stroke.points.length)).toEqual([2, 2]);
    h.unmount();
  });
  it("ignores delayed lostcapture from stale contact when a reused ID is recaptured", () => {
    const h = mountPaper(); h.emit("pointerdown");
    h.emit("pointerdown", { clientX: 200 });
    h.emit("lostpointercapture", { buttons: 0, pressure: 0 });
    h.emit("pointermove", { clientX: 220 });
    h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(2); expect(h.ink()[1].points).toHaveLength(2);
    h.unmount();
  });
  it("failed capture still schedules the first dot and commits on leave", () => {
    const h = mountPaper({ captureFails: true }); h.paint();
    h.context.arc.mockClear();
    h.emit("pointerdown", { button: -1, buttons: 0, pressure: 0 });
    expect(h.frames.size).toBeGreaterThan(0);
    h.paint(); expect(h.context.arc).toHaveBeenCalled();
    h.emit("pointerleave", { pressure: 0, buttons: 0 });
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(1);
    h.unmount();
  });
  it("does not end a captured pen just because it leaves canvas bounds", () => {
    const h = mountPaper(); h.emit("pointerdown");
    h.emit("pointerleave", { pressure: 0, buttons: 0 });
    vi.advanceTimersByTime(120); expect(h.localStorage.setItem).not.toHaveBeenCalled();
    h.emit("pointermove", { clientX: 200 }); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()[0].points).toHaveLength(2);
    h.unmount();
  });
  it("touch and hover never create ink; pressure-bearing pen move recovers missing down", () => {
    const h = mountPaper();
    h.emit("pointerdown", { pointerType: "touch", pointerId: 1 });
    h.emit("pointermove", { pointerType: "touch", pointerId: 1, clientX: 180 });
    h.emit("pointerup", { pointerType: "touch", pointerId: 1 }, h.win);
    for (const flags of [{ pressure: 0, buttons: 0 }, { pressure: 0.5, buttons: 0 }, { pressure: 0, buttons: 1 }]) h.emit("pointermove", flags);
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(0);
    h.emit("pointermove", { clientX: 200 });
    h.emit("pointermove", { clientX: 220 });
    h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(1);
    expect(h.ink()[0].points).toHaveLength(2);
    h.unmount();
  });
  it("hover closes stale ink without adding a ghost endpoint", () => {
    const h = mountPaper(); h.emit("pointerdown");
    h.emit("pointermove", { clientX: 240, pressure: 0, buttons: 0 });
    h.emit("pointermove", { clientX: 260, pressure: 0, buttons: 0 });
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(1); expect(h.ink()[0].points).toHaveLength(1);
    h.unmount();
  });
  it("touch palms and their cancellation cannot discard the active pen", () => {
    const h = mountPaper(); h.emit("pointerdown");
    h.emit("pointerdown", { pointerId: 1, pointerType: "touch", clientX: 170 });
    h.emit("pointerdown", { pointerId: 2, pointerType: "touch", clientX: 600 });
    h.emit("pointermove", { pointerId: 2, pointerType: "touch", clientX: 650 });
    h.emit("pointercancel", { pointerId: 1, pointerType: "touch" }, h.win);
    h.emit("pointermove", { clientX: 200 });
    h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(1); expect(h.ink()[0].points).toHaveLength(2);
    h.unmount();
  });
  it("mouse cannot establish a preview and one-/two-touch navigation produces no ink", () => {
    const h = mountPaper(); h.paint(); h.context.arc.mockClear();
    h.emit("pointerdown", { pointerId: 9, pointerType: "mouse" });
    h.emit("pointermove", { pointerId: 9, pointerType: "mouse", clientX: 180 });
    h.paint(); expect(h.context.arc).not.toHaveBeenCalled();
    expect(h.canvas.setPointerCapture).not.toHaveBeenCalled();
    h.emit("pointerdown", { pointerId: 1, pointerType: "touch" });
    h.emit("pointermove", { pointerId: 1, pointerType: "touch", clientX: 180, clientY: 140 });
    expect(h.viewport.scrollLeft).toBe(-20); expect(h.win.scrollBy).toHaveBeenCalled();
    h.emit("pointerdown", { pointerId: 2, pointerType: "touch", clientX: 300 });
    h.emit("pointermove", { pointerId: 2, pointerType: "touch", clientX: 360 });
    expect(h.onZoomChange).toHaveBeenCalledWith(expect.any(Number));
    h.emit("pointerup", { pointerId: 9, pointerType: "mouse" }, h.win);
    h.emit("pointerup", { pointerId: 1, pointerType: "touch" }, h.win);
    h.emit("pointerup", { pointerId: 2, pointerType: "touch" }, h.win);
    h.paint(); expect(h.context.arc).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(0);
    expect(h.localStorage.setItem).not.toHaveBeenCalled();
    h.unmount();
  });
  it.each([0.25, 2])("seeds late metrics from unscaled host at zoom %s and caps bitmap", zoom => {
    const h = mountPaper({ zoom, lateMetrics: true });
    h.emit("pointerdown"); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()[0].width).toBe(2.5 / 800);
    expect(h.canvas.width).toBeGreaterThan(0); expect(h.canvas.width).toBeLessThanOrEqual(4096);
    expect(h.canvas.height).toBeGreaterThan(0); expect(h.canvas.height).toBeLessThanOrEqual(4096);
    h.unmount();
  });
  it.each(["pagehide", "visibilitychange"])("flushes both active ink and deferred writes on %s", type => {
    const h = mountPaper(); h.emit("pointerdown");
    if (type === "visibilitychange") { h.doc.visibilityState = "hidden"; h.doc.dispatchEvent(new Event(type)); }
    else h.win.dispatchEvent(new Event(type));
    expect(h.ink()).toHaveLength(1); expect(h.localStorage.setItem).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(120); expect(h.localStorage.setItem).toHaveBeenCalledTimes(1);
    h.unmount();
  });
  it("page changes flush old ink under its original key and do not leak into the new page", () => {
    const h = mountPaper(); h.emit("pointerdown"); h.render("other-page");
    expect(h.ink()).toHaveLength(1); expect(h.ink("other-page")).toHaveLength(0);
    h.emit("pointerdown"); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink("other-page")).toHaveLength(1);
    h.unmount();
  });
  it("keeps immutable undo snapshots intact after erase and clear", () => {
    const h = mountPaper();
    for (const clientX of [160, 400]) {
      h.emit("pointerdown", { clientX }); h.emit("pointerup", { pressure: 0, buttons: 0, clientX }, h.win);
    }
    const click = (title: string) => findElement(h.render(), element => element.type === "button" && element.props.title === title).props.onClick();
    click("擦膠：擦除整條筆跡");
    h.emit("pointerdown"); h.emit("pointercancel", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(1);
    click("復原上一步批註"); vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(2);
    click("清除此頁筆跡"); vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(0);
    click("復原上一步批註"); vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(2);
    click("復原上一步批註"); vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(1);
    h.unmount();
  });
  it("persists original preference key, thickness and colors across pages without interrupting ink on deferred warning broadcast", () => {
    const h = mountPaper();
    findElement(h.render(), element => element.type === "select").props.onChange({ target: { value: "6" } });
    findElement(h.render(), element => element.props?.title === "紅色筆跡").props.onClick();
    h.emit("pointerdown"); h.emit("pointermove", { clientX: 180 });
    // Preference persistence broadcasts its result while the next stroke is
    // active; this result must not finish that stroke.
    vi.advanceTimersByTime(120);
    h.emit("pointermove", { clientX: 200 }); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()[0].points).toHaveLength(3); expect(h.ink()[0].width).toBe(6 / 800);
    expect(h.ink()[0].color).toBe("#dc2626");
    expect(JSON.parse(h.saved.get("dse-physics-ink-preferences-v2")!)).toMatchObject({ thickness: 6, color: "#dc2626" });
    h.render("other-page"); h.emit("pointerdown"); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink("other-page")[0]).toMatchObject({ width: 6 / 800, color: "#dc2626" });
    const tree = h.render("other-page");
    for (const title of ["紅色筆跡", "黑色筆跡", "藍色筆跡"]) expect(findElement(tree, element => element.props?.title === title)).not.toBeNull();
    const toolbar = findElement(tree, element => element.props?.role === "toolbar");
    expect(toolbar.props.children.slice(1, 6).map((element: any) => element.props.title)).toEqual(["切換為橡皮擦", "畫筆", "擦膠：擦除整條筆跡", "螢光筆", "尺規：畫直線"]);
    expect(findElement(tree, element => !!element.props?.onDoubleClick)).toBeNull();
    h.unmount();
  });
  it("one-tap pen → eraser → pen keeps color, thickness and persisted preferences", () => {
    const h = mountPaper();
    findElement(h.render(), element => element.type === "select").props.onChange({ target: { value: "6" } });
    findElement(h.render(), element => element.props?.title === "紅色筆跡").props.onClick();
    h.emit("pointerdown"); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    const toggle = (title: string) => findElement(h.render(), element => element.props?.title === title).props.onClick();
    toggle("切換為橡皮擦");
    h.emit("pointerdown"); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(0);
    expect(JSON.parse(h.saved.get("dse-physics-ink-preferences-v2")!)).toMatchObject({ tool: "eraser", color: "#dc2626", thickness: 6 });
    toggle("切換為畫筆");
    h.emit("pointerdown", { clientX: 220 }); h.emit("pointercancel", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(1); expect(h.ink()[0]).toMatchObject({ color: "#dc2626", width: 6 / 800 });
    expect(JSON.parse(h.saved.get("dse-physics-ink-preferences-v2")!)).toMatchObject({ tool: "pen", color: "#dc2626", thickness: 6 });
    const tree = h.render();
    expect(findElement(tree, element => element.type === "canvas").props["aria-label"]).toContain("只限 Pencil 書寫／擦除；手指可拖動／縮放");
    expect(findElement(tree, element => !!element.props?.onDoubleClick)).toBeNull();
    h.unmount();
  });
  it("publishes honest deferred storage errors and clears warning only after a successful save", () => {
    const h = mountPaper();
    h.localStorage.setItem.mockImplementationOnce(() => { throw new Error("quota"); });
    h.emit("pointerdown"); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    expect(findElement(h.render(), element => element.props?.role === "alert")).toBeNull();
    vi.advanceTimersByTime(120);
    expect(findElement(h.render(), element => element.props?.role === "alert")).not.toBeNull();
    h.emit("pointerdown", { clientX: 220 }); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    expect(findElement(h.render(), element => element.props?.role === "alert")).not.toBeNull();
    vi.advanceTimersByTime(120);
    expect(findElement(h.render(), element => element.props?.role === "alert")).toBeNull();
    expect(h.ink()).toHaveLength(2);
    h.unmount();
  });
});

describe("single-page legacy ink lifecycle", () => {
  const legacyKey = "dse-physics-ink-v2:old-spread";
  const newKey = "dse-physics-ink-v2:test-pencil";
  const legacyInkRegion = { pageLabel: "old-spread", x0: 0, x1: 0.5 };
  const oldStrokes = JSON.stringify([
    { points: [{ x: 0.1, y: 0.2, pressure: 0.6 }], color: "#dc2626", width: 0.005, kind: "pen" },
    { points: [{ x: 0.8, y: 0.2, pressure: 0.6 }], color: "#2563eb", width: 0.005, kind: "pen" },
  ]);
  it("migrates only the selected region, defers the new-key write and retains the spread", () => {
    const h = mountPaper({ initialSaved: { [legacyKey]: oldStrokes }, legacyInkRegion });
    expect(findElement(h.render(), element => element.type === "canvas").props["data-strokes"]).toBe(1);
    expect(h.localStorage.setItem).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(1);
    expect(h.ink()[0].points[0]).toMatchObject({ x: 0.2, y: 0.2 });
    expect(h.ink()[0].color).toBe("#dc2626");
    expect(h.saved.get(legacyKey)).toBe(oldStrokes);
    expect(h.localStorage.setItem).toHaveBeenCalledTimes(1);
    h.unmount();
  });
  it("never imports legacy ink into an explicitly saved empty page", () => {
    const h = mountPaper({ initialSaved: { [legacyKey]: oldStrokes, [newKey]: "[]" }, legacyInkRegion });
    expect(findElement(h.render(), element => element.type === "canvas").props["data-strokes"]).toBe(0);
    vi.advanceTimersByTime(120);
    expect(h.ink()).toEqual([]); expect(h.localStorage.setItem).not.toHaveBeenCalled();
    h.unmount();
  });
  it("equivalent region objects do not reload or finish an active pen stroke", () => {
    const h = mountPaper({ initialSaved: { [legacyKey]: oldStrokes }, legacyInkRegion });
    vi.advanceTimersByTime(120); h.localStorage.setItem.mockClear();
    h.emit("pointerdown", { clientX: 220 });
    h.render("test-pencil", { ...legacyInkRegion });
    vi.advanceTimersByTime(120); expect(h.localStorage.setItem).not.toHaveBeenCalled();
    h.emit("pointermove", { clientX: 240 }); h.emit("pointerup", { pressure: 0, buttons: 0 }, h.win);
    vi.advanceTimersByTime(120);
    expect(h.ink()).toHaveLength(2); expect(h.ink()[1].points).toHaveLength(2);
    h.unmount();
  });
  it("reports a failed deferred migration save through the existing page warning", () => {
    const h = mountPaper({ initialSaved: { [legacyKey]: oldStrokes }, legacyInkRegion });
    h.localStorage.setItem.mockImplementationOnce(() => { throw new Error("quota"); });
    vi.advanceTimersByTime(120);
    expect(findElement(h.render(), element => element.props?.role === "alert")).not.toBeNull();
    expect(h.saved.get(legacyKey)).toBe(oldStrokes); expect(h.saved.has(newKey)).toBe(false);
    h.unmount();
  });
});

describe("deferred persistence", () => {
  it("coalesces writes per key and defers serialization off the pointer path", () => {
    const write = vi.fn(() => ""); const report = vi.fn();
    const storage = createDeferredInkStorage(write);
    storage.enqueue("page", [1], report); storage.enqueue("page", [2], report); storage.enqueue("prefs", { thickness: 6 }, report);
    expect(write).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120);
    expect(write.mock.calls).toEqual([["page", [2]], ["prefs", { thickness: 6 }]]);
    storage.flush(); expect(write).toHaveBeenCalledTimes(2);
  });
  it("reports storage failure until an actual successful write and cancels superseded prefs", () => {
    const write = vi.fn<(_key: string, _value: unknown) => string>().mockReturnValueOnce("storage unavailable").mockReturnValue("");
    const report = vi.fn(); const storage = createDeferredInkStorage(write);
    storage.enqueue("page", [1], report); storage.flush();
    expect(report).toHaveBeenLastCalledWith("storage unavailable");
    storage.enqueue("page", [2], report); expect(report).toHaveBeenCalledTimes(1);
    storage.enqueue("prefs", { thickness: 1.5 }, report); storage.cancel("prefs");
    vi.advanceTimersByTime(120); expect(report).toHaveBeenLastCalledWith("");
    expect(write).toHaveBeenCalledTimes(2);
  });
});
