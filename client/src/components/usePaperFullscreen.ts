import { useCallback, useEffect, useState } from "react";

type FullscreenDocument = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> | void };
type FullscreenRoot = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

export function usePaperFullscreen() {
  const [active, setActive] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const doc = document as FullscreenDocument;
    const update = () => {
      const native = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
      setActive(native);
      if (!native) setNotice("");
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !doc.fullscreenElement && !doc.webkitFullscreenElement) {
        setActive(false); setNotice("");
      }
    };
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
      document.removeEventListener("keydown", onKey);
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        try { const result = doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.(); if (result) void result.catch(() => undefined); } catch { /* Already exited. */ }
      }
    };
  }, []);
  const toggle = useCallback(async () => {
    const doc = document as FullscreenDocument;
    const root = document.documentElement as FullscreenRoot;
    if (active) {
      setActive(false); setNotice("");
      try {
        if (doc.fullscreenElement && doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } catch { /* Native fullscreen was already dismissed. */ }
      return;
    }
    setActive(true); setNotice("");
    try {
      // Fullscreen the document so the PDF continues to use normal window scrolling.
      if (root.requestFullscreen) await root.requestFullscreen();
      else if (root.webkitRequestFullscreen) await root.webkitRequestFullscreen();
      else throw new Error("Fullscreen API unavailable");
    } catch {
      setNotice("瀏覽器未能隱藏系統列；已啟用精簡專注模式，點「退出全屏」返回。");
    }
  }, [active]);
  return { active, notice, toggle };
}
