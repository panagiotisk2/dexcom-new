import fs from 'fs';
import path from 'path';
import GlucoseChart from '@/components/GlucoseChart';
import { computeKPIs } from '@/server/metrics';

type Egv = { systemTime: string, value: number };

async function getData() {
  // Use saved EGVS if exist; otherwise mock data
  const file = path.join(process.cwd(), '.data', 'egvs.json');
  let egvs: Egv[] = [];
  try {
    const map = JSON.parse(fs.readFileSync(file,'utf8'));
    egvs = (map['demo-client-1']||[]);
  } catch {}
  if (egvs.length === 0) {
    const mock = JSON.parse(fs.readFileSync(path.join(process.cwd(),'src/mock/egvs.json'),'utf8'));
    egvs = mock.egvs;
  }
  const chart = egvs.map((d:any)=>({ time: d.systemTime, value: d.value }));
  const kpis = computeKPIs(egvs);
  return { chart, kpis, count: egvs.length };
}

export default async function Page() {
  const { chart, kpis, count } = await getData();
  return (
    <div className="grid" style={{gap:16}}>
      <div className="header">
        <div>
          <h1 style={{margin:0}}>Client Overview</h1>
          <div className="subtle">Data points: {count.toLocaleString()}</div>
        </div>
        <div className="toolbar">
          <form action="/api/dexcom/sync" method="post">
            <button className="button brand">Sync from Dexcom</button>
          </form>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card kpi">
          <div className="label">Avg Glucose</div>
          <div className="value">{kpis.avg.toFixed(0)} mg/dL</div>
        </div>
        <div className="card kpi">
          <div className="label">Time in Range (70-180)</div>
          <div className="value">{kpis.tir.toFixed(1)}%</div>
        </div>
        <div className="card kpi">
          <div className="label">GMI</div>
          <div className="value">{kpis.gmi.toFixed(2)}%</div>
        </div>
      </div>

      <div className="card">
        <div className="header"><h3 style={{margin:0}}>Glucose (last 48h)</h3></div>
        <GlucoseChart data={chart.slice(-96)} />
      </div>
    </div>
  );
}
