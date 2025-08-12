export type Egv = { systemTime: string, value: number };

export function computeKPIs(data: Egv[]) {
  if (!data.length) return { avg: 0, sd: 0, cv: 0, tir: 0, gmi: 0 };
  const values = data.map(d => d.value);
  const n = values.length;
  const avg = values.reduce((a,b)=>a+b,0)/n;
  const sd = Math.sqrt(values.reduce((a,b)=>a+(b-avg)**2,0)/n);
  const cv = (sd/avg)*100;
  const tir = (values.filter(v => v>=70 && v<=180).length / n) * 100;
  // GMI (%) approximate formula from literature (mg/dL): GMI = 3.31 + 0.02392 * mean_glucose
  const gmi = 3.31 + 0.02392 * avg;
  return { avg, sd, cv, tir, gmi };
}

export function smooth(data: Egv[], k: number = 3): Egv[] {
  if (k<=1) return data;
  const res: Egv[] = [];
  for (let i=0;i<data.length;i++){
    const slice = data.slice(Math.max(0,i-k+1), i+1);
    const mean = slice.reduce((a,b)=>a+b.value,0)/slice.length;
    res.push({ ...data[i], value: Math.round(mean)});
  }
  return res;
}
