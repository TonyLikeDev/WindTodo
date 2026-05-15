import { PrismaClient } from '@prisma/client'

// Supavisor transaction-mode pooling (port 6543) does not support prepared
// statements. Without `pgbouncer=true`, Prisma issues them anyway and the
// pooler returns 42P05 ("prepared statement \"s1\" already exists") as soon as
// a backend connection is reused. Patch the URL at client construction so a
// misconfigured deployment env var can't reintroduce the bug.
function normalizePoolerUrl(raw: string | undefined): string | undefined {
  if (!raw) return raw
  try {
    const url = new URL(raw)
    if (url.port !== '6543') return raw
    if (!url.searchParams.has('pgbouncer')) url.searchParams.set('pgbouncer', 'true')
    if (!url.searchParams.has('connection_limit')) url.searchParams.set('connection_limit', '1')
    return url.toString()
  } catch {
    return raw
  }
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: normalizePoolerUrl(process.env.DATABASE_URL),
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
