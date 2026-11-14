export type InkPointer = {
  pointerId: number;
  pointerType: string;
  button: number;
  buttons: number;
  pressure: number;
};
export type InkSession = Pick<InkPointer, "pointerId" | "pointerType">;

// Hover must never recover a missing down. A pressure-bearing tip/eraser
// contact is required; explicit pen pointerdown remains tolerant of Safari's
// button=-1 / buttons=0 reports.
export function isPenContact(pointer: InkPointer): boolean {
  return pointer.pointerType === "pen" && Number.isFinite(pointer.pressure)
    && pointer.pressure > 0 && (pointer.buttons & 33) !== 0;
}

export function inkStartDecision(pointer: InkPointer, active: InkSession | null, recovering = false): "ignore" | "start" | "replace" {
  if (pointer.pointerType !== "pen" && pointer.pointerType !== "mouse") return "ignore";
  if (recovering && !isPenContact(pointer)) return "ignore";
  if (pointer.pointerType === "mouse" && (pointer.button !== 0 || active !== null)) return "ignore";
  if (recovering && active?.pointerId === pointer.pointerId) return "ignore";
  // A new pen down is a new contact even when Safari reuses the pointer ID.
  // Preserve any previous received samples instead of blocking this contact.
  return active ? "replace" : "start";
}

export function isInkMove(pointer: InkPointer): boolean {
  return pointer.pointerType === "mouse" ? (pointer.buttons & 1) !== 0
    : pointer.pointerType === "pen" && (pointer.pressure > 0 || (pointer.buttons & 33) !== 0);
}

// Clear ownership BEFORE releasing capture or committing: lostcapture, native
// window completion, and canvas completion can all report the same ending.
export function takeInkSession<T extends InkSession>(ref: { current: T | null }, pointerId?: number): T | null {
  const session = ref.current;
  if (!session || (pointerId !== undefined && session.pointerId !== pointerId)) return null;
  ref.current = null;
  return session;
}

export function touchMayNavigate(active: InkSession | null): boolean {
  return active?.pointerType !== "pen";
}

export function createDeferredInkStorage(
  write: (key: string, value: unknown) => string,
  delay = 120,
) {
  const pending = new Map<string, { value: unknown; report: (warning: string) => void }>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  const flush = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    const batch = Array.from(pending.entries());
    pending.clear();
    for (const [key, entry] of batch) entry.report(write(key, entry.value));
  };
  return {
    enqueue(key: string, value: unknown, report: (warning: string) => void) {
      pending.set(key, { value, report });
      // Bound the delay, rather than postponing indefinitely during fast input.
      if (timer === null) timer = setTimeout(flush, delay);
    },
    cancel(key: string) {
      pending.delete(key);
      if (!pending.size && timer !== null) { clearTimeout(timer); timer = null; }
    },
    flush,
  };
}
