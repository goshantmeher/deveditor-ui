# DevEditor UI — Core UI Package Roadmap

> **Repository:** `goshantmeher/deveditor-ui`
> **Goal:** Extract, standardize, and publish a shared UI component library used by `deveditor.io` (and future apps like the local store app) — with world-class CI/CD, testing, and documentation.

---

## 🏗️ Phase 1: The "Engine Room" Setup

> **Goal:** Create the public repo and the automated publishing pipeline.

- [x] **Task 1.1** — Initialize the repo structure
  - Set up `package.json` with proper metadata (name, description, keywords, license, repository)
  - Configure TypeScript (`tsconfig.json`) with strict settings
  - Add `.editorconfig`, `.prettierrc`, `.eslintrc` for code quality

- [x] **Task 1.2** — Set up `tsup` for TypeScript bundling
  - Configure dual output: **ESM** and **CJS**
  - Generate `.d.ts` declaration files
  - Tree-shakeable exports via `package.json` `exports` field

- [x] **Task 1.3** — Configure Changesets for versioning
  - Install `@changesets/cli`
  - Set up `.changeset/config.json`
  - Define changelog generation format

- [x] **Task 1.4** — Write `.github/workflows/ci.yml`
  - [x] Linting (`eslint`) & type checking (`tsc --noEmit`)
  - [x] Build verification (`tsup` completes without errors)
  - [x] Auto-publish to NPM on push to `master` (using Changesets action)
  - [x] Cache `node_modules` for faster CI runs

- [x] **Task 1.5** — Set up Storybook + GitHub Pages deployment
  - Install Storybook with React + Vite builder
  - Write a GitHub Actions workflow to deploy Storybook to GitHub Pages
  - Add a "Live Docs" badge to README linking to the Storybook site

---

## 🎨 Phase 2: The "Shadcn Wrapper" Architecture

> **Goal:** Define how components are exported so app code never has to change again when internals evolve.

- [ ] **Task 2.1** — Install base dependencies
  - `tailwindcss`, `tailwind-merge`, `clsx`
  - `lucide-react` (icons)
  - `@radix-ui/*` primitives (as needed per component)

- [ ] **Task 2.2** — Create `src/utils/cn.ts`
  - Standard Shadcn `cn()` utility (`clsx` + `tailwind-merge`)
  - Export from package root barrel

- [ ] **Task 2.3** — Implement the **Wrapper Pattern** (first component: `Button`)
  - Wrap the Shadcn logic internally
  - Export a **stable, documented API** that we fully control
  - Include variant support (`default`, `destructive`, `outline`, `ghost`, `link`, etc.)
  - Write Storybook stories for every variant

- [ ] **Task 2.4** — Create the Tailwind Plugin / Preset
  - Export a Tailwind preset (`tailwind.config` / plugin) from the package
  - Apps `require()` or `import` the preset to stay in sync with the design tokens
  - Include CSS variables for theming (colors, spacing, radii, fonts)

---

## 🧪 Phase 3: The "Bulletproof" Testing Suite

> **Goal:** Leverage free GitHub Actions CI to ensure 0% regression.

- [ ] **Task 3.1** — Set up **Vitest** for unit testing
  - Install `vitest`, `@testing-library/react`, `jsdom`
  - Write unit tests for component logic (props, variants, events)
  - Add coverage reporting (`vitest --coverage`)

- [ ] **Task 3.2** — Set up **Playwright** for visual regression testing
  - Install `@playwright/test`
  - Capture screenshots of components rendered in Storybook
  - Store baseline snapshots in the repo

- [ ] **Task 3.3** — Integrate tests into CI pipeline
  - Block merges if any Playwright visual test fails
  - Block merges if unit test coverage drops below threshold
  - Add status badges to README

- [ ] **Task 3.4** — Add **Accessibility (A11y)** testing
  - Install `axe-core` / `@axe-core/playwright`
  - Run A11y audits on every component story
  - Fail CI on critical A11y violations

---

## 🚀 Phase 4: The "Great Migration" (Incremental)

> **Goal:** Move the 60+ components from `deveditor.io` to the new package without breaking anything.

### Batch 1 — Basics (target: `v1.0.0`)

- [ ] **Task 4.1** — Migrate foundational components:
  - `Button`, `Input`, `Card`, `Badge`
  - Publish `v1.0.0` to NPM

### Batch 1 Integration

- [ ] **Task 4.2** — Install `@goshantmeher/deveditor-ui` in `deveditor.io`
  - Write a Codemod / regex script to update imports for the 4 migrated components
  - Verify all 60 tools still render correctly

### Batch 2 — Complex Components

- [ ] **Task 4.3** — Migrate:
  - `Dialog` / `Modal`, `Tabs`, `Select`, `Dropdown Menu`
  - Update `deveditor.io` imports
  - Publish next minor version

### Batch 3 — Layout & Advanced

- [ ] **Task 4.4** — Migrate:
  - High-level layout components (e.g., `ToolLayout`, `SEOContent`)
  - Complex tool-specific wrappers (e.g., code editors, preview panels)
  - Publish next minor version

### Final Audit

- [ ] **Task 4.5** — Remove the `components/ui` folder from `deveditor.io`
  - Confirm **zero** local UI component references remain
  - Run full E2E validation on `deveditor.io`

---

## 💼 Phase 5: The "Expert Exposure" Polish

> **Goal:** Make the repo a recruiter magnet and showcase engineering excellence.

- [ ] **Task 5.1** — Write a **Pro-Level** `README.md`
  - Architecture diagram (Mermaid or image)
  - "Why a wrapper pattern?" rationale
  - "Why these specific tests?" justification
  - Quick-start guide for consumers
  - Contributing guide

- [ ] **Task 5.2** — Add a **Sponsorship** button
  - Mirror the sponsorship setup from `deveditor.io`
  - Add `FUNDING.yml` to `.github/`

- [ ] **Task 5.3** — Create a **Component Gallery** on Storybook
  - Showcase every component with interactive controls
  - Add "Copy Import" snippets for each component
  - Include dark/light mode previews

- [ ] **Task 5.4** — **"Build in Public"** announcement
  - Draft a LinkedIn post showcasing the CI/CD pipeline
  - Highlight test coverage, automated publishing, and design system
  - Link to the live Storybook and the NPM package

---

## 📌 Notes & Decisions

| Decision                     | Rationale                                                                  |
| ---------------------------- | -------------------------------------------------------------------------- |
| **tsup** over Rollup/Webpack | Fastest DX, zero-config for most cases, built-in DTS generation            |
| **Changesets** over manual   | Automated semver, changelogs, and NPM publishing in CI                     |
| **Wrapper pattern**          | Decouples internal Shadcn/Radix implementation from consumer API           |
| **Tailwind Preset export**   | Single source of truth for design tokens across all apps                   |
| **Incremental migration**    | Zero-downtime migration; each batch is independently deployable & testable |

---

> **Created:** 2026-03-12
> **Status:** Phase 1 — Not Started
