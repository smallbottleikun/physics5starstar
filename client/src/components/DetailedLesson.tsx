import type { LessonBundle } from '../lesson-types';
import MathFormula from './MathFormula';

export function LessonSections({ lesson, showZh }: { lesson: LessonBundle; showZh: boolean }) {
  return <section id="lesson-notes" className="lesson-anchor space-y-4">
    <div><p className="eyebrow mb-2">Understand before memorising</p><h2 className="text-2xl">Step-by-step notes {showZh && '· 逐步理解'}</h2></div>
    {lesson.sections.map((section, i) => <details key={section.id} id={`lesson-${section.id}`} className="lesson-fold lesson-anchor" open={i === 0}>
      <summary><span><span className="lesson-section-index">{String(i + 1).padStart(2, '0')}</span>{section.title}{showZh && <span className="block lesson-zh ml-9">{section.titleZh}</span>}</span></summary>
      <div className="lesson-fold-body space-y-5">{section.blocks.map((block, j) => <div key={j}>
        <p className="lesson-en">{block.en}</p>{showZh && <p className="lesson-zh">{block.zh}</p>}
        {block.latex && <MathFormula latex={block.latex} />}
      </div>)}</div>
    </details>)}
  </section>;
}

export function ExplanationGuides({ lesson, showZh }: { lesson: LessonBundle; showZh: boolean }) {
  if (!lesson.explanations.length) return null;
  return <section id="lesson-explanations" className="lesson-anchor space-y-4">
    <div><p className="eyebrow mb-2">Cause → law → consequence</p><h2 className="text-2xl">Explain questions {showZh && '· 文字解說題'}</h2>
      <p className="lesson-en mt-3">These original DSE-style guides show the reasoning, not just a sentence to memorise. They are not official past-paper mark schemes.</p>
      {showZh && <p className="lesson-zh">以下是原創 DSE 風格答題指引，重點是理解因果而非背誦。並非官方歷屆試題或評分準則。</p>}
    </div>
    {lesson.explanations.map(guide => <details key={guide.id} className="lesson-fold">
      <summary><span>{guide.question}{showZh && <span className="block lesson-zh">{guide.questionZh}</span>}</span></summary>
      <div className="lesson-fold-body space-y-5">
        <div><h3 className="text-sm mb-3">Why this works {showZh && '· 道理與推理'}</h3><ol className="space-y-3">{guide.reasoning.map((step, i) => <li key={i} className="flex gap-3">
          <span className="lesson-step-number shrink-0">{i + 1}</span><div><p className="lesson-en">{step.en}</p>{showZh && <p className="lesson-zh">{step.zh}</p>}</div>
        </li>)}</ol></div>
        <div className="lesson-model-answer"><h3 className="text-sm mb-2">Model answer {showZh && '· 參考答法'}</h3><p className="lesson-en whitespace-pre-line">{guide.modelAnswer}</p>{showZh && <p className="lesson-zh whitespace-pre-line">{guide.modelAnswerZh}</p>}</div>
        {!!guide.pitfalls.length && <div><h3 className="text-sm mb-2" style={{ color: 'var(--color-red)' }}>Avoid these errors {showZh && '· 常見失分原因'}</h3>{guide.pitfalls.map((pitfall, i) => <div key={i} className="mb-3"><p className="lesson-en">{pitfall.en}</p>{showZh && <p className="lesson-zh">{pitfall.zh}</p>}</div>)}</div>}
      </div>
    </details>)}
  </section>;
}

export function LessonSources({ lesson, showZh }: { lesson: LessonBundle; showZh: boolean }) {
  return <section id="lesson-sources" className="lesson-anchor">
    <h2 className="text-lg mb-4">Sources {showZh && '· 參考來源'}</h2>
    <p className="lesson-zh mb-4">公式以 HKEAA 官方表及教材為核實依據；延伸公式會在教材註明適用條件。</p>
    <div className="space-y-3">{lesson.sources.map((source, i) => <div key={i}><a href={source.url} target="_blank" rel="noopener noreferrer" className="lesson-source-link text-sm">[{i + 1}] {source.title} ↗</a><p className="lesson-zh">{source.supports}</p></div>)}</div>
  </section>;
}
