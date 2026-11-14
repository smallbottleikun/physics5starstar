import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { topics } from '../physics-content';
import { practiceQuestions } from '../practice-questions';
import { lessonByTopic } from '../lesson-registry';
import AppearanceControls from '../components/AppearanceControls';
import PracticeQuestionBlock from '../components/PracticeQuestion';
import MathFormula from '../components/MathFormula';
import FormulaDetails from '../components/FormulaDetails';
import LessonNavigation from '../components/LessonNavigation';
import LessonVisuals from '../components/LessonVisuals';
import { LessonSections, ExplanationGuides, LessonSources } from '../components/DetailedLesson';

const OFFICIAL_FORMULA_SHEET_URL = 'https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/phy/Phy-Formulae-e.pdf';
const ACCENTS: Record<string, string> = { cyan: 'var(--color-cyan)', orange: 'var(--color-orange)', red: 'var(--color-red)', purple: 'var(--color-purple)' };

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [showZh, setShowZh] = useState(true);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [id]);
  const topic = topics.find(t => t.id === id);
  if (!topic) return <div className="app-shell p-8 pt-24"><h1 className="text-2xl">Topic not found</h1><button className="mt-5" onClick={() => navigate('/')}>← All topics</button></div>;
  const lesson = lessonByTopic[topic.id];
  const accent = ACCENTS[topic.color] ?? ACCENTS.cyan;
  const questions = practiceQuestions.filter(q => q.topicId === topic.id);
  const index = topics.findIndex(t => t.id === id);
  const previous = topics[index - 1];
  const next = topics[index + 1];

  return <div className="app-shell themed-topic-page" style={{ '--lesson-accent': accent } as React.CSSProperties}>
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between gap-2 px-4 sm:px-6">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}><ArrowLeft size={16} /><span>All Topics</span><span className="hidden sm:inline">所有主題</span></button>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="topic-appearance"><AppearanceControls compact /></div>
        <a href={OFFICIAL_FORMULA_SHEET_URL} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-1 text-xs" style={{ color: 'var(--color-cyan)' }}>官方公式表 <ExternalLink size={12} /></a>
        <button onClick={() => setShowZh(v => !v)} aria-pressed={showZh} className="rounded-lg px-2.5 py-2 text-xs whitespace-nowrap" style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-subtle)', color: 'var(--text-primary)' }}>中文注釋 <span className="opacity-60">{showZh ? 'ON' : 'OFF'}</span></button>
      </div>
    </nav>

    <header className="pt-24 pb-8 px-4 sm:px-6" style={{ background: `linear-gradient(120deg, color-mix(in srgb, ${accent} 8%, transparent), transparent 60%)` }}>
      <div className="max-w-7xl mx-auto">
        <p className="eyebrow mb-3" style={{ color: accent }}>{topic.category} {showZh && `· ${topic.categoryZh}`}</p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold">{topic.title}</h1>
        {showZh && <p className="text-lg mt-2" style={{ color: accent }}>{topic.titleZh}</p>}
        <p className="lesson-en max-w-3xl mt-5">{topic.summary}</p>{showZh && <p className="lesson-zh max-w-3xl">{topic.summaryZh}</p>}
        {lesson && <p className="text-xs mt-5" style={{ color: 'var(--text-muted)' }}>Detailed lesson · {lesson.sections.length} sections · {topic.formulas.length} formula guides · {lesson.explanations.length} explanation guides</p>}
      </div>
    </header>

    <div className="lesson-layout max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <LessonNavigation key={topic.id} topic={topic} topics={topics} lesson={lesson} showZh={showZh} />
      <main className="min-w-0 space-y-10">
        {lesson && <LessonSections key={`notes-${topic.id}`} lesson={lesson} showZh={showZh} />}
        {lesson && <LessonVisuals key={`visual-${topic.id}`} topicId={topic.id} showZh={showZh} />}
        <section id="topic-formulas" className="lesson-anchor space-y-4">
          <div><h2 className="text-2xl">Key formulas {showZh && '· 公式與求法'}</h2><p className="lesson-zh mt-2">展開公式查看每個字母的意義、單位、移項求法及適用條件。</p></div>
          {topic.formulas.map((formula, i) => <details key={`${topic.id}-${i}`} className="lesson-fold formula-fold">
            <summary><span className="min-w-0 block w-full"><span className="block text-sm font-semibold mb-2" style={{ color: accent }}>{formula.name ?? `Formula ${i + 1}`}{showZh && formula.nameZh && <span className="font-normal opacity-70 ml-2">{formula.nameZh}</span>}</span><MathFormula latex={formula.latex} /></span></summary>
            <div className="lesson-fold-body"><FormulaDetails formula={formula} showZh={showZh} /></div>
          </details>)}
        </section>
        {lesson && <ExplanationGuides key={`guides-${topic.id}`} lesson={lesson} showZh={showZh} />}
        <section id="topic-concepts" className="lesson-anchor space-y-4">
          <h2 className="text-2xl">Key points {showZh && '· 重要概念'}</h2>
          {topic.keyPoints.map((point, i) => <div key={i} className="lesson-card flex gap-3"><span className="lesson-step-number shrink-0">{i + 1}</span><div><p className="lesson-en">{point.en}</p>{showZh && <p className="lesson-zh">{point.zh}</p>}</div></div>)}
        </section>
        <section id="topic-tips" className="lesson-anchor space-y-4">
          <h2 className="text-2xl">Exam tips {showZh && '· 考試貼士'}</h2>
          <div className="lesson-card space-y-5" style={{ borderLeft: `3px solid ${accent}` }}>{topic.examTips.map((tip, i) => <div key={i}><p className="lesson-en font-medium">{tip.en}</p>{showZh && <p className="lesson-zh">{tip.zh}</p>}</div>)}</div>
        </section>
        {questions.length > 0 && <section id="topic-practice" className="lesson-anchor space-y-5">
          <h2 className="text-2xl">Practice questions {showZh && '· 作答練習'} <span className="text-sm opacity-50">{questions.length} sets</span></h2>
          <p className="lesson-zh">先寫自己的推理，再按「查看答案」比較關鍵條件與因果鏈。顯示參考答案不等於自動評分。</p>
          {questions.map((question, i) => <PracticeQuestionBlock key={question.id ?? `${topic.id}-${i}`} question={question} accentColor={`topic-text-${topic.color}`} dotColor={topic.accentColor} showZh={showZh} />)}
        </section>}
        {lesson && <LessonSources lesson={lesson} showZh={showZh} />}
        <div className="flex flex-wrap gap-3 justify-between pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {previous && <button className="lesson-nav-bottom" onClick={() => navigate(`/topic/${previous.id}`)}>← {previous.title}</button>}
          <button className="lesson-nav-bottom" onClick={() => navigate('/')}>All topics</button>
          {next && <button className="lesson-nav-bottom" onClick={() => navigate(`/topic/${next.id}`)}>{next.title} →</button>}
        </div>
      </main>
    </div>
  </div>;
}
