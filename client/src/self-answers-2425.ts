export interface SelfAnswer2425 {
  question: string; answer: string; answerZh: string; formulas: string[];
  explanation: string; explanationZh: string;
}

// Reference choices from the existing answer key; no school MC marking scheme was supplied.
export const mcqAnswer2425 = ["C", "C", "B", "D", "A", "B", "A", "B", "A", "D", "B", "B", "A", "C", "B", "C", "C", "D", "C", "C", "C", "C", "D", "D", "C", "A", "D"];

type CheckedAnswer = Omit<SelfAnswer2425, "question"> & { question: number };
const modules = import.meta.glob("./exam-solutions/2425-q*.json", { eager: true, import: "default" }) as Record<string, CheckedAnswer>;
export const longAnswer2425: SelfAnswer2425[] = Object.values(modules)
  .sort((a, b) => a.question - b.question)
  .map(answer => ({ ...answer, question: `Q${answer.question}` }));
