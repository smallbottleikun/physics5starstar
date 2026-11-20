import type { ReaderSolution } from "./exam-reader-data";
export type AnswerPart = { label: string; answer: string; answerZh: string };
export function getAnswerParts(solution: ReaderSolution, labels?: readonly string[]): AnswerPart[] {
  const split=(text:string)=>{
    // The original question is already shown by its PDF. Do not parse a quoted
    // prompt as a second set of answer parts (notably 2024–25 Q10).
    text=text.replace(/^(?:Original question:|原題：)[\s\S]*?\n\s*\n/, "");
    const markers=Array.from(text.matchAll(/(?:\([a-z]\)\([ivx]+\)|\([a-z]\))\s/gi));
    if(!markers.length) return [text.trim()].filter(Boolean);
    return markers.map((marker,index)=>text.slice(marker.index ?? 0,markers[index+1]?.index ?? text.length).trim()).filter(Boolean);
  };
  const answers=split(solution.answer), chinese=split(solution.answerZh);
  const all=answers.map((answer,index)=>({
    label:answer.match(/^\([a-z]\)(?:\([ivx]+\))?/i)?.[0] ?? "整題答案",
    answer:answer.replace(/^\([a-z]\)(?:\([ivx]+\))?\s*/i,""),
    answerZh:(chinese[index]??solution.answerZh).replace(/^\([a-z]\)(?:\([ivx]+\))?\s*/i,""),
  }));
  return labels ? all.filter(part=>labels.some(label=>part.label===label||part.label.startsWith(label))) : all;
}
