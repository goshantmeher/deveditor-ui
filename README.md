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

| Document | Description |
| --- | --- |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Complete design system & component development rules |
| [TODO.md](./TODO.md) | Phase-wise development roadmap |

---

## 🤝 Contributing

This project is not yet accepting external contributions. Once we reach a stable v1.0, contribution guidelines will be published.

---

## 📄 License

[MIT](./LICENSE) © Goshant Meher
