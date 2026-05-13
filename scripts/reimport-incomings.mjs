import fs from 'node:fs';
import { randomBytes } from 'node:crypto';
import { parse } from 'csv-parse/sync';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';

const csvPath = process.argv[2] ?? 'Alison Jeremy Finances - Incomings.csv';

if (!fs.existsSync(csvPath)) {
  throw new Error(`CSV not found: ${csvPath}`);
}

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/^VITE_CONVEX_URL=(.+)$/m);
if (!match) {
  throw new Error('Missing VITE_CONVEX_URL in .env.local');
}
const client = new ConvexHttpClient(match[1].trim());

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function makeId16() {
  const bytes = randomBytes(16);
  let out = '';
  for (let i = 0; i < 16; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

function toAmount(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const n = Number(cleaned || '0');
  return Number.isFinite(n) ? n : 0;
}

const csv = fs.readFileSync(csvPath, 'utf8');
const records = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  bom: true,
});

const rows = records.map((r) => ({
  incoming: String(r.Incoming ?? ''),
  paidBy: String(r.PaidBy ?? ''),
  incomeType: String(r.IncomeType ?? ''),
  account: String(r.Account ?? ''),
  amount: toAmount(r.Amount),
  date: String(r.Date ?? ''),
  monthYear: String(r.MonthYear ?? ''),
  notes: r.Notes ? String(r.Notes) : undefined,
  comments: r.Comments ? String(r.Comments) : undefined,
  incomingId: makeId16(),
}));

console.log(`Parsed ${rows.length} CSV rows.`);

let totalDeleted = 0;
for (;;) {
  const { deleted, done } = await client.mutation(api.incomings.clearAll, { batchSize: 200 });
  totalDeleted += deleted;
  if (done) break;
}
console.log(`Deleted ${totalDeleted} existing incomings.`);

let inserted = 0;
const chunkSize = 100;
for (let i = 0; i < rows.length; i += chunkSize) {
  const chunk = rows.slice(i, i + chunkSize);
  await client.mutation(api.incomings.bulkCreate, { rows: chunk });
  inserted += chunk.length;
  console.log(`Inserted ${inserted}/${rows.length}...`);
}

console.log(`Done. Imported ${inserted} incomings with new 16-char IDs.`);
