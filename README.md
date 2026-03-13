# @deveditor/ui

> 🚧 **This project is currently under active development and is not yet ready for production use.**

A meticulously crafted, headless-first UI component library built to power [deveditor.io](https://deveditor.io) — designed for long-term maintainability, full customizability, and architectural freedom.

---

## ⚠️ Status: Work in Progress

This library is in its early stages. We are actively building the foundation:

- **Phase 1** — Repo setup, bundling (tsup), CI/CD pipeline, Storybook
- **Phase 2** — Component architecture (Shadcn wrapper pattern)
- **Phase 3** — Testing suite (Vitest, Playwright, axe-core)
- **Phase 4** — Component migration from deveditor.io
- **Phase 5** — Documentation & polish

> ⏳ **ETA for first stable release:** Coming soon.
> Check the [TODO.md](./TODO.md) for the detailed roadmap.

---

## 🏗️ What This Will Be

A **framework-agnostic** React component library featuring:

- 🎨 **Fully Customizable** — 7-layer customization (CSS vars → className → classNames → data attrs → slots → asChild → unstyled mode)
- ♿ **WCAG 2.1 AA Accessible** — Keyboard navigation, screen reader support, focus management
- 🌍 **i18n Ready** — Zero hardcoded strings, locale-aware formatting, RTL support
- 🖥️ **SSR Compatible** — Works with Next.js App Router, TanStack Start, Remix, or plain React
- 🧪 **Enterprise-Grade Testing** — Vitest + Playwright + axe-core on every PR
- 📦 **Tree-Shakeable** — ESM + CJS dual output, < 5KB per component
- 🎯 **Stable API** — Wrapper pattern ensures internal changes never break consumer code

---

## 📚 Documentation

| Document                               | Description                                          |
| -------------------------------------- | ---------------------------------------------------- |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Complete design system & component development rules |
| [TODO.md](./TODO.md)                   | Phase-wise development roadmap                       |

[![Live Docs](https://img.shields.io/badge/Storybook-Live%20Docs-ff4785?logo=storybook)](https://goshantmeher.github.io/deveditor-ui/)

---

## 🌿 Branch model

- **`dev`** — Integration. All contribution PRs target **`dev`**. CI runs lint, typecheck, build, test and enforces changesets on PRs to `dev`.
- **`master`** — Production (single source of truth). Version & publish and GitHub Pages deploy run on push to `master`. The only PR into `master` is **dev → master**, opened by a maintainer when ready to release.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the step-by-step workflow.

---

## 📦 Releasing (npm)

Releases are driven by [Changesets](https://github.com/changesets/changesets). **Flow:**

1. Work lands on **`dev`** via PRs (each PR that changes `packages/` must include a changeset — see CONTRIBUTING).
2. Push to `dev` triggers the **version PR** (changeset-release/dev → dev); merge it to bump versions on `dev`.
3. When ready to release, a maintainer opens a PR **dev → master** and merges. CI on push to `master` runs **publish** and packages are published to npm.

See [.changeset/README.md](./.changeset/README.md) for changeset details.

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the branch workflow, how to open PRs to `dev`, and when to add a changeset.

---

## 📄 License

[MIT](./LICENSE) © Goshant Meher
