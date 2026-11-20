export type InkPointer = {
  pointerId: number;
  pointerType: string;
  button: number;
  buttons: number;
  pressure: number;
};
export type InkSession = Pick<InkPointer, "pointerId" | "pointerType">;

// iPadOS / Safari commonly report the first Pencil contact with non-standard
// flags (button=-1, buttons=0) and occasionally pressure=0. A genuine pen
// pointerdown starts ink regardless of those reports; recovery after a missed
// down still needs a pressure-bearing sample so hover never draws.
export function isPenButtonDown(pointer: InkPointer): boolean {
  if (pointer.pointerType !== "pen") return false;
  // Standard mouse/pen down: primary tip (1) or eraser (32) reported in buttons.
  if ((pointer.buttons & 33) !== 0) return true;
  // Safari/iPadOS drops the pressed button flags on the first contact. Treat
  // an explicit down as a contact instead of waiting for a second press.
  const button = Number.isFinite(pointer.button) ? pointer.button : 0;
  return button === -1 || button === 0 || button === 1 || button === 5;
}

export function isPenContact(pointer: InkPointer): boolean {
  return pointer.pointerType === "pen" && Number.isFinite(pointer.pressure)
    && pointer.pressure > 0 && (pointer.buttons & 33) !== 0;
}

export function inkStartDecision(pointer: InkPointer, active: InkSession | null, recovering = false): "ignore" | "start" | "replace" {
  // Web Pointer Events identify a pen, not its hardware brand. Fingers, mice
  // and unspecified pointer types must never create ink, regardless of pressure.
  if (pointer.pointerType !== "pen") return "ignore";
  if (recovering) {
    // A missed down can only be recovered from a pressure-bearing contact.
    if (!isPenContact(pointer)) return "ignore";
    if (active?.pointerId === pointer.pointerId) return "ignore";
  } else if (!isPenButtonDown(pointer)) {
    // Hover reports (no pressed flag, no pen button) must not start a stroke.
    return "ignore";
  }
  // A new pen down is a new contact even when Safari reuses the pointer ID.
  // Preserve any previous received samples instead of blocking this contact.
  return active ? "replace" : "start";
}

export function isInkMove(pointer: InkPointer): boolean {
  return pointer.pointerType === "pen" && (pointer.pressure > 0 || (pointer.buttons & 33) !== 0);
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
