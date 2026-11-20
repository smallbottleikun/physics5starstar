import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist";

export interface OriginalPdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  accessibleLabel: string;
}

type PageDetails = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  attempt: number;
  page: PDFPageProxy | null;
  ratio: number;
  failed: boolean;
};

type RenderResult = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  attempt: number;
  width: number;
  status: "loading" | "success" | "error";
};

const DEFAULT_RATIO = 595 / 842;
const MAX_CANVAS_PIXELS = 5_000_000;

export default function OriginalPdfPage({
  pdf,
  pageNumber,
  accessibleLabel,
}: OriginalPdfPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [width, setWidth] = useState(0);
  const [nearViewport, setNearViewport] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [details, setDetails] = useState<PageDetails | null>(null);
  const [result, setResult] = useState<RenderResult | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame: number | null = null;
    let nextWidth = 0;
    const scheduleMeasurement = (measuredWidth: number) => {
      nextWidth = Math.max(0, Math.round(measuredWidth));
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        setWidth(previous => (previous === nextWidth ? previous : nextWidth));
      });
    };

    scheduleMeasurement(root.clientWidth);
    if (typeof ResizeObserver === "undefined") {
      const onResize = () => scheduleMeasurement(root.clientWidth);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        if (frame !== null) window.cancelAnimationFrame(frame);
      };
    }

    const observer = new ResizeObserver(entries => {
      const entry = entries.find(item => item.target === root);
      if (entry) scheduleMeasurement(entry.contentRect.width);
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Fetch only this page, and only once it approaches the viewport. Width
  // changes reuse the same proxy instead of repeatedly fetching page data.
  useEffect(() => {
    if (!nearViewport) return;
    let disposed = false;

    void (async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (disposed) return;
        const viewport = page.getViewport({ scale: 1 });
        if (
          !Number.isFinite(viewport.width) ||
          !Number.isFinite(viewport.height) ||
          viewport.width <= 0 ||
          viewport.height <= 0
        ) {
          throw new Error("Invalid PDF page dimensions");
        }
        setDetails({
          pdf,
          pageNumber,
          attempt,
          page,
          ratio: viewport.width / viewport.height,
          failed: false,
        });
      } catch {
        if (!disposed) {
          setDetails({
            pdf,
            pageNumber,
            attempt,
            page: null,
            ratio: DEFAULT_RATIO,
            failed: true,
          });
        }
      }
    })();

    return () => {
      disposed = true;
    };
  }, [pdf, pageNumber, nearViewport, attempt]);

  useEffect(() => {
    if (
      !nearViewport ||
      width <= 0 ||
      !details?.page ||
      details.pdf !== pdf ||
      details.pageNumber !== pageNumber ||
      details.attempt !== attempt
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const page = details.page;
    let disposed = false;
    let task: RenderTask | null = null;
    const previousTask = renderTaskRef.current;
    const updateStatus = (status: RenderResult["status"]) => {
      if (!disposed) setResult({ pdf, pageNumber, attempt, width, status });
    };
    updateStatus("loading");

    void (async () => {
      try {
        // Cancellation is asynchronous: wait until PDF.js releases the canvas
        // before changing its bitmap or starting another render (also in StrictMode).
        if (previousTask) {
          previousTask.cancel();
          await previousTask.promise.catch(() => undefined);
        }
        if (disposed) return;

        const naturalViewport = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: width / naturalViewport.width });
        const deviceRatio = window.devicePixelRatio || 1;
        const outputScale = Math.min(
          Number.isFinite(deviceRatio) ? Math.max(1, deviceRatio) : 1,
          2,
          Math.sqrt(MAX_CANVAS_PIXELS / (viewport.width * viewport.height)),
        );
        canvas.width = Math.max(1, Math.floor(viewport.width * outputScale));
        canvas.height = Math.max(1, Math.floor(viewport.height * outputScale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas rendering is unavailable");

        task = page.render({
          canvasContext: context,
          viewport,
          // Match the complete viewport to the bounded bitmap, without cropping.
          transform: [
            canvas.width / viewport.width,
            0,
            0,
            canvas.height / viewport.height,
            0,
            0,
          ],
          background: "rgb(255, 255, 255)",
          // PDF.js defaults to ENABLE, preserving annotations with appearance data.
        });
        renderTaskRef.current = task;
        await task.promise;
        updateStatus("success");
      } catch {
        updateStatus("error");
      } finally {
        if (task && renderTaskRef.current === task) renderTaskRef.current = null;
      }
    })();

    return () => {
      disposed = true;
      task?.cancel();
    };
  }, [pdf, pageNumber, nearViewport, width, attempt, details]);

  const currentDetails =
    details?.pdf === pdf &&
    details.pageNumber === pageNumber &&
    details.attempt === attempt
      ? details
      : null;
  const currentResult =
    result?.pdf === pdf &&
    result.pageNumber === pageNumber &&
    result.attempt === attempt &&
    result.width === width
      ? result
      : null;
  const rendered = currentResult?.status === "success";
  const failed = currentDetails?.failed || currentResult?.status === "error";

  return (
    <div
      ref={rootRef}
      className="pdf-original-page"
      data-rendered={rendered ? "true" : "false"}
      aria-busy={nearViewport && !rendered && !failed}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: currentDetails?.ratio ?? DEFAULT_RATIO,
        background: "white",
      }}
    >
      <canvas
        ref={canvasRef}
        className="pdf-original-canvas"
        role="img"
        aria-label={accessibleLabel}
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          visibility: rendered ? "visible" : "hidden",
          background: "white",
        }}
      />
      {!rendered && (
        <div
          className="pdf-page-status"
          role={failed ? "alert" : "status"}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          {failed ? (
            <>
              <span>此原卷頁面暫時未能顯示。</span>
              <button type="button" onClick={() => setAttempt(value => value + 1)}>
                重試此頁
              </button>
            </>
          ) : (
            <span>{nearViewport ? "正在顯示原卷頁面…" : "原 PDF 頁面（捲動至此即載入）"}</span>
          )}
        </div>
      )}
    </div>
  );
}
