export type MarkingStep = {
  step: number;
  formula: string;
  substitution: string;
  working?: string;
  unit?: string;
  answer?: string;
};
export type MarkingPoint = string | { code: string; point: string; verified?: boolean };
export type DetailedMarkingPart = {
  label: string;
  marks: number;
  original: string;
  originalZh: string;
  markingPoints: MarkingPoint[];
  steps: MarkingStep[];
  reasoningZh: string;
  reasoning: string;
  formulas: string[];
  commonMistakes: string[];
};
export type DetailedMarkingGuide = {
  question: number;
  yearId: string;
  title: string;
  titleZh: string;
  status: string;
  statusReason?: string;
  summary: string;
  parts?: DetailedMarkingPart[];
  subquestions?: DetailedMarkingPart[];
};
const modules = import.meta.glob("./exam-marking/**/*.json", { eager: true, import: "default" }) as Record<string, DetailedMarkingGuide>;
const guides = Object.values(modules);
export function getDetailedMarkingGuide(yearId: string, question: number): DetailedMarkingGuide | undefined {
  return guides.find(guide => guide.yearId === yearId && guide.question === question);
}
export function getMarkingParts(guide: DetailedMarkingGuide): DetailedMarkingPart[] {
  return guide.parts ?? guide.subquestions ?? [];
}
