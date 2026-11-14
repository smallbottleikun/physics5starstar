import { useLocation } from 'wouter';
import { useEffect, useRef } from 'react';
import type { Topic } from '../physics-content';
import type { LessonBundle } from '../lesson-types';

export function jumpToLesson(id: string) {
  const target = document.getElementById(id);
  if (target instanceof HTMLDetailsElement) target.open = true;
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LessonNavigation({ topic, topics, lesson, showZh }: { topic: Topic; topics: Topic[]; lesson?: LessonBundle; showZh: boolean }) {
  const [, navigate] = useLocation();
  const contents = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (contents.current) contents.current.open = window.matchMedia('(min-width: 1100px)').matches;
  }, []);
  return <aside className="lesson-sidebar">
    <details ref={contents} className="lesson-contents" open>
      <summary className="font-semibold text-sm">On this page {showZh && '· 本課目錄'}</summary>
      <nav className="mt-3 space-y-1" aria-label="Lesson contents">
        {lesson && <details open className="lesson-nav-group"><summary>Understand {showZh && '· 理解與推導'}</summary>
          {lesson.sections.map((section, i) => <button key={section.id} onClick={() => jumpToLesson(`lesson-${section.id}`)} className="lesson-nav-link text-left"><span className="text-xs opacity-50 mr-2">{i + 1}</span>{showZh ? section.titleZh : section.title}</button>)}
        </details>}
        <details open className="lesson-nav-group"><summary>Revision {showZh && '· 重點與練習'}</summary>
          <button onClick={() => jumpToLesson('topic-formulas')} className="lesson-nav-link text-left">Formulas {showZh && '· 字母與求法'}</button>
          {lesson && <button onClick={() => jumpToLesson('lesson-explanations')} className="lesson-nav-link text-left">Explain {showZh && '· 文字題道理'}</button>}
          <button onClick={() => jumpToLesson('topic-concepts')} className="lesson-nav-link text-left">Key points {showZh && '· 概念'}</button>
          <button onClick={() => jumpToLesson('topic-tips')} className="lesson-nav-link text-left">Exam tips {showZh && '· 應試'}</button>
          <button onClick={() => jumpToLesson('topic-practice')} className="lesson-nav-link text-left">Practice {showZh && '· 作答與答案'}</button>
          {lesson && <button onClick={() => jumpToLesson('lesson-sources')} className="lesson-nav-link text-left">Sources {showZh && '· 來源'}</button>}
        </details>
        <details className="lesson-nav-group"><summary>{topic.category} {showZh && `· ${topic.categoryZh}主題`}</summary>
          {topics.filter(t => t.category === topic.category).map(t => <button key={t.id} className={`lesson-nav-link text-left ${t.id === topic.id ? 'is-current' : ''}`} aria-current={t.id === topic.id ? 'page' : undefined} onClick={() => navigate(`/topic/${t.id}`)}>{showZh ? t.titleZh : t.title}</button>)}
        </details>
      </nav>
    </details>
  </aside>;
}
