# Next.js Migration Plan: WindTodo

This document outlines the strategy for migrating the static HTML/Tailwind prototypes of WindTodo into a fully functional, component-driven React application using Next.js.

## Phase 1: Project Initialization & Setup
1. **Scaffold the Next.js App:**
   - Initialize the project using `npx create-next-app@latest .`
   - **Configuration:** Use TypeScript, Tailwind CSS, App Router (`app` directory), and ESLint.
2. **Global Styles & Configurations:**
   - Migrate custom CSS (SVG background patterns, custom scrollbars, and base `.glass` classes) from the HTML `<style>` tags into `app/globals.css`.
   - Ensure `tailwind.config.ts` aligns with the required utility classes, though the current monochrome design relies primarily on native Tailwind utilities.

## Phase 2: Component Extraction (Atomic Design)
Break down the monolithic HTML pages into modular, reusable React components stored in a `components/` directory.

*   **Layout Components:**
    *   `Sidebar.tsx`: The left-hand navigation menu.
    *   `TopBar.tsx`: The top header featuring search and user profile details.
    *   `GlassCard.tsx`: A reusable wrapper component to enforce consistent glassmorphism styling across widg￼ets.
*   **Feature Components:**
    *   `PieChart.tsx`: The inline SVG task distribution chart.
    *   `ActivityGraph.tsx`: The weekly productivity bar chart.
    *   `TaskList.tsx`: A dynamic, reusable list component capable of handling varying datasets (e.g., "Daily Tasks", "Active Projects").

## Phase 3: Page Routing (App Router)
Map the UI using Next.js's file-system based routing:

*   `app/login/page.tsx`: The authentication interface, ported from `login.html`. Replace standard `<a>` tags for navigation with Next.js's `<Link>` or `useRouter` for programmatic routing post-login.
*   `app/layout.tsx`: The root layout.
*   `app/(dashboard)/layout.tsx`: A specific layout for the dashboard environment that includes the `Sidebar` and `TopBar`, ensuring they persist across dashboard-related routes.
*   `app/(dashboard)/page.tsx`: The main dashboard content area, ported from `index.html` and constructed by composing the extracted React components.

## Phase 4: State Management & Interactivity
Replace vanilla JavaScript DOM manipulation with React state patterns (`useState` / `useReducer`):

1. **Dynamic Lists (`TaskList.tsx`):**
   - Manage list items using local state (e.g., `const [tasks, setTasks] = useState([...])`).
   - Implement `handleAddTask` and `handleRemoveTask` functions to update state immutably, ensuring React efficiently re-renders the UI.
2. **Form Handling:**
   - Convert the login form to utilize React controlled components, managing input values in state, or integrate a library like `react-hook-form` for robust validation.
3. **Global State Strategy:**
   - As features expand, implement a global state solution (e.g., React Context or Zustand) to share data (like user profiles or task counts) seamlessly between the TopBar and Dashboard widgets.

## Phase 5: Future-Proofing (Backend Integration)
Steps to transition from a UI prototype to a production-ready application:

*   **Authentication:** Integrate a provider like NextAuth.js, Supabase, or Firebase to implement secure, real-world user authentication.
*   **Database & Persistence:** Connect the React components to a backend database (e.g., PostgreSQL via Prisma, or MongoDB). Utilize Next.js Server Components and Server Actions to fetch, create, and mutate task data, replacing volatile local state with persistent storage.