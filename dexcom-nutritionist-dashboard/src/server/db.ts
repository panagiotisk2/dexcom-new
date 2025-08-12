import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), '.data');
const tokPath = path.join(dataDir, 'tokens.json');
const egvPath = path.join(dataDir, 'egvs.json');

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(tokPath)) fs.writeFileSync(tokPath, JSON.stringify({}), 'utf8');
  if (!fs.existsSync(egvPath)) fs.writeFileSync(egvPath, JSON.stringify({}), 'utf8');
}

export function saveToken(clientId: string, token: any) {
  ensure();
  const map = JSON.parse(fs.readFileSync(tokPath,'utf8'));
  map[clientId] = token;
  fs.writeFileSync(tokPath, JSON.stringify(map,null,2),'utf8');
}

export function getToken(clientId: string) {
  ensure();
  const map = JSON.parse(fs.readFileSync(tokPath,'utf8'));
  return map[clientId];
}

export function appendEgvs(clientId: string, egvs: any[]) {
  ensure();
  const map = JSON.parse(fs.readFileSync(egvPath,'utf8'));
  map[clientId] = [...(map[clientId]||[]), ...egvs];
  fs.writeFileSync(egvPath, JSON.stringify(map,null,2),'utf8');
}

export function getEgvs(clientId: string) {
  ensure();
  const map = JSON.parse(fs.readFileSync(egvPath,'utf8'));
  return map[clientId] || [];
}
