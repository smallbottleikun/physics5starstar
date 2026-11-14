export interface SplitInkRegion {
  x0: number; x1: number; y0?: number; y1?: number;
}
interface Point { x: number; y: number; pressure: number; }
export interface SplitInkStroke {
  points: Point[]; color: string; width: number;
  kind: "pen" | "highlighter" | "ruler"; opacity?: number;
}

/** Clip normalized legacy spread strokes into one printed page, without mutating the source. */
export function remapSplitInk(input: unknown, region: SplitInkRegion): SplitInkStroke[] {
  const { x0, x1 } = region;
  const y0 = region.y0 ?? 0, y1 = region.y1 ?? 1;
  if (!Array.isArray(input) || ![x0,x1,y0,y1].every(Number.isFinite) || x1 <= x0 || y1 <= y0) return [];
  const inside = (p: Point) => p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1;
  const mapped = (p: Point): Point => ({ x: (p.x-x0)/(x1-x0), y: (p.y-y0)/(y1-y0), pressure: p.pressure });
  const same = (a: Point, b: Point) => Math.abs(a.x-b.x) < 1e-9 && Math.abs(a.y-b.y) < 1e-9;
  const segment = (a: Point, b: Point): [Point,Point] | null => {
    const dx=b.x-a.x, dy=b.y-a.y;
    let lower=0, upper=1;
    const p=[-dx,dx,-dy,dy], q=[a.x-x0,x1-a.x,a.y-y0,y1-a.y];
    for(let i=0;i<4;i++) {
      if(p[i]===0) { if(q[i]<0) return null; continue; }
      const t=q[i]/p[i];
      if(p[i]<0) lower=Math.max(lower,t); else upper=Math.min(upper,t);
      if(lower>upper) return null;
    }
    const at=(t:number):Point=>({x:a.x+dx*t,y:a.y+dy*t,pressure:a.pressure+(b.pressure-a.pressure)*t});
    return [at(lower),at(upper)];
  };
  const output: SplitInkStroke[]=[];
  for(const raw of input) {
    if(!raw || !Array.isArray(raw.points) || !Number.isFinite(raw.width) || raw.width<=0 || typeof raw.color!=="string" || !["pen","highlighter","ruler"].includes(raw.kind)) continue;
    const points:Point[]=raw.points;
    if(!points.length || !points.every(p=>p && [p.x,p.y,p.pressure].every(Number.isFinite))) continue;
    const publish=(part:Point[])=>{if(part.length) output.push({color:raw.color,width:raw.width/(x1-x0),kind:raw.kind, ...(typeof raw.opacity === "number" ? {opacity:raw.opacity} : {}),points:part.map(mapped)});};
    if(points.length===1) { if(inside(points[0])) publish([points[0]]); continue; }
    let current:Point[]=[];
    for(let i=1;i<points.length;i++) {
      const clipped=segment(points[i-1],points[i]);
      if(!clipped) { publish(current); current=[]; continue; }
      const [a,b]=clipped;
      if(current.length && !same(current[current.length-1],a)) { publish(current); current=[]; }
      if(!current.length) current.push(a);
      if(!same(current[current.length-1],b)) current.push(b);
      if(!inside(points[i])) { publish(current); current=[]; }
    }
    publish(current);
  }
  return output;
}
