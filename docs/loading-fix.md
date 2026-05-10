1. Server-render initial data into SWR's fallbackData (biggest win — kills the loading skeleton entirely)

Right now the project board page is 'use client' and fetches getProjects, getBoardLists, then N getTasks calls
after the JS bundle hydrates. That's why you see skeletons. Instead, make the page a server component that
fetches the data in parallel, then passes it down as fallbackData:

// app/projects/[projectId]/page.tsx (server)
export default async function Page({ params }) {
const { projectId } = await params;
const [projects, lists] = await Promise.all([
getProjects(),
getBoardLists(projectId),
]);
const tasksByList = Object.fromEntries(
await Promise.all(
[...lists.map(l => l.id), `${projectId}_inbox`]
.map(async id => [id, await getTasks(id)])
)
);
return <ProjectBoard projectId={projectId} fallback={{ projects, lists, tasksByList }} />;
}

Then in the client component, wrap with <SWRConfig value={{ fallback: {...} }}>. Result: HTML arrives with
content already painted; no flash, no skeleton.

2. <Link prefetch> on project cards — Next prefetches by default, but for dynamic routes it only prefetches on
   hover. Force it: <Link href={...} prefetch={true}>. The dashboard's project tiles will warm up the route before
    the user clicks.

3. Cache auth.getUser() per request — every server action does its own supabase.auth.getUser() (a network
   round-trip to Supabase). On the project page that's 5–10 calls. Wrap in React's cache():

import { cache } from 'react';
const getUser = cache(async () => {
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
return user;
});

Within a single request all callers share one round-trip.

4. Use Supabase's pooler URL — if DATABASE_URL is the direct connection, switch to the pgbouncer pooler URL
   (port 6543, ?pgbouncer=true). Cold serverless requests get a connection ~10× faster.

5. Single Prisma client instance — your actions do new PrismaClient() at module top-level, which is fine on a
   long-lived server but creates connection storms on serverless. Use the standard singleton pattern
   (globalThis.prisma ??= new PrismaClient()).

6. Combine queries — getProjects + per-project counts in one findMany with \_count: { lists: true } saves a
   round-trip on the dashboard.

7. Partial Prerendering (Next 16 has it stable) — render the static shell (sidebar, layout chrome, project name
   from cache) instantly while DB queries stream in. Add experimental.ppr = true and <Suspense> boundaries around
   dynamic sections.
