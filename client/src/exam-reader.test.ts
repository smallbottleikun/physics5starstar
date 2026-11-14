import { describe, it, expect } from "vitest";
import { readerYears, getReaderSolution, questionPage } from "./exam-reader-data";

describe("original PDF reader", () => {
  it("every year has all 27 MC and 10 SQ questions exactly once in the answer mapping", () => {
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
  it("the 2024–25 split PDF maps each printed page and continuation correctly", () => {
    const y=readerYears.find(y=>y.id==="2425")!;
    expect(y.source.mc).toContain("physics_2425_single_pages");
    expect(y.pages.mc.find(p=>p.page===3)?.questions).toEqual([1,2,3,4,5,6]);
    expect(y.pages.mc.find(p=>p.page===8)?.questions).toEqual([24,25,26,27]);
    expect(y.pages.sq.find(p=>p.page===17)?.questions).toEqual([8]);
    expect(y.pages.sq.find(p=>p.page===18)?.questions).toEqual([]);
    expect(y.pages.sq.find(p=>p.page===19)?.questions).toEqual([9]);
    expect(questionPage(y,"sq",9)).toBe(19);
  });
  it("corrected grating and speaker answers replace legacy claims", () => {
    const y=readerYears.find(y=>y.id==="2425")!;
    expect(getReaderSolution(y,10)?.answer).toContain("651");
    expect(getReaderSolution(y,6)?.explanationZh).toMatch(/相消|破壞/);
    expect(getReaderSolution(y,5)?.answer).toMatch(/0\.0302|3\.02/);
  });
  it("multilayer mirage calculation uses near-90-degree incidence, not legacy 58 degrees", () => {
    const y=readerYears.find(y=>y.id==="2526")!;
    expect(getReaderSolution(y,6)?.answer).toMatch(/89\.4|89\.5/);
    expect(getReaderSolution(y,1)?.answer).toContain("125.5");
    expect(getReaderSolution(y,1)?.formulas.join(" ")).toContain("= 3(4200)");
  });
});
