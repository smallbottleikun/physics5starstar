import { useEffect, useRef } from 'react';

export default function MathFormula({ latex }: { latex: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let attempts = 0;
    const render = () => {
      const katex = (window as any).katex;
      if (!ref.current || !katex) return false;
      try { katex.render(latex, ref.current, { displayMode: true, throwOnError: false, strict: 'ignore' }); }
      catch { ref.current.textContent = latex; }
      return true;
    };
    if (render()) return;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (render() || attempts >= 50) window.clearInterval(timer);
    }, 200);
    return () => window.clearInterval(timer);
  }, [latex]);
  return <div ref={ref} className="lesson-equation" aria-label={latex}>{latex}</div>;
}
