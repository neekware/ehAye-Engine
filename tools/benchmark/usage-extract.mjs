#!/usr/bin/env node
/**
 * usage-extract.mjs — Benchmark usage extractor (public harness)
 *
 * Reads a usage SQLite DB that contains `usage_events` rows and emits a clean
 * JSON summary comparing PRIMARY (role='primary') vs SECONDARY (role='secondary')
 * so a lane can render a table without needing product source.
 *
 * Unlike a product-internal extractor, this public copy NEVER hardcodes private
 * config paths. You always pass the DB path explicitly:
 *
 *   node tools/benchmark/usage-extract.mjs --db /path/to/usage.db
 *   node tools/benchmark/usage-extract.mjs --db ./local.db --since 1710000000000
 *   node tools/benchmark/usage-extract.mjs --db ./local.db --out runs/run-a.json
 *   npm run bench:usage -- --db /path/to/usage.db --quiet
 *
 * OUTPUT
 *   Default write path: temp/bench/usage-custom.json (gitignored under temp/).
 *   Prints JSON to stdout unless --quiet is set.
 *
 * SCHEMA EXPECTED (minimum)
 *   usage_events(
 *     role, model, provider_name,
 *     input_tokens, output_tokens, reasoning_tokens,
 *     cache_read_tokens, cache_write_tokens,
 *     tool_call_count,
 *     image_generation_count, video_generation_count, tts_count, stt_count,
 *     ttft_ms, api_duration_ms, created_at_ms
 *   )
 *
 * Cost is intentionally not stored — derive $ from tokens × price sheet at report time.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const valOf = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : undefined;
};

const ROOT = process.cwd();

function resolveDbPath() {
  if (has('--db')) return valOf('--db');
  console.error(
    [
      'ERROR: pass an explicit usage DB path.',
      '  node tools/benchmark/usage-extract.mjs --db /path/to/usage.db',
      '  npm run bench:usage -- --db /path/to/usage.db',
      '',
      'This public harness does not resolve product-internal config paths.',
    ].join('\n')
  );
  process.exit(2);
}

const dbPath = resolveDbPath();
if (!dbPath || !existsSync(dbPath)) {
  console.error('ERROR: usage DB not found. Check --db path.');
  process.exit(2);
}

const sinceMs = has('--since') ? Number(valOf('--since')) : 0;

const db = new DatabaseSync(dbPath, { readOnly: true });

const rows = db
  .prepare(
    `
    SELECT
      COALESCE(role, 'unlabeled')        AS role,
      model,
      provider_name                      AS provider,
      COUNT(*)                           AS events,
      SUM(input_tokens)                  AS input_tokens,
      SUM(output_tokens)                 AS output_tokens,
      SUM(reasoning_tokens)              AS reasoning_tokens,
      SUM(cache_read_tokens)             AS cache_read_tokens,
      SUM(cache_write_tokens)            AS cache_write_tokens,
      SUM(tool_call_count)               AS tool_calls,
      SUM(image_generation_count)        AS images,
      SUM(video_generation_count)        AS videos,
      SUM(tts_count)                     AS tts,
      SUM(stt_count)                     AS stt,
      AVG(ttft_ms)                       AS avg_ttft_ms,
      MIN(ttft_ms)                       AS min_ttft_ms,
      MAX(ttft_ms)                       AS max_ttft_ms,
      AVG(api_duration_ms)               AS avg_latency_ms,
      MAX(api_duration_ms)               AS max_latency_ms
    FROM usage_events
    WHERE created_at_ms >= ?
    GROUP BY role, model, provider
    ORDER BY role, output_tokens DESC
  `
  )
  .all(sinceMs);

db.close();

const round = (n) => (n == null ? null : Math.round(n));
const bucket = { primary: [], secondary: [], unlabeled: [] };
for (const r of rows) {
  const tier = bucket[r.role] ? r.role : 'unlabeled';
  bucket[tier].push({
    model: r.model,
    provider: r.provider,
    events: r.events,
    tokens: {
      input: r.input_tokens,
      output: r.output_tokens,
      reasoning: r.reasoning_tokens,
      cache_read: r.cache_read_tokens,
      cache_write: r.cache_write_tokens,
      total: r.input_tokens + r.output_tokens,
    },
    tool_calls: r.tool_calls,
    media: { images: r.images, videos: r.videos, tts: r.tts, stt: r.stt },
    ttft_ms: { avg: round(r.avg_ttft_ms), min: r.min_ttft_ms, max: r.max_ttft_ms },
    latency_ms: { avg: round(r.avg_latency_ms), max: r.max_latency_ms },
  });
}

const summarize = (list) =>
  list.reduce(
    (acc, m) => {
      acc.events += m.events;
      acc.input_tokens += m.tokens.input;
      acc.output_tokens += m.tokens.output;
      acc.tool_calls += m.tool_calls;
      return acc;
    },
    { events: 0, input_tokens: 0, output_tokens: 0, tool_calls: 0 }
  );

const out = {
  generated_at: new Date().toISOString(),
  source: 'custom',
  since_ms: sinceMs || null,
  primary: { totals: summarize(bucket.primary), models: bucket.primary },
  secondary: { totals: summarize(bucket.secondary), models: bucket.secondary },
  unlabeled: bucket.unlabeled.length ? { models: bucket.unlabeled } : undefined,
  note: 'Cost not stored per event — derive $ from tokens × each model price sheet at report time.',
};

const json = JSON.stringify(out, null, 2);

const defaultOut = path.resolve(ROOT, 'temp/bench', 'usage-custom.json');
const outPath = has('--out') ? valOf('--out') : defaultOut;
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, json);
console.error(
  `✅ Wrote ${path.relative(ROOT, outPath)}  (${out.primary.models.length} primary / ${out.secondary.models.length} secondary models)`
);

if (!has('--quiet')) console.log(json);
