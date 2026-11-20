import { lessonBundle as gases } from './lessons/gases';
import { lessonBundle as grating } from './lessons/grating';
import { lessonBundle as standingWaves } from './lessons/standing-waves';
import { lessonBundle as lenses } from './lessons/lenses';
import { lessonBundle as momentum } from './lessons/momentum';
import type { FormulaSheetEntry, Topic } from './physics-content';
import type { LessonBundle } from './lesson-types';

export const lessonBundles: LessonBundle[] = [gases, grating, standingWaves, lenses, momentum];
export const lessonByTopic: Record<string, LessonBundle> = Object.fromEntries(lessonBundles.map(item => [item.topicId, item]));
export const lessonQuestions = lessonBundles.flatMap(item => item.questions);

export function applyDetailedLessons(topics: Topic[], formulaSheet: FormulaSheetEntry[]) {
  for (const bundle of lessonBundles) {
    let topic = topics.find(item => item.id === bundle.topicId);
    if (!topic && bundle.topic) {
      topic = { ...bundle.topic, formulas: [] };
      topics.push(topic);
    }
    if (!topic) continue;
    if (bundle.replaceFormulas || bundle.topic) {
      for (let i = formulaSheet.length - 1; i >= 0; i--) {
        if (formulaSheet[i].topic === topic.title) formulaSheet.splice(i, 1);
      }
      topic.formulas = [...bundle.formulas];
    } else topic.formulas.push(...bundle.formulas);
    if (topic.id === 'gases-kinetic-theory') {
      topic.examTips = topic.examTips.filter(tip => !tip.en.startsWith('The three core formulae'));
      topic.examTips.unshift({ en: 'Distinguish mean kinetic energy per molecule from the total molecular translational kinetic energy of the sample. Always use kelvin.', zh: '必須區分每個分子的平均動能和整份氣體的分子總平移動能。氣體公式一律使用 K。' });
    }
    formulaSheet.push(...bundle.formulas.map(formula => ({
      latex: formula.latex, name: formula.name, nameZh: formula.nameZh,
      topic: topic!.title, topicZh: topic!.titleZh, color: topic!.color,
      symbols: formula.symbols ?? [], rearrangements: formula.rearrangements,
    })));
  }
}
