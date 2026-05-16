# Reducing Supabase query latency from ~400ms to ~50ms

This document captures the diagnosis and the fixes applied to get
per-request Supabase latency down to roughly 50ms on Vercel.

The baseline (~400–500ms) is almost entirely explained by two things:

1. **Direct Postgres connections on serverless.** Every cold path opens
   a fresh TCP + TLS + SASL handshake against `db.<ref>.supabase.co:5432`.
   That's ~150–300ms before the query even runs.
2. **Region mismatch.** Vercel functions default to `iad1` (US‑East).
   If the Supabase project is in another region (e.g. `ap-southeast-1`),
   every query pays the cross‑region RTT.

The rest is application‑level: an auth waterfall on every server
action, and a few queries that fetch everything and count in JS.

---

## 1. Use the Supabase pooler (Supavisor) on port 6543

Direct connections to Postgres don't survive serverless well. Use
Supavisor (Supabase's PgBouncer-compatible pooler) for application
queries; keep the direct endpoint for migrations only.

**`.env` / Vercel env vars**

```bash
# App queries — transaction-mode pooler. <region> matches your Supabase project.
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Migrations only — direct, session-mode connection.
DIRECT_URL="postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres"
```

`pgbouncer=true` tells Prisma to disable prepared statements (PgBouncer
in transaction mode doesn't support them). `connection_limit=1` keeps
each serverless invocation to a single connection so a busy worker
doesn't exhaust the pool.

**`prisma/schema.prisma`**

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

`directUrl` is used by `prisma migrate` and `prisma db push` only.

> Find the region under Supabase Dashboard → Project Settings →
> Database → "Connection string". The pooler hostname tells you the
> region (e.g. `aws-1-ap-southeast-1.pooler.supabase.com`).

## 2. Co‑locate the Vercel function with the Supabase region

```json
// vercel.json
{ "regions": ["sin1"] }
```

Pick the Vercel region nearest your Supabase region:

| Supabase region    | Vercel region |
|--------------------|---------------|
| `ap-southeast-1`   | `sin1`        |
| `us-east-1`        | `iad1`        |
| `eu-west-1`        | `dub1`        |
| `ap-northeast-1`   | `hnd1`        |

Cross‑region RTT (200–300ms) collapses to <5ms intra‑region.

## 3. Deduplicate `syncUser()` per request

`syncUser()` runs on every server action and every page that needs
auth. It calls `supabase.auth.getUser()` (HTTP), then
`prisma.user.findUnique`, then an unconditional `prisma.user.upsert`.
That's 3 round trips before the action's real work.

Use React's `cache()` to memoize within a single request, and skip the
write when the user record hasn't changed:

```ts
import { cache } from 'react'

export const syncUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const email = user.email!
  const name = user.user_metadata.full_name || email.split('@')[0]
  const avatarUrl = user.user_metadata.avatar_url ?? null

  const existing = await prisma.user.findUnique({ where: { id: user.id } })
  if (existing && existing.email === email && existing.name === name && existing.avatarUrl === avatarUrl) {
    return existing
  }
  // …upsert / migrate-pending branch only when something changed.
})
```

`cache()` is keyed per request, so multiple `syncUser()` calls in the
same RSC tree share one result.

## 4. Replace `findMany` + JS filtering with `groupBy`

`getOverallStats` and `getProjectStats` fetch every task row just to
count statuses. Push the work to Postgres:

```ts
const counts = await prisma.task.groupBy({
  by: ['status'],
  where: {
    list: {
      project: {
        OR: [
          { userId: user.id },
          { members: { some: { id: user.id } } },
        ],
      },
    },
  },
  _count: { _all: true },
})
```

One round trip, payload measured in bytes instead of kilobytes, no
JS-side aggregation.

## 5. (Not applied yet) Rewrite `moveTask` reorder as a single SQL update

`moveTask` currently runs N `tx.task.update` calls per drag-drop. Even
inside a transaction these are sequential round trips. A single
parameterised `UPDATE tasks SET position = position ± 1 WHERE list_id =
$1 AND position BETWEEN $2 AND $3` is one round trip regardless of
list size. Worth doing after the steps above are verified.

---

## Expected impact

| Step | Latency saved (typical) |
|------|-------------------------|
| 1. Supavisor pooler             | 100–250ms |
| 2. Region co‑location           | 150–300ms (only if mismatched) |
| 3. `cache()` + dedupe upsert    | 30–80ms per action |
| 4. `groupBy` in stats           | 20–100ms on the stats route |

Steps 1 and 2 are the headline wins. Apply them first and re‑measure
before going further.
