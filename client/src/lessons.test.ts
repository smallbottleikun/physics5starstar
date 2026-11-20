import { describe, it, expect } from 'vitest';
import { topics, formulaSheet } from './physics-content';
import { lessonBundles, lessonByTopic, lessonQuestions } from './lesson-registry';
import { practiceQuestions } from './practice-questions';

describe('Detailed DSE lessons', () => {
  it('adds three new topics without duplicate topic IDs', () => {
    expect(new Set(topics.map(t => t.id)).size).toBe(topics.length);
    for (const id of ['diffraction-grating', 'stationary-travelling-waves', 'lenses']) expect(topics.some(t => t.id === id)).toBe(true);
  });
  it('supplies bilingual sections, explanations, symbol definitions and algebra', () => {
    expect(lessonBundles).toHaveLength(5);
    for (const lesson of lessonBundles) {
      expect(lesson.sections.length).toBeGreaterThanOrEqual(4);
      expect(lesson.explanations.length).toBeGreaterThanOrEqual(3);
      expect(lesson.sources.length).toBeGreaterThanOrEqual(2);
      for (const section of lesson.sections) {
        expect(section.titleZh).toBeTruthy();
        expect(section.blocks.length).toBeGreaterThan(0);
        for (const block of section.blocks) { expect(block.en).toBeTruthy(); expect(block.zh).toBeTruthy(); }
      }
      for (const formula of lesson.formulas) {
        expect(formula.latex).toBeTruthy(); expect(formula.nameZh).toBeTruthy();
        expect(formula.symbols?.length).toBeGreaterThan(0);
        expect(formula.rearrangements.length).toBeGreaterThan(0);
        for (const sym of formula.symbols ?? []) { expect(sym.meaning).toBeTruthy(); expect(sym.meaningZh).toBeTruthy(); expect(sym.unit).toBeTruthy(); }
        expect(formulaSheet.some(f => f.latex === formula.latex && f.rearrangements?.length)).toBe(true);
      }
    }
  });
  it('has original practice with unique IDs, bilingual answers and correct mark totals', () => {
    expect(new Set(lessonQuestions.map(q => q.id)).size).toBe(lessonQuestions.length);
    for (const q of lessonQuestions) {
      expect(q.isOriginal).toBe(true); expect(q.parts.length).toBeGreaterThan(0);
      expect(q.totalMarks).toBe(q.parts.reduce((sum, p) => sum + p.marks, 0));
      expect(practiceQuestions.some(p => p.id === q.id)).toBe(true);
      for (const p of q.parts) { expect(p.questionZh).toBeTruthy(); expect(p.answer).toBeTruthy(); expect(p.answerZh).toBeTruthy(); }
    }
  });
  it('removes the old incorrectly labelled mean-energy formula from displayed gas formulas', () => {
    const gas = topics.find(t => t.id === 'gases-kinetic-theory')!;
    expect(gas.formulas.length).toBe(lessonByTopic[gas.id].formulas.length);
    expect(gas.examTips.some(t => t.en.startsWith('The three core formulae'))).toBe(false);
    expect(gas.formulas.some(f => f.latex.includes('N_A'))).toBe(true);
    expect(gas.formulas.some(f => f.latex.includes('rms'))).toBe(true);
  });
  it('keeps the full previous topic list and an expanded original question bank', () => {
    expect(topics.length).toBeGreaterThanOrEqual(23);
    expect(lessonQuestions.length).toBeGreaterThanOrEqual(21);
  });
});
