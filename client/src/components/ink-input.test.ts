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

function mountPaper({ zoom = 1, captureFails = false, lateMetrics = false }: { zoom?: number; captureFails?: boolean; lateMetrics?: boolean } = {}) {
  const saved = new Map<string, string>();
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
  const render = (pageLabel = "test-pencil") => {
    runtime.cursor = 0; runtime.refCount = 0; hookContext.current = runtime;
    const tree = AnnotatablePaper({ children: null, pageLabel, zoom });
    while (runtime.effects.length) runtime.effects.shift()!();
    return tree;
  };
  render();
  if (lateMetrics) { viewport.clientWidth = 800; host.clientWidth = 800; host.offsetHeight = 1000; }
  const emit = (type: string, values: Partial<PointerEvent> = {}, target: EventTarget = canvas) => target.dispatchEvent(pointer(type, values));
  const ink = (page = "test-pencil") => JSON.parse(saved.get(`dse-physics-ink-v2:${page}`) ?? "[]") as { points: { x: number; y: number }[]; width: number; color: string }[];
  const paint = () => { const batch = Array.from(frames.values()); frames.clear(); batch.forEach(callback => callback(0)); };
  const unmount = () => runtime.cells.forEach(cell => cell?.cleanup?.());
  return { canvas, host, win, doc, viewport, saved, localStorage, emit, ink, paint, context, frames, render, unmount };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); hookContext.current = null; });

describe("Pencil lifecycle policy", () => {
  it("accepts explicit Safari pen down with unusual button flags", () => {
    expect(inkStartDecision(pen({ button: -1, buttons: 0, pressure: 0 }), null)).toBe("start");
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
  it("intentional two-touch navigation still discards a mouse preview", () => {
    const h = mountPaper(); h.emit("pointerdown", { pointerId: 9, pointerType: "mouse" });
    h.emit("pointerdown", { pointerId: 1, pointerType: "touch" });
    h.emit("pointerdown", { pointerId: 2, pointerType: "touch", clientX: 300 });
    h.emit("pointerup", { pointerId: 9, pointerType: "mouse" }, h.win);
    vi.advanceTimersByTime(120); expect(h.ink()).toHaveLength(0);
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
