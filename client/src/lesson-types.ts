import type { Topic, Formula, KeyPoint } from './physics-content';
import type { PracticeQuestion } from './practice-questions';

export interface LessonFormula extends Formula {
  name: string;
  nameZh: string;
  rearrangements: { target: string; latex: string; note: string; noteZh: string }[];
}
export interface LessonBlock {
  en: string;
  zh: string;
  latex?: string;
  image?: {
    src: string;
    alt: string;
    altZh: string;
    caption: string;
    captionZh: string;
    badge?: string;
  };
}
export interface LessonSection {
  id: string;
  title: string;
  titleZh: string;
  blocks: LessonBlock[];
}
export interface ExplanationGuide {
  id: string;
  question: string;
  questionZh: string;
  reasoning: KeyPoint[];
  modelAnswer: string;
  modelAnswerZh: string;
  pitfalls: KeyPoint[];
}
export interface LessonBundle {
  topicId: string;
  topic?: Topic;
  replaceFormulas?: boolean;
  formulas: LessonFormula[];
  sections: LessonSection[];
  explanations: ExplanationGuide[];
  questions: PracticeQuestion[];
  sources: { title: string; url: string; supports: string }[];
}
