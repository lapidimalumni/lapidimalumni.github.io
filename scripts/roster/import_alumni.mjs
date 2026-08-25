/**
 * Import reviewed alumni rows through the admin edge function.
 *
 *   node scripts/roster/import_alumni.mjs --dry-run
 *   node scripts/roster/import_alumni.mjs
 *
 * Input:  members_do_not_commit/import_review.csv  (from extract_roster.py)
 * Needs:  LAPIDIM_ADMIN_TOKEN -- your admin session token. Log in to the site
 *         as the admin, then in DevTools console:  localStorage.session_token
 *         Pass it as an env var, do not paste it into a file:
 *           $env:LAPIDIM_ADMIN_TOKEN = "..."   (PowerShell)
 *
 * Supabase URL and publishable key are read from .env.
 *
 * One POST per person, sequential. Progress is appended to
 * members_do_not_commit/import_done.log, and rows listed there are skipped on
 * the next run, so an interrupted import can simply be run again.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROSTER_DIR = 'members_do_not_commit'
const INPUT = path.join(ROSTER_DIR, 'import_review.csv')
const DONE_LOG = path.join(ROSTER_DIR, 'import_done.log')
const FAILURES = path.join(ROSTER_DIR, 'import_failures.csv')
const DELAY_MS = 150

const dryRun = process.argv.includes('--dry-run')

function readEnvFile(file) {
  if (!fs.existsSync(file)) return {}
  const out = {}
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

/** Minimal RFC4180 parser -- enough for quoted fields and embedded commas. */
function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1) // strip Excel's BOM
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') inQuotes = false
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  const [header, ...body] = rows.filter(r => r.some(c => c !== ''))
  return body.map(cells => Object.fromEntries(header.map((h, i) => [h.trim(), (cells[i] ?? '').trim()])))
}

const env = { ...readEnvFile('.env'), ...readEnvFile('.env.local'), ...process.env }
const supabaseUrl = env.VITE_SUPABASE_URL
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY
const sessionToken = process.env.LAPIDIM_ADMIN_TOKEN

if (!supabaseUrl || !publishableKey) {
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY missing from .env')
  process.exit(1)
}
if (!sessionToken && !dryRun) {
  console.error('LAPIDIM_ADMIN_TOKEN is not set.')
  console.error('Log in as the admin, then copy localStorage.session_token from DevTools.')
  process.exit(1)
}
if (!fs.existsSync(INPUT)) {
  console.error(`${INPUT} not found -- run scripts/roster/extract_roster.py first`)
  process.exit(1)
}

const rows = parseCsv(fs.readFileSync(INPUT, 'utf8'))
const done = fs.existsSync(DONE_LOG)
  ? new Set(fs.readFileSync(DONE_LOG, 'utf8').split(/\r?\n/).filter(Boolean))
  : new Set()

const problems = rows.filter(r => !r.email || !r.full_name_en || !r.full_name_he || !r.cohort_start)
if (problems.length) {
  console.error(`${problems.length} row(s) are missing a required field; fix them first:`)
  for (const r of problems.slice(0, 10)) console.error('   ', r.email || '(no email)', '|', r.full_name_he)
  process.exit(1)
}

const stillFlagged = rows.filter(r => r.needs_review === 'yes').length
if (stillFlagged && !dryRun) {
  console.warn(`warning: ${stillFlagged} row(s) still have needs_review=yes.`)
  console.warn('These names go onto certificates. Ctrl+C now if you have not reviewed them.\n')
}

const pending = rows.filter(r => !done.has(r.email))
console.log(`${rows.length} rows, ${done.size} already imported, ${pending.length} to send`)
if (dryRun) {
  console.log('\n--dry-run: nothing will be sent. First 5 payloads:\n')
  for (const r of pending.slice(0, 5)) {
    console.log(JSON.stringify({
      email: r.email,
      full_name_en: r.full_name_en,
      full_name_he: r.full_name_he,
      cohort_start: Number(r.cohort_start),
      linkedin_url: r.linkedin_url || null,
      role: 'alumni',
    }))
  }
  process.exit(0)
}

async function addAlumni(row) {
  const response = await fetch(`${supabaseUrl}/functions/v1/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify({
      session_token: sessionToken,
      action: 'add-alumni',
      alumni: {
        email: row.email,
        full_name_en: row.full_name_en,
        full_name_he: row.full_name_he,
        cohort_start: Number(row.cohort_start),
        linkedin_url: row.linkedin_url || null,
        role: 'alumni',
      },
    }),
  })
  const body = await response.json().catch(() => ({}))
  return { ok: response.ok && !body.error, status: response.status, error: body.error }
}

const failures = []
let created = 0, existed = 0

for (const [i, row] of pending.entries()) {
  const label = `[${i + 1}/${pending.length}] ${row.email}`
  let result
  try {
    result = await addAlumni(row)
  } catch (err) {
    result = { ok: false, error: String(err) }
  }

  if (result.ok) {
    created++
    fs.appendFileSync(DONE_LOG, row.email + '\n')
    console.log(`${label} ok`)
  } else if (/duplicate key|already exists/i.test(result.error || '')) {
    existed++
    fs.appendFileSync(DONE_LOG, row.email + '\n')
    console.log(`${label} already in the database`)
  } else if (result.status === 403) {
    console.error(`\n${label} 403 -- the session token is not an admin session, or it expired.`)
    console.error('Nothing further will be sent. Get a fresh token and run again.')
    break
  } else {
    failures.push({ ...row, error: result.error || `HTTP ${result.status}` })
    console.error(`${label} FAILED: ${result.error || result.status}`)
  }
  await new Promise(r => setTimeout(r, DELAY_MS))
}

console.log(`\ncreated ${created}, already present ${existed}, failed ${failures.length}`)
if (failures.length) {
  const header = 'email,full_name_he,full_name_en,cohort_start,error\n'
  const body = failures
    .map(f => [f.email, f.full_name_he, f.full_name_en, f.cohort_start, f.error]
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  fs.writeFileSync(FAILURES, header + body + '\n', 'utf8')
  console.log(`failures written to ${FAILURES} -- fix and re-run, imported rows are skipped`)
}
