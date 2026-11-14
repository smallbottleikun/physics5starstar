import { describe, expect, it } from "vitest";
import { remapSplitInk } from "./split-paper-ink";
const point=(x:number,y=.4)=>({x,y,pressure:.6});
const stroke=(xs:number[])=>({kind:"pen",color:"#2563eb",width:.0025,points:xs.map(x=>point(x))});
describe("split PDF legacy ink migration",()=>{
  it("moves only left ink to the left page and preserves its physical thickness",()=>{
    const old=[stroke([.1,.2]),stroke([.7,.8])];
    const saved=JSON.stringify(old);
    const result=remapSplitInk(old,{x0:0,x1:.5});
    expect(result).toHaveLength(1);expect(result[0].points.map(p=>p.x)).toEqual([.2,.4]);
    expect(result[0].width).toBe(.005);expect(result[0].color).toBe("#2563eb");expect(JSON.stringify(old)).toBe(saved);
  });
  it("moves right ink without showing left-page ink",()=>{
    const result=remapSplitInk([stroke([.2,.3]),stroke([.6,.7])],{x0:.5,x1:1});
    expect(result).toHaveLength(1);expect(result[0].points[0].x).toBeCloseTo(.2);expect(result[0].points[1].x).toBeCloseTo(.4);
  });
  it("clips a crossing stroke at the gutter rather than joining unrelated points",()=>{
    const old=[stroke([.25,.75,.25])];
    for(const region of [{x0:0,x1:.5},{x0:.5,x1:1}]) {
      const result=remapSplitInk(old,region);
      expect(result.length).toBeGreaterThan(0);
      for(const s of result) for(const p of s.points) {expect(p.x).toBeGreaterThanOrEqual(0);expect(p.x).toBeLessThanOrEqual(1);}
    }
  });
  it("preserves dots, pressure and highlighter opacity",()=>{
    const result=remapSplitInk([{...stroke([.7]),kind:"highlighter",opacity:.3}],{x0:.5,x1:1});
    expect(result[0]).toMatchObject({kind:"highlighter",opacity:.3});expect(result[0].points[0].pressure).toBe(.6);
  });
  it("normalizes cropped page height and rejects invalid data",()=>{
    const result=remapSplitInk([stroke([.2])],{x0:0,x1:.5,y0:0,y1:.8});
    expect(result[0].points[0].y).toBe(.5);
    expect(remapSplitInk([stroke([.2])],{x0:1,x1:0})).toEqual([]);
    expect(remapSplitInk(null,{x0:0,x1:.5})).toEqual([]);
  });
});
