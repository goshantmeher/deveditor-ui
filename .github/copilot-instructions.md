Purpose
Provide short, actionable guidance to AI coding agents so they become productive in this mono-repo quickly.

Big picture

- **Monorepo** driven by `pnpm` workspaces and `turbo` at the root. See [package.json](package.json#L1-L200).
- Major groups:
  - UI component library: [packages/ui](packages/ui) — built with `tsup`, tests with `vitest`.
  - Storybook demo: [apps/storybook](apps/storybook) — runs Storybook and imports `@deveditor/ui`.

Quick dev & CI commands (explicit examples)

- Install deps: `pnpm install` (root)
- Start Storybook locally: `pnpm --filter @deveditor/storybook dev` or from root `pnpm storybook` (runs `turbo` filter). See [apps/storybook/package.json](apps/storybook/package.json#L1-L50).
- Build UI package: `pnpm --filter @deveditor/ui run build` (uses `tsup`). See [packages/ui/package.json](packages/ui/package.json#L1-L120).
- Run UI tests: `pnpm --filter @deveditor/ui test` (runs `vitest`).
- Root-wide flows: `pnpm build`, `pnpm dev`, `pnpm test` run `turbo` pipelines defined in root [package.json](package.json#L1-L200).

Project-specific patterns & conventions

- The UI package is "headless-first" (un-opinionated markup + utilities). Components live under [packages/ui/src/components](packages/ui/src/components).
- CSS is exported from the package via `./styles.css` in `exports` and `sideEffects` is used for CSS files (see [packages/ui/package.json](packages/ui/package.json#L1-L200)).
- Class merging helper: `cn(...)` in [packages/ui/src/utils/cn.ts](packages/ui/src/utils/cn.ts#L1-L20) — use this to combine conditional Tailwind classes.
- Use `class-variance-authority` + `tailwind-merge` patterns when making variants; prefer composing with `cn` to maintain consistency.
- Package dependency references often use `workspace:*` — updates to package versions happen via changesets (root scripts: `changeset`, `changeset version`).

Build/test notes agents must respect

- `tsup` builds outputs into `dist/`; follow the `exports` map in [packages/ui/package.json](packages/ui/package.json#L1-L200) when adding public surface area.
- Keep CSS paths intact in `exports` when adding global styles.
- `vitest` config is used in packages; run package-level tests rather than trying to run arbitrary test commands at root when diagnosing UI failures.

Where to look for examples

- Button story: [apps/storybook/src/stories/Button.stories.tsx](apps/storybook/src/stories/Button.stories.tsx) and story MDX in [apps/storybook/src/stories/Button.mdx](apps/storybook/src/stories/Button.mdx).
- Component entry: [packages/ui/src/index.ts](packages/ui/src/index.ts)

When proposing code changes

- Keep changes localized to the package that owns the code (e.g., edit `packages/ui` for UI changes). Use `pnpm --filter <pkg> run <script>` to iterate quickly.
- Respect the `exports` contract: adding new public modules should be accompanied by `exports` updates in `packages/ui/package.json` and a `README.md` entry if it becomes part of the public API.
- Update types: run `pnpm --filter @deveditor/ui run typecheck` after public API changes.

Edge cases & gotchas

- Storybook uses Tailwind and PostCSS — visual regressions frequently come from Tailwind class changes, not JS. Verify with Storybook before opening PRs.
- Tests run in JSDOM via `vitest`; DOM assumptions may differ from Playwright/real browser.

If uncertain, quick checks

- Run the package's Storybook (`pnpm --filter @deveditor/storybook dev`) to validate visual/usage surfaces.
- Build the package (`pnpm --filter @deveditor/ui run build`) to be sure exports and types emit correctly.

Feedback
If any of the above is unclear or you want a deeper walkthrough (CI, release, or changeset workflows), tell me what to expand.
