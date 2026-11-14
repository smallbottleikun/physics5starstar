import { longAnswerIndex } from "./exam-audit";
import { longAnswerSolutions } from "./long-answer-solutions";
import { longAnswer2425, mcqAnswer2425 } from "./self-answers-2425";
import { examAnswerTranslations } from "./exam-answer-translations";

export type PaperSection = "mc" | "sq";
export interface ReaderStep { label: string; en: string; zh: string; }
export interface ReaderSolution {
  yearId: string; question: number; title: string; titleZh: string;
  answer: string; answerZh: string; formulas: string[];
  explanation: string; explanationZh: string; steps?: ReaderStep[]; sourceNotes?: string;
}
export interface SourcePage { page: number; questions: number[]; label?: string; }
export interface ReaderYear {
  id: string; year: string; note: string; referenceOnly: boolean;
  source: Record<PaperSection, string>; pages: Record<PaperSection, SourcePage[]>;
  markingScheme?: string; mcAnswers: string[];
}
const consecutive = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const mcPages = (first: number, ranges: number[][]): SourcePage[] => ranges.map((questions, i) => ({ page: first + i, questions }));
const original = {
  mc2324: "/manus-storage/5x1_2324_A_MCQ_7e90b785.pdf",
  sq2324: "/manus-storage/5x1_2324_B_SQ_b6c8ec37.pdf",
  combined2425: "/manus-storage/physics_2425_single_pages_clean_30c409ae.pdf",
  mc2526: "/manus-storage/5x1_2526_A_MCQ_ed55c2c6.pdf",
  sq2526: "/manus-storage/5x1_2526_B_SQ_ae475168.pdf",
};
export const readerYears: ReaderYear[] = [
  {
    id: "2526", year: "2025–26", note: "原版試卷＋隨題答案與中文講解", referenceOnly: false,
    source: { mc: original.mc2526, sq: original.sq2526 },
    markingScheme: "/manus-storage/5x1_2526_ans_970d2fa6.pdf",
    mcAnswers: ["B","A","D","C","B","A","B","C","A","D","C","D","A","B","C","B","D","B","D","C","A","B","C","A","D","D","C"],
    pages: {
      mc: mcPages(2, [[1,2],[3,4],[5,6,7],[8,9],[10,11,12],[13,14],[15,16],[17,18],[19,20],[21,22,23],[24,25],[26,27]]),
      sq: [
        ...consecutive(1,5).map(q => ({ page: q + 1, questions: [q] })),
        { page: 7, questions: [], label: "Q6 題幹與圖 6.2／6.3（續頁作答）" },
        { page: 8, questions: [6] },
        ...consecutive(7,10).map(q => ({ page: q + 2, questions: [q] })),
      ],
    },
  },
  {
    id: "2425", year: "2024–25", note: "原掃描卷＋自行解題的參考答案（非學校評分標準）", referenceOnly: true,
    source: { mc: original.combined2425, sq: original.combined2425 },
    mcAnswers: mcqAnswer2425,
    pages: {
      // Losslessly split spreads into actual portrait PDF pages, left then right; scans stay unchanged.
      mc: [
        { page: 3, questions: consecutive(1,6) }, { page: 4, questions: consecutive(7,12) },
        { page: 5, questions: consecutive(13,16) }, { page: 6, questions: consecutive(17,20) },
        { page: 7, questions: consecutive(21,23) }, { page: 8, questions: consecutive(24,27) },
      ],
      sq: [
        ...consecutive(1,7).map(q => ({ page: q + 9, questions: [q] })),
        { page: 17, questions: [8], label: "SQ Q8(a)–(c)（單頁）" },
        { page: 18, questions: [], label: "SQ Q9(a)–(b)(i)（下一頁續題）" },
        { page: 19, questions: [9], label: "SQ Q9(b)(ii)–(c)（續頁完整題目）" },
        { page: 20, questions: [10] },
      ],
    },
  },
  {
    id: "2324", year: "2023–24", note: "原版試卷＋隨題答案與中文講解", referenceOnly: false,
    source: { mc: original.mc2324, sq: original.sq2324 },
    markingScheme: "/manus-storage/5x1_2324_ans_a8751f54.pdf",
    mcAnswers: ["B","C","D","B","A","A","B","A","C","D","B","B","D","C","A","D","A","B","C","D","C","B","A","C","D","A","D"],
    pages: {
      mc: mcPages(2, [[1,2,3],[4,5,6],[7,8,9],[10,11],[12,13,14],[15,16,17],[18,19],[20,21],[22,23,24],[25,26],[27]]),
      sq: [
        ...consecutive(1,9).map(q => ({ page: q + 1, questions: [q] })),
        { page: 11, questions: [], label: "Q10(a)–(b)(i)（續頁有 (b)(ii) 與完整解說）" },
        { page: 12, questions: [10] },
      ],
    },
  },
];

const checkedModules = import.meta.glob("./exam-solutions/*.json", { eager: true, import: "default" }) as Record<string, ReaderSolution>;
const checkedSolutions = Object.values(checkedModules);
export function getReaderSolution(year: ReaderYear, question: number): ReaderSolution | undefined {
  const checked = checkedSolutions.find(s => s.yearId === year.id && s.question === question);
  if (checked) return checked;
  if (year.id === "2425") {
    const s = longAnswer2425.find(s => s.question === `Q${question}`);
    return s ? { ...s, question, yearId: year.id, title: `SQ Q${question}`, titleZh: "長答题", explanationZh: s.answerZh } : undefined;
  }
  const s = longAnswerSolutions[`${year.year}-Q${question}`];
  const meta = longAnswerIndex.find(q => q.year === year.year && q.question === `Q${question}`);
  return s ? { ...s, yearId: year.id, question, title: meta?.title ?? `SQ Q${question}`, titleZh: meta?.titleZh ?? "長答題", answerZh: examAnswerTranslations[`${year.id}-${question}`] ?? s.explanationZh } : undefined;
}

export function questionPage(year: ReaderYear, section: PaperSection, question: number): number | undefined {
  if (section === "sq" && year.id === "2526" && question === 6) return 7;
  if (section === "sq" && year.id === "2324" && question === 10) return 11;
  if (section === "sq" && year.id === "2425" && question === 8) return 17;
  if (section === "sq" && year.id === "2425" && question === 9) return 19;
  return year.pages[section].find(p => p.questions.includes(question))?.page;
}
