# Migration Plan: Prototype to Production with Supabase & Prisma

## Objective
Transition the WindTodo application from a prototype (using `localStorage` and simulated auth) to a production-ready application using Supabase for Authentication and PostgreSQL, managed via the Prisma ORM and Next.js Server Actions.

## Key Files & Context
- `package.json`: Will be updated with new dependencies (`@supabase/ssr`, `@supabase/supabase-js`, `prisma`, `@prisma/client`).
- `prisma/schema.prisma`: New file to define the database schema (e.g., `Task`, `User` references).
- `src/app/login/page.tsx`: Will be updated to use Supabase Auth for real authentication.
- `src/middleware.ts`: New file to protect routes and refresh Supabase auth sessions.
- `src/app/actions/taskActions.ts`: New file for Server Actions (fetch, create, delete tasks) using Prisma.
- `src/components/TaskList.tsx`: Will be refactored to consume Server Actions instead of `localStorage`.

## Implementation Steps

### Phase 1: Environment & Setup
1. **Dependencies:** Install Prisma, Prisma Client, and Supabase SSR packages.
2. **Prisma Init:** Run `npx prisma init` to create the schema file.
3. **Supabase Config:** Create Supabase utility files (`src/utils/supabase/server.ts`, `client.ts`, `middleware.ts`) to handle authenticated sessions securely in App Router.

### Phase 2: Database Schema
1. **Define Models:** Update `schema.prisma` to include a `Task` model:
   ```prisma
   model Task {
     id        String   @id @default(uuid())
     title     String
     userId    String   // Foreign key to Supabase auth.users
     listId    String   // E.g., 'Your Tasks' or 'Active Projects'
     createdAt DateTime @default(now())
   }
   ```
2. **Migrate DB:** Run `npx prisma db push` to sync the schema to the Supabase Postgres instance.

### Phase 3: Authentication
1. **Login Page:** Update `src/app/login/page.tsx` to call a Server Action for signing in/signing up using `@supabase/ssr`.
2. **Middleware:** Add `src/middleware.ts` to redirect unauthenticated users from the dashboard (`/`) back to `/login`.

### Phase 4: Server Actions & Data Fetching
1. **Task Actions:** Create Server Actions in `src/app/actions/taskActions.ts`:
   - `getTasks(listId: string)`
   - `createTask(title: string, listId: string)`
   - `deleteTask(taskId: string)`
2. **Update Components:** Modify `TaskList.tsx` (and `app/(dashboard)/page.tsx`) to fetch initial data securely from the server and replace the `localStorage` logic with optimistic UI updates pointing to the new Server Actions.

## Verification & Testing
- Ensure the user cannot access the dashboard without logging in.
- Verify tasks are permanently stored in the Supabase PostgreSQL database.
- Confirm tasks are scoped to the currently logged-in user.
- Test that adding and removing tasks works seamlessly via Server Actions without requiring manual page reloads.