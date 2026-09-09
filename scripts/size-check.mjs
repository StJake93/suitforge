// T-PERF-03: initial JS payload (gzip) must be <= 700 kB.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const LIMIT = 700 * 1024;
const dir = 'dist/assets';
let total = 0;
for (const f of readdirSync(dir)) {
  if (!f.endsWith('.js')) continue;
  const p = join(dir, f);
  const gz = gzipSync(readFileSync(p)).length;
  total += gz;
  console.log(`${f.padEnd(40)} ${(statSync(p).size / 1024).toFixed(0).padStart(6)} kB  gzip ${(gz / 1024).toFixed(0).padStart(5)} kB`);
}
console.log(`total gzip ${(total / 1024).toFixed(0)} kB (limit ${LIMIT / 1024} kB)`);
if (total > LIMIT) {
  console.error('T-PERF-03 FAILED: bundle over budget');
  process.exit(1);
}
