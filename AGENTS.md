# AI Agent Instructions for House Paint

This repository is a frontend-only React + TypeScript + Vite application.

## Key facts

- Frontend app built with Vite, React 19, TypeScript 5.9, Tailwind CSS, and React Router DOM.
- No backend code in this workspace.
- The app uses a client-side router with `BrowserRouter basename="/house-paint/"` in `src/App.tsx`.
- Global cart state is implemented in `src/context/CartContext.tsx`.
- Pages live in `src/pages`, reusable UI components in `src/components`, and styles in `src/styles`.
- API helpers are under `src/api`; currently only `authApi.ts` is present.

## Useful commands

- `npm run dev` — start local development server
- `npm run build` — build for production (`tsc -b && vite build`)
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint across the project
- `npm run deploy` — deploy `dist` to GitHub Pages via `gh-pages`

## Guidance for code changes

- Preserve existing file organization and naming conventions.
- Keep TypeScript strictness and React functional component style.
- Use existing Tailwind + CSS patterns rather than adding unrelated styling systems.
- Do not assume test support is present; there are no test files or test scripts in this repo.
- Avoid changing router basename unless the user explicitly asks for a deployment or path update.

## Important files

- `src/main.tsx` — React entrypoint
- `src/App.tsx` — route configuration and layout wrapper
- `src/components/Layout.tsx` — shared page layout
- `src/context/CartContext.tsx` — cart state provider
- `src/index.css` and `src/styles/theme.css` — global styling
- `package.json` — project scripts and dependency versions
- `tailwind.config.js` — Tailwind CSS setup
- `vite.config.ts` — Vite configuration

## When in doubt

- Follow the existing React + TypeScript patterns used in the repo.
- Keep changes minimal for UI updates and avoid adding new architecture unless requested.
- For deployment or hosting questions, the repo is configured for GitHub Pages under `homepage`.
