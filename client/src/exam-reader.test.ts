import { describe, it, expect } from "vitest";
import { readerYears, getReaderSolution, questionPage, pageQuestionNumbers, readerPageLabel, legacyPageInkRegion } from "./exam-reader-data";
import { getAnswerParts } from "./exam-answer-parts";
import regions from "./exam-single-page-regions.json";

describe("original single-page PDF reader", () => {
  it("every year has all 27 MC and 10 SQ questions exactly once in the complete-question mapping", () => {
    for (const y of readerYears) {
      expect(y.mcAnswers).toHaveLength(27);
      for (const [section, count] of [["mc", 27], ["sq", 10]] as const) {
        const qs = y.pages[section].flatMap(p => p.questions).sort((a,b) => a-b);
        expect(qs).toEqual(Array.from({length:count},(_,i) => i+1));
        for (const q of qs) expect(questionPage(y,section,q)).toBeGreaterThan(0);
      }
    }
  });
  it("all 30 SQ answers are available with Chinese explanation", () => {
    for (const y of readerYears) for(let q=1;q<=10;q++) {
      const s = getReaderSolution(y,q);
      expect(s?.answer.length).toBeGreaterThan(10);
      expect(s?.answerZh.length).toBeGreaterThan(10);
      expect(s?.explanationZh.length).toBeGreaterThan(10);
      expect(s?.formulas.length).toBeGreaterThan(0);
    }
  });
  it("2024–25 Q1 and Q2 have separate portrait PDF pages, not one horizontal spread", () => {
    const y=readerYears.find(y=>y.id==="2425")!;
    expect(y.source.mc).toContain("physics_2425_levelled_single");
    expect(regions).toHaveLength(20);
    expect(regions.every(r=>r.width<r.height)).toBe(true);
    expect(y.pages.sq[0]).toEqual({page:10,questions:[1]});
    expect(y.pages.sq[1]).toEqual({page:11,questions:[2]});
    expect(questionPage(y,"sq",1)).toBe(10);
    expect(questionPage(y,"sq",2)).toBe(11);
    expect(y.pages.mc.find(p=>p.page===3)?.questions).toEqual([1,2,3,4,5,6]);
    expect(y.pages.mc.find(p=>p.page===4)?.questions).toEqual([7,8,9,10,11,12]);
    expect(y.pages.mc.find(p=>p.page===8)?.questions).toEqual([24,25,26,27]);
    expect(questionPage(y,"sq",8)).toBe(17);
    expect(questionPage(y,"sq",9)).toBe(18);
    expect(questionPage(y,"sq",10)).toBe(20);
  });
  it("Q8 and Q9 subanswers occur only below the printed page containing that subquestion",()=>{
    const y=readerYears.find(y=>y.id==="2425")!;
    const labels=(page:number,q:number)=>{
      const p=y.pages.sq.find(p=>p.page===page)!;
      expect(pageQuestionNumbers(p)).toContain(q);
      return getAnswerParts(getReaderSolution(y,q)!,p.answerParts?.[q]).map(p=>p.label);
    };
    expect(labels(17,8)).toEqual(["(a)","(b)","(c)"]);
    expect(labels(18,8)).toEqual(["(d)"]);
    expect(labels(18,9)).toEqual(["(a)","(b)(i)"]);
    expect(labels(19,9)).toEqual(["(b)(ii)","(b)(iii)","(c)"]);
    for(const q of [8,9]) {
      const all=y.pages.sq.filter(p=>pageQuestionNumbers(p).includes(q)).flatMap(p=>labels(p.page,q));
      expect(all).toEqual(getAnswerParts(getReaderSolution(y,q)!).map(p=>p.label));
      expect(new Set(all).size).toBe(all.length);
    }
  });
  it("every partial answer includes the matching Chinese translation",()=>{
    const y=readerYears.find(y=>y.id==="2425")!;
    for(const page of y.pages.sq) for(const q of pageQuestionNumbers(page)) {
      const parts=getAnswerParts(getReaderSolution(y,q)!,page.answerParts?.[q]);
      expect(parts.length).toBeGreaterThan(0);
      for(const part of parts) { expect(part.answer.length).toBeGreaterThan(5);expect(part.answerZh).toMatch(/[\u4e00-\u9fff]/); }
    }
  });
  it("single-page ink uses a new key and the exact old spread region",()=>{
    const y=readerYears.find(y=>y.id==="2425")!;
    expect(readerPageLabel(y,"sq",10)).toBe("2024–25 SQ 單頁第 10 頁");
    expect(legacyPageInkRegion(y,"sq",10)).toMatchObject({pageLabel:"2024–25 SQ 原卷第 6 頁",x0:0,x1:.5});
    expect(legacyPageInkRegion(y,"sq",11)).toMatchObject({pageLabel:"2024–25 SQ 原卷第 6 頁",x0:.5,x1:1});
    expect(readerPageLabel(readerYears[0],"sq",2)).toBe("2025–26 SQ 原卷第 2 頁");
  });
  it("corrected grating and speaker answers replace legacy claims", () => {
    const y=readerYears.find(y=>y.id==="2425")!;
    expect(getReaderSolution(y,10)?.answer).toContain("651");
    expect(getReaderSolution(y,6)?.explanationZh).toMatch(/相消|破壞/);
    expect(getReaderSolution(y,5)?.answer).toMatch(/0\.0302|3\.02/);
    expect(getReaderSolution(y,8)?.answer).toContain("(d)");
    const q10=getAnswerParts(getReaderSolution(y,10)!);
    expect(q10.map(p=>p.label)).toEqual(["(a)","(b)","(c)","(d)"]);
    expect(q10[0].answer).toContain("W is violet");
    expect(q10[0].answerZh).toContain("W 是紫光");
  });
  it("multilayer mirage calculation uses near-90-degree incidence, not legacy 58 degrees", () => {
    const y=readerYears.find(y=>y.id==="2526")!;
    expect(getReaderSolution(y,6)?.answer).toMatch(/89\.4|89\.5/);
    expect(getReaderSolution(y,1)?.answer).toContain("125.5");
    expect(getReaderSolution(y,1)?.formulas.join(" ")).toContain("= 3(4200)");
  });
});
