# DevEditor UI — Design System

> Enterprise-grade design system for the `@deveditor/ui` component library.
> All contributors **must** read this document before writing or reviewing any component code.
> Updated: March 2026

---

## Table of Contents

1. [Tech Stack & Architecture](#-tech-stack--architecture)
2. [Monorepo Structure](#-monorepo-structure)
3. [Design Tokens](#-design-tokens)
4. [Component Anatomy](#-component-anatomy)
5. [Component Development Rules](#-component-development-rules)
6. [API Design Contract](#-api-design-contract)
7. [Type Safety Requirements](#-type-safety-requirements)
8. [Customization Architecture](#-customization-architecture)
9. [Styling Rules](#-styling-rules)
10. [Accessibility Standards](#-accessibility-standards)
11. [Testing Requirements](#-testing-requirements)
12. [Storybook Standards](#-storybook-standards)
13. [Internationalization (i18n)](#-internationalization-i18n)
14. [SSR & Next.js Compatibility](#-ssr--nextjs-compatibility)
15. [Performance Budget](#-performance-budget)
16. [Documentation Requirements](#-documentation-requirements)
17. [Git & Versioning Protocol](#-git--versioning-protocol)
18. [Checklist: Before You Merge](#-checklist-before-you-merge)

---

## 🧰 Tech Stack & Architecture

| Layer              | Technology                      | Purpose                                   |
| ------------------ | ------------------------------- | ----------------------------------------- |
| **Build System**   | Vite                            | Dev server, HMR, optimized builds         |
| **Bundler**        | tsup                            | Library bundling (ESM + CJS + DTS)        |
| **Framework**      | React 18+                       | Component framework                       |
| **Language**       | TypeScript (strict mode)        | Type safety across all packages           |
| **Styling**        | Tailwind CSS v4 + CSS Variables | Utility-first styling with design tokens  |
| **Primitives**     | Radix UI                        | Headless, accessible component primitives |
| **Component Base** | shadcn/ui                       | Styled Radix wrappers (internal only)     |
| **Icons**          | Lucide React                    | Consistent, tree-shakeable icon library   |
| **Monorepo**       | pnpm workspaces + Turborepo     | Package management and task orchestration |
| **Docs**           | Storybook 10                    | Interactive component documentation       |
| **Unit Tests**     | Vitest + React Testing Library  | Component logic & integration tests       |
| **Visual Tests**   | Playwright                      | Screenshot regression & E2E testing       |
| **A11y Tests**     | axe-core + Playwright           | Automated accessibility auditing          |
| **CI/CD**          | GitHub Actions                  | Lint, test, build, publish pipeline       |
| **Versioning**     | Changesets                      | Automated semver, changelogs, NPM publish |

### Architecture Principle: The Wrapper Pattern

Every component in this library **wraps** the underlying shadcn/Radix implementation behind a **stable, public API** that we fully own and control.

```
Consumer App
    ↓ imports
@deveditor/ui (stable public API)
    ↓ wraps internally
shadcn/ui + Radix UI primitives
    ↓ renders
Accessible HTML + Tailwind styles
```

**Why?** If shadcn or Radix changes their API, we absorb the breaking change internally. Consumer apps **never** need to update their code.

---

## 📂 Monorepo Structure

```
deveditor-ui/
├── .changeset/              # Changeset config & pending changesets
├── .github/
│   └── workflows/
│       ├── ci.yml           # Lint, type-check, test, build
│       └── publish.yml      # NPM publish via Changesets
├── packages/
│   ├── ui/                  # 📦 @deveditor/ui — the core component library
│   │   ├── src/
│   │   │   ├── components/  # All components (one folder each)
│   │   │   ├── hooks/       # Shared React hooks
│   │   │   ├── utils/       # Utility functions (cn, etc.)
│   │   │   ├── tokens/      # Design token definitions
│   │   │   └── index.ts     # Barrel export (public API surface)
│   │   ├── tsup.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── tailwind-config/     # 📦 @deveditor/tailwind-config — shared preset
│       ├── src/
│       │   ├── preset.ts    # Tailwind preset (colors, fonts, radii, etc.)
│       │   └── plugin.ts    # Optional Tailwind plugin for custom utilities
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   └── storybook/           # 📖 Storybook documentation app
│       ├── .storybook/
│       │   ├── main.ts
│       │   └── preview.ts
│       └── package.json
│
├── turbo.json               # Turborepo pipeline config
├── pnpm-workspace.yaml      # pnpm workspace definition
├── package.json             # Root — scripts, devDependencies
├── tsconfig.base.json       # Shared TS config
├── DESIGN_SYSTEM.md         # ← You are here
├── TODO.md
├── README.md
└── LICENSE
```

### Key Packages

| Package                      | Scope                      | Description                                |
| ---------------------------- | -------------------------- | ------------------------------------------ |
| `@deveditor/ui`              | `packages/ui`              | All React components, hooks, and utilities |
| `@deveditor/tailwind-config` | `packages/tailwind-config` | Shared Tailwind preset and plugin          |

---

## 🎨 Design Tokens

All visual decisions are encoded as **design tokens** — never use raw values in components.

### Color System (OKLCH + CSS Variables)

We use the **OKLCH** color space for perceptually uniform colors across light and dark modes. All colors are defined as CSS custom properties and toggled via a `.dark` class on the root element.

#### Semantic Tokens

| Token                  | Usage                                             |
| ---------------------- | ------------------------------------------------- |
| `--background`         | Page / app background                             |
| `--foreground`         | Primary text color                                |
| `--card`               | Elevated surface backgrounds (cards, modals)      |
| `--card-foreground`    | Text on card surfaces                             |
| `--popover`            | Popover / dropdown backgrounds                    |
| `--popover-foreground` | Text in popovers                                  |
| `--muted`              | Subtle backgrounds (empty states, disabled areas) |
| `--muted-foreground`   | Secondary text, placeholders, hints               |
| `--border`             | Dividers, card edges. Use `border-border/50` soft |
| `--input`              | Input field borders                               |
| `--ring`               | Focus ring color                                  |
| `--accent`             | Interactive hover backgrounds                     |
| `--accent-foreground`  | Text on accent backgrounds                        |
| `--destructive`        | Destructive actions, errors                       |

#### Brand Tokens

| Token                | Value (OKLCH)                         | Usage                         |
| -------------------- | ------------------------------------- | ----------------------------- |
| `--brand`            | `oklch(0.585 0.233 277.117)` (Indigo) | Primary accent, CTAs          |
| `--brand-foreground` | `white`                               | Text on brand surfaces        |
| `--success`          | Emerald                               | Positive states, confirmation |
| `--warning`          | Amber                                 | Caution, attention needed     |
| `--info`             | Sky blue                              | Informational, tips           |
| `--destructive`      | Rose                                  | Error, danger, delete         |

#### Accent Palette (Tailwind Classes)

| Color   | Class Base    | Usage                               |
| ------- | ------------- | ----------------------------------- |
| Indigo  | `indigo-500`  | Primary actions, branding, CTAs     |
| Emerald | `emerald-500` | Success, privacy, positive states   |
| Amber   | `amber-500`   | Warnings, speed indicators          |
| Rose    | `rose-500`    | Errors, destructive actions         |
| Violet  | `violet-500`  | AI features, special/premium states |
| Sky     | `sky-500`     | Informational, technical details    |

### Typography

| Token         | Font Family | Usage                              |
| ------------- | ----------- | ---------------------------------- |
| `--font-sans` | Quicksand   | All body text, headings, UI labels |
| `--font-mono` | Geist Mono  | Code, hex values, data output      |

#### Scale

| Name    | Size        | Usage                          |
| ------- | ----------- | ------------------------------ |
| `tiny`  | `0.625rem`  | Compact UI labels inside tools |
| `label` | `0.6875rem` | Form labels, secondary info    |
| `sm`    | `0.875rem`  | Body small, card descriptions  |
| `base`  | `1rem`      | Default body text              |
| `lg`    | `1.125rem`  | Emphasized body, descriptions  |
| `xl`    | `1.25rem`   | Card titles, section subheads  |
| `2xl`   | `1.5rem`    | Section headings               |
| `3xl`   | `1.875rem`  | Page section titles            |
| `4xl+`  | `2.25rem+`  | Hero headings                  |

### Spacing & Radii

| Token         | Value     | Usage                    |
| ------------- | --------- | ------------------------ |
| `--radius`    | `0.75rem` | Default border radius    |
| `--radius-sm` | `0.5rem`  | Buttons, inputs          |
| `--radius-lg` | `1rem`    | Cards, modals            |
| `--radius-xl` | `1.5rem`  | Feature cards, hero CTAs |

### Shadows

| Name          | Usage                                  |
| ------------- | -------------------------------------- |
| `shadow-sm`   | Subtle elevation (inputs, small cards) |
| `shadow-md`   | Standard cards, dropdowns              |
| `shadow-lg`   | Modals, popovers, floating elements    |
| `shadow-glow` | Brand-colored glow effect on CTAs      |

---

## 🧬 Component Anatomy

Every component follows this exact folder structure:

```
packages/ui/src/components/button/
├── Button.tsx              # Component implementation
├── Button.types.ts         # TypeScript interfaces & types
├── Button.stories.tsx      # Storybook stories
├── Button.test.tsx         # Vitest unit tests
├── Button.spec.ts          # Playwright visual/E2E tests (optional)
└── index.ts                # Re-exports for barrel
```

### File Responsibilities

| File                      | Contents                                                   |
| ------------------------- | ---------------------------------------------------------- |
| `[Component].tsx`         | React component with `forwardRef`, display name, JSDoc, inline comments for non-obvious logic |
| `[Component].types.ts`    | Props interface extending HTML/Radix types, variant types  |
| `[Component].stories.tsx` | All visual states, variants, edge cases as stories         |
| `[Component].test.tsx`    | Unit tests: rendering, props, events, a11y assertions      |
| `[Component].spec.ts`     | Playwright: visual regression screenshots, interaction E2E |
| `index.ts`                | Named re-exports: `export { Button } from './Button'`      |

---

## 📏 Component Development Rules

> These are **non-negotiable**. Every component **must** satisfy all of the following.

### Rule 1: Use `forwardRef` — Always

Every component must use `React.forwardRef` to allow parent components to access the underlying DOM node.

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  }
);
Button.displayName = 'Button';
```

### Rule 2: Set `displayName` — Always

Every component must have an explicit `displayName` for DevTools debugging and Storybook.

### Rule 3: Spread Remaining Props — Always

All components must spread `...props` onto the root element so consumers can pass native HTML attributes (`id`, `data-*`, `aria-*`, `style`, etc.).

### Rule 4: Accept `className` — Always

Every component must accept a `className` prop and merge it using the `cn()` utility, allowing consumers to extend styles without overriding.

### Rule 5: Use `cva` for Variants — Always

Use `class-variance-authority` (cva) for defining component variants. This ensures type-safe, composable variant APIs.

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Rule 6: No Hardcoded Colors or Spacing

- ❌ `bg-[#1a1a2e]`, `text-[#e94560]`, `p-[13px]`
- ✅ `bg-background`, `text-destructive`, `p-3`

All values must come from design tokens or Tailwind's default scale.

### Rule 7: Dark Mode Support — Mandatory

Every component must look correct in both light and dark modes. Use semantic tokens (`bg-background`, `text-foreground`, `border-border`) that automatically adapt.

- Never use `dark:` prefix for semantic tokens — they auto-switch.
- Use `dark:` only for decorative or brand-specific overrides.

### Rule 8: No Internal State for Controlled Components

Components that accept a `value` prop must be **fully controlled** by default. Provide an **uncontrolled** variant only when explicitly needed (with `defaultValue`).

### Rule 9: Compound Components for Complex UI

For components with multiple related parts (e.g., `Tabs`, `Dialog`, `Select`), use the **compound component pattern**:

```tsx
<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close>Cancel</Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

### Rule 10: Zero Runtime CSS-in-JS

We do **not** use runtime CSS-in-JS (styled-components, Emotion, etc.). All styling is done via:

- Tailwind CSS utility classes
- CSS custom properties (design tokens)
- `cn()` utility for conditional class merging

---

## 📜 API Design Contract

> The public API of every component is a contract with consumers. Breaking changes require a major version bump.

### Naming Conventions

| Type             | Convention               | Example                      |
| ---------------- | ------------------------ | ---------------------------- |
| Components       | PascalCase               | `Button`, `DialogContent`    |
| Props interfaces | `[Component]Props`       | `ButtonProps`, `DialogProps` |
| Variant types    | `[Component]Variant`     | `ButtonVariant`              |
| Event handlers   | `on[Action]`             | `onClick`, `onValueChange`   |
| Boolean props    | `is[State]` or adjective | `isDisabled`, `loading`      |
| Render props     | `render[Element]`        | `renderIcon`, `renderBadge`  |

### Props Design Principles

1. **Prefer composition over configuration** — Use children/slots, not 50 config props.
2. **Use discriminated unions** for mutually exclusive states.
3. **Default to the most common use case** — Don't force consumers to pass obvious defaults.
4. **Never expose internal implementation details** (Radix primitives, internal class names).
5. **Export variant helpers** — Export the cva variants so consumers can reuse them.

### Exports Checklist

Every component **must** export from its `index.ts`:

```tsx
export { Button } from './Button'; // The component
export type { ButtonProps } from './Button.types'; // The props type
export { buttonVariants } from './Button'; // The variant helper (if cva used)
```

---

## 🔒 Type Safety Requirements

> **We require fully type-safe code.** All packages use TypeScript in strict mode. No escape hatches without justification.

### Compiler & Config

- **Strict mode** is enabled in `tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- **Type-check in CI:** `tsc --noEmit` must pass in every package. No committing with type errors.

### Banned in Component & Library Code

| Practice | Rule | Prefer instead |
| -------- | ---- | ----------------- |
| **`any`** | Not allowed. | Proper types, or `unknown` with type guards / narrowing. |
| **`@ts-ignore`** | Not allowed. | Fix the types, or use `@ts-expect-error` with a one-line comment (see below). |
| **Unsafe `as Type`** | Avoid. | Narrow with type guards, or use type-safe patterns (e.g. discriminated unions). If assertion is unavoidable, add a one-line comment. |
| **Implicit `any`** | Not allowed. | Enabled by `strict`; add explicit types for parameters and return values. |

### When `@ts-expect-error` Is Allowed

Use only when the type system cannot express the case (e.g. known upstream typings bug or untyped third-party API). Every use **must** have an immediate comment:

```ts
// @ts-expect-error — Radix typings don't yet expose this prop (issue #123)
<SomePrimitive internalProp={value} />
```

Prefer fixing types or contributing a fix upstream. Remove `@ts-expect-error` as soon as the underlying issue is resolved.

### Typing Conventions

- **Props:** Define in `[Component].types.ts`. Extend the correct HTML or Radix type (e.g. `ComponentPropsWithoutRef<'button'>`). Use **discriminated unions** for mutually exclusive state (e.g. `loading` vs `disabled`).
- **Refs:** Use `React.forwardRef<HTMLButtonElement, ButtonProps>()` (or the correct element type). Export the props type so consumers get correct ref types.
- **Event handlers:** Type as `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`, etc. Do not use untyped `(e) => ...` for DOM events.
- **Children / slots:** Use `React.ReactNode` for flexible content; use explicit types for render props (e.g. `(props: { value: string }) => React.ReactNode`).
- **Unknown data:** Prefer `unknown` and narrow (e.g. `if (typeof x === 'string')`) instead of `any`.

### Enforcement

- **CI:** `pnpm run typecheck` (and lint with `@typescript-eslint` rules) must pass before merge.
- **Checklist:** The "TypeScript strict" item in the PR checklist covers: no `any`, no `@ts-ignore`, types in `.types.ts`, and use of `@ts-expect-error` only with a comment when unavoidable.

---

## 🔧 Customization Architecture

> **Design Philosophy:** Every component must be fully customizable **without forking**.
> Consumers should be able to retheme, restyle, restructure, or even strip all styles — using progressive layers of control.

Our customization model follows **7 progressive layers**, from simplest to most advanced:

```
Layer 1: CSS Variables        → Change colors, radii, fonts globally
Layer 2: className prop       → Override/extend root element styles
Layer 3: classNames prop      → Target individual sub-elements
Layer 4: Data attributes      → Style states via pure CSS selectors
Layer 5: Slots / Render props → Replace internal UI sections
Layer 6: asChild pattern      → Replace the root element entirely
Layer 7: Unstyled mode        → Strip all visual styles, keep logic + a11y
```

---

### Layer 1: CSS Variable Theming

Consumers override our design tokens in their own CSS to retheme **everything** at once.

```css
/* consumer's globals.css */
:root {
  --background: oklch(0.98 0.01 240); /* Custom light bg */
  --foreground: oklch(0.15 0.02 240); /* Custom text */
  --brand: oklch(0.65 0.28 150); /* Green instead of indigo */
  --brand-foreground: white;
  --radius: 1rem; /* Rounder corners */
}

.dark {
  --background: oklch(0.12 0.02 240);
  --foreground: oklch(0.92 0.01 240);
}
```

**Rule for contributors:** Every visual value in a component must reference a CSS variable or Tailwind token — **never** a raw color, radius, or shadow value. This is what makes Layer 1 work.

---

### Layer 2: `className` Prop (Root Override)

Every component accepts a `className` prop that merges with base styles using `cn()` (tailwind-merge). The consumer's classes **always win** in conflicts.

```tsx
// Consumer usage — adds a custom shadow + overrides padding
<Button className="shadow-xl px-12">Big Action</Button>
```

**Rule for contributors:** The `className` prop must always be the **last argument** in the `cn()` call so it takes merge priority:

```tsx
// ✅ Correct — consumer className wins
cn(buttonVariants({ variant, size }), className);

// ❌ Wrong — base styles will override consumer
cn(className, buttonVariants({ variant, size }));
```

---

### Layer 3: `classNames` Prop (Sub-Element Targeting)

For compound/complex components, expose a **`classNames`** prop (object) that lets consumers target individual internal elements.

```tsx
// Component definition (contributor)
interface DialogProps {
  /** Override classes for individual sub-elements */
  classNames?: {
    overlay?: string;
    content?: string;
    header?: string;
    footer?: string;
    title?: string;
    description?: string;
    close?: string;
  };
}

// Internal usage
<div className={cn("fixed inset-0 bg-black/50", classNames?.overlay)} />
<div className={cn("bg-card rounded-lg p-6", classNames?.content)}>
  <h2 className={cn("text-lg font-bold", classNames?.title)}>{title}</h2>
</div>
```

```tsx
// Consumer usage — custom styling of internal parts
<Dialog
  classNames={{
    overlay: 'bg-blue-900/30 backdrop-blur-sm',
    content: 'max-w-2xl rounded-3xl',
    title: 'text-2xl font-black',
  }}
>
  {/* ... */}
</Dialog>
```

**Rule for contributors:** Every compound component with ≥2 styled internal elements **must** expose a `classNames` prop. Document every available key in JSDoc.

---

### Layer 4: Data Attributes for CSS Hooks

All stateful components must render **`data-*` attributes** reflecting their current state. This lets consumers style states with pure CSS — no JS needed.

```tsx
// Component implementation (contributor)
<button
  data-variant={variant}
  data-size={size}
  data-state={isOpen ? 'open' : 'closed'}
  data-disabled={disabled || undefined}
  data-loading={loading || undefined}
  className={cn(buttonVariants({ variant, size }), className)}
  {...props}
/>
```

```css
/* Consumer CSS — complete restyling via data attributes */
[data-variant='destructive'] {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  box-shadow: 0 4px 20px rgba(238, 90, 36, 0.3);
}

[data-state='open'] {
  transform: scale(1.02);
}

[data-disabled] {
  opacity: 0.4;
  pointer-events: none;
}
```

**Required data attributes by component type:**

| Component Type | Required Data Attributes                         |
| -------------- | ------------------------------------------------ |
| All components | `data-variant`, `data-size` (if applicable)      |
| Toggleable     | `data-state="open"` / `data-state="closed"`      |
| Selectable     | `data-state="active"` / `data-state="inactive"`  |
| Disablable     | `data-disabled` (present/absent, not true/false) |
| Loadable       | `data-loading` (present/absent)                  |
| Form elements  | `data-invalid` when validation fails             |

---

### Layer 5: Slots & Render Props

For maximum composition flexibility, complex components expose **slots** — named areas where consumers can inject custom content or replace default rendering.

```tsx
// Component definition (contributor)
interface CardProps {
  /** Replace the default header rendering */
  renderHeader?: (props: { title: string; description?: string }) => React.ReactNode;
  /** Custom content in the trailing area */
  slotAction?: React.ReactNode;
  /** Custom icon slot */
  slotIcon?: React.ReactNode;
}

// Internal implementation
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ renderHeader, slotAction, slotIcon, title, description, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <div className="flex items-center justify-between">
          {renderHeader ? (
            renderHeader({ title, description })
          ) : (
            <div>
              {slotIcon && <span className="mr-2">{slotIcon}</span>}
              <h3>{title}</h3>
              {description && <p>{description}</p>}
            </div>
          )}
          {slotAction}
        </div>
        {children}
      </div>
    );
  }
);
```

```tsx
// Consumer usage — custom header with a badge
<Card
  renderHeader={({ title }) => (
    <div className="flex gap-2 items-center">
      <CustomBadge>NEW</CustomBadge>
      <h3 className="text-xl font-black">{title}</h3>
    </div>
  )}
  slotAction={<IconButton icon={MoreHorizontal} />}
/>
```

**Slot naming convention:**

- `slot[Name]` — for injecting additional content (additive)
- `render[Name]` — for replacing default rendering (substitutive)

---

### Layer 6: `asChild` Pattern (Element Polymorphism)

Components that render interactive HTML elements must support the **`asChild`** prop (powered by Radix's `Slot` primitive). This lets consumers render the component **as any element** — links, router components, or custom elements.

```tsx
import { Slot } from '@radix-ui/react-slot';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  }
);
```

```tsx
// Consumer usage — Button rendered as a Next.js Link
import Link from "next/link";

<Button asChild variant="outline">
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

// Consumer usage — Button rendered as an anchor
<Button asChild>
  <a href="https://example.com" target="_blank">External Link</a>
</Button>
```

**Rule for contributors:** All components rendering `<button>`, `<a>`, or `<input>` as their root element **must** support `asChild`.

---

### Layer 7: Unstyled / Headless Mode

For consumers who want our **logic and accessibility** but bring their own design system entirely, expose an `unstyled` prop that strips all visual Tailwind classes while preserving:

- ARIA attributes and roles
- Keyboard navigation
- Focus management
- State management
- Event handlers
- Data attributes

```tsx
// Component implementation (contributor)
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, unstyled = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={unstyled ? className : cn(buttonVariants({ variant, size }), className)}
        data-variant={variant}
        data-size={size}
        {...props}
      />
    );
  }
);
```

```tsx
// Consumer usage — fully custom styling, our a11y + logic
<Dialog unstyled classNames={{ content: 'my-custom-modal' }}>
  {/* Keyboard nav, focus trap, ESC to close all still work */}
</Dialog>
```

**Rule for contributors:** Every component **must** support `unstyled?: boolean` in its props interface. When `unstyled` is `true`, the component renders **zero** Tailwind utility classes from cva — only the consumer's `className` / `classNames` are applied.

---

### Layer Summary

| Layer | Prop / API     | Effort  | Control Level          | Use Case                                   |
| ----- | -------------- | ------- | ---------------------- | ------------------------------------------ |
| 1     | CSS Variables  | Minimal | Global theming         | "I want my brand colors everywhere"        |
| 2     | `className`    | Low     | Root element override  | "I need this one button to look different" |
| 3     | `classNames`   | Low     | Sub-element targeting  | "I want to restyle the dialog's overlay"   |
| 4     | `data-*` attrs | Low     | Pure CSS state styling | "I want custom hover/active/open styles"   |
| 5     | Slots / Render | Medium  | Content replacement    | "I want a completely custom card header"   |
| 6     | `asChild`      | Medium  | Element polymorphism   | "I need this button to be a Next.js Link"  |
| 7     | `unstyled`     | High    | Full headless mode     | "I'm bringing my own CSS framework"        |

### Customization Testing Requirements

Every component's test suite **must** include:

```tsx
describe('customization', () => {
  it('merges custom className onto root', () => {
    render(<Button className="custom-class">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('applies classNames to sub-elements', () => {
    // For compound components
    render(<Dialog classNames={{ overlay: 'custom-overlay' }} />);
    expect(document.querySelector('[data-overlay]')).toHaveClass('custom-overlay');
  });

  it('renders data attributes for state', () => {
    render(
      <Button variant="destructive" disabled>
        Test
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'destructive');
    expect(btn).toHaveAttribute('data-disabled');
  });

  it('supports asChild rendering', () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>
    );
    expect(screen.getByRole('link')).toHaveTextContent('Link');
  });

  it('strips styles when unstyled is true', () => {
    const { container } = render(<Button unstyled>Test</Button>);
    const btn = container.querySelector('button');
    // Should have no cva-generated classes
    expect(btn?.className).toBe('');
  });
});
```

---

## 🎨 Styling Rules

### The `cn()` Utility

All className composition **must** use the `cn()` utility (wraps `clsx` + `tailwind-merge`):

```tsx
import { cn } from '@deveditor/ui/utils';

cn('px-4 py-2', variant === 'ghost' && 'bg-transparent', className);
```

### Tailwind Class Ordering

Follow this order for readability:

```
1. Layout       → flex, grid, block, hidden
2. Position     → relative, absolute, fixed, sticky
3. Sizing       → w-*, h-*, min-*, max-*
4. Spacing      → m-*, p-*, gap-*
5. Typography   → text-*, font-*, tracking-*, leading-*
6. Backgrounds  → bg-*
7. Borders      → border-*, rounded-*
8. Effects      → shadow-*, opacity-*, ring-*
9. Transitions  → transition-*, duration-*, ease-*
10. States      → hover:*, focus:*, active:*, disabled:*
```

### Animation Standards

| Effect         | Implementation                                  |
| -------------- | ----------------------------------------------- |
| Hover          | `transition-all duration-200` or `duration-300` |
| Appear/Enter   | `animate-in fade-in slide-in-from-bottom-4`     |
| Exit           | `animate-out fade-out slide-out-to-bottom-4`    |
| Scale on hover | `group-hover:scale-110 transition-transform`    |
| Glow           | `hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]` |
| Skeleton       | `animate-pulse bg-muted rounded-md`             |

---

## ♿ Accessibility Standards

> **Target: WCAG 2.1 AA compliance.** No exceptions. No shortcuts. No "we'll fix it later."
> Accessibility is not a feature — it is a **foundational requirement** of every component.

---

### 1. Semantic HTML First

Always use the correct semantic HTML element before reaching for ARIA:

| Need              | Use This           | NOT This                      |
| ----------------- | ------------------ | ----------------------------- |
| Clickable action  | `<button>`         | `<div onClick>`               |
| Navigation link   | `<a href>`         | `<span onClick>`              |
| Form label        | `<label htmlFor>`  | `<div className="label">`     |
| List of items     | `<ul>` / `<ol>`    | `<div>` with `<div>` children |
| Table data        | `<table>` / `<th>` | CSS grid mimicking a table    |
| Heading hierarchy | `<h1>` – `<h6>`    | `<div className="heading">`   |
| Navigation region | `<nav>`            | `<div role="navigation">`     |
| Main content      | `<main>`           | `<div id="main">`             |

**Rule:** If a native HTML element provides the semantics you need, use it. The `role` attribute is a **last resort**, not a first choice.

---

### 2. Keyboard Navigation Patterns

Every interactive component must follow the **WAI-ARIA Authoring Practices** keyboard patterns. Radix handles most of these — do **not** override them.

#### Per-Component Keyboard Contracts

| Component Type        | Required Keys                                                | Behavior                                   |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| **Button**            | `Enter`, `Space`                                             | Activate the button                        |
| **Link**              | `Enter`                                                      | Follow the link                            |
| **Checkbox**          | `Space`                                                      | Toggle checked state                       |
| **Switch / Toggle**   | `Space`, `Enter`                                             | Toggle on/off                              |
| **Radio Group**       | `Arrow ↑↓` or `Arrow ←→`                                     | Move selection between options             |
| **Tabs**              | `Arrow ←→` (horizontal) / `Arrow ↑↓` (vertical)              | Move between tabs; `Tab` moves to panel    |
| **Select / Combobox** | `Arrow ↑↓` to navigate, `Enter` to select, `Escape` to close | Type-ahead search when focused             |
| **Dialog / Modal**    | `Escape` to close, `Tab` trapped inside                      | Focus first focusable element on open      |
| **Dropdown Menu**     | `Arrow ↑↓` to navigate, `Enter` to select, `Escape` to close | Focus first item on open                   |
| **Tooltip**           | `Escape` to dismiss                                          | Show on focus, hide on blur                |
| **Accordion**         | `Enter` / `Space` on header                                  | Toggle section; `Arrow ↑↓` between headers |
| **Slider**            | `Arrow ←→` (step), `Home` / `End`                            | Increment/decrement value                  |
| **Toast**             | `Escape` to dismiss (if persistent)                          | Auto-dismiss after timeout                 |

**Rule for contributors:** Before implementing a component, read the corresponding [WAI-ARIA Authoring Practice](https://www.w3.org/WAI/ARIA/apg/patterns/). Link the relevant APG pattern in the component's JSDoc.

---

### 3. Focus Management

#### Focus Indicators

All interactive elements must have a **visible focus ring**:

```tsx
// Default focus style for all components
'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
```

- Use `focus-visible` (not `focus`) to avoid showing rings on mouse clicks.
- The ring color must meet **3:1 contrast** against surrounding backgrounds.
- Never use `outline: none` without providing an alternative focus indicator.

#### Focus Trapping (Modals & Overlays)

Components that open as overlays **must** trap focus inside:

| Component    | Focus Behavior                                                        |
| ------------ | --------------------------------------------------------------------- |
| **Dialog**   | Trap focus. Return focus to trigger on close.                         |
| **Popover**  | Trap focus. Return focus to trigger on close.                         |
| **Dropdown** | Trap focus. Return focus to trigger on close.                         |
| **Toast**    | Do NOT trap focus (non-modal). Must be reachable via `F6` or tabbing. |
| **Tooltip**  | Do NOT trap focus. Dismiss on `Escape`.                               |
| **Sheet**    | Trap focus. Return focus to trigger on close.                         |

**Focus restoration rule:** When a modal/overlay closes, focus **must** return to the element that triggered it. Radix handles this — do not interfere.

#### Programmatic Focus

When content changes dynamically (e.g., a new step in a wizard, search results appearing):

```tsx
// Move focus to the new content
const resultRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (results.length > 0) {
    resultRef.current?.focus();
  }
}, [results]);

<div ref={resultRef} tabIndex={-1} role="region" aria-label="Search results">
  {/* results content */}
</div>;
```

---

### 4. ARIA Attributes

#### Mandatory ARIA Rules

1. **Don't override Radix ARIA** — Radix primitives set correct ARIA attributes. Only add attributes they don't handle.
2. **`aria-label` for icon-only buttons** — Every button without visible text must have a descriptive label:

```tsx
// ✅ Correct
<Button variant="ghost" size="icon" aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// ❌ Wrong — screen reader says "button"
<Button variant="ghost" size="icon">
  <X className="h-4 w-4" />
</Button>
```

3. **`aria-describedby` for help text** — Connect form fields to their help text or error messages:

```tsx
<Input id="email" aria-describedby="email-help email-error" />
<p id="email-help" className="text-muted-foreground text-sm">We'll never share your email.</p>
<p id="email-error" role="alert" className="text-destructive text-sm">Invalid email address.</p>
```

4. **`aria-live` for dynamic content** — Announce changes to screen readers:

| Content Change              | `aria-live` Value | Example                      |
| --------------------------- | ----------------- | ---------------------------- |
| Error messages              | `assertive`       | Form validation errors       |
| Status updates              | `polite`          | "File uploaded successfully" |
| Toast notifications         | `polite`          | Non-critical notifications   |
| Critical alerts             | `assertive`       | Session expired, data loss   |
| Loading states              | `polite`          | "Loading results..."         |
| Search result count updates | `polite`          | "5 results found"            |

5. **`aria-busy`** — Set on containers that are loading:

```tsx
<div role="region" aria-busy={isLoading} aria-live="polite">
  {isLoading ? <Skeleton /> : <Results />}
</div>
```

#### Live Region Pattern

For toasts, status messages, and dynamic announcements:

```tsx
/**
 * Reusable live region for screen reader announcements.
 * Render once at the app root — announce via context/hook.
 */
const LiveAnnouncer = () => {
  const { message, priority } = useLiveAnnouncer();
  return (
    <div
      role="status"
      aria-live={priority} // "polite" or "assertive"
      aria-atomic="true"
      className="sr-only" // Visually hidden, screen-reader only
    >
      {message}
    </div>
  );
};
```

---

### 5. Color & Contrast

#### Contrast Ratios (WCAG AA)

| Element Type                      | Minimum Ratio  | How to Check                    |
| --------------------------------- | -------------- | ------------------------------- |
| Normal text (< 18px)              | **4.5:1**      | Foreground vs. background       |
| Large text (≥ 18px bold / ≥ 24px) | **3:1**        | Foreground vs. background       |
| UI components & borders           | **3:1**        | Against adjacent colors         |
| Focus indicators                  | **3:1**        | Against surrounding background  |
| Placeholder text                  | **4.5:1**      | Against input background        |
| Disabled elements                 | No requirement | But should still be perceivable |

#### Color-Independent Communication

**Never** use color as the only means to convey information:

```tsx
// ❌ Wrong — only color indicates error
<Input className={hasError ? "border-red-500" : "border-border"} />

// ✅ Correct — color + icon + text
<Input
  className={hasError ? "border-destructive" : "border-border"}
  aria-invalid={hasError}
  aria-describedby={hasError ? "input-error" : undefined}
/>
{hasError && (
  <p id="input-error" role="alert" className="flex items-center gap-1 text-destructive text-sm">
    <AlertCircle className="w-4 h-4" />
    This field is required.
  </p>
)}
```

#### High Contrast Mode (Windows)

Components must remain usable in Windows High Contrast Mode (forced-colors):

```css
@media (forced-colors: active) {
  .button {
    border: 2px solid ButtonText; /* Use system color keywords */
  }

  .focus-ring {
    outline: 2px solid Highlight; /* System highlight color */
  }
}
```

**Rule:** Test components with `forced-colors: active` in browser DevTools. Ensure all interactive elements have visible borders or outlines in this mode.

---

### 6. Motion & Animation

#### `prefers-reduced-motion` — Mandatory

All animations and transitions must be disabled or minimized when the user prefers reduced motion:

```css
/* Global — include in the shared stylesheet */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**In components:** Use the `useReducedMotion()` hook for JS-driven animations:

```tsx
import { useReducedMotion } from '@deveditor/ui/hooks';

const Toast = ({ children }: ToastProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'transform transition-all',
        prefersReducedMotion
          ? '' // No animation
          : 'animate-in slide-in-from-right-full duration-300'
      )}
    >
      {children}
    </div>
  );
};
```

#### Auto-playing & Looping

- **Never** auto-play animations that loop infinitely (WCAG 2.2.2).
- Provide a pause/stop mechanism for any animation longer than 5 seconds.
- Skeleton loaders (`animate-pulse`) are exempt — they stop when content loads.

---

### 7. Touch & Pointer

| Requirement             | Minimum                      | Notes                                 |
| ----------------------- | ---------------------------- | ------------------------------------- |
| Touch target size       | **44×44px**                  | Per WCAG 2.5.8 (Target Size Enhanced) |
| Spacing between targets | **8px**                      | Prevents accidental taps              |
| Drag actions            | Must have alternative        | Provide button/keyboard alternative   |
| Hover-dependent content | Must be triggerable by focus | Tooltips, popovers                    |

**Rule:** If a component has a visual size smaller than 44px (e.g., a compact icon button), its **hit area** must still be 44px via padding or a transparent pseudo-element:

```tsx
// Small visual button, large hit area
<button className="relative w-8 h-8 before:absolute before:inset-[-6px] before:content-['']">
  <X className="w-4 h-4" />
</button>
```

---

### 8. Screen Reader Content

#### Visually Hidden Text

Use `sr-only` for text that should be read aloud but not displayed:

```tsx
<Button>
  <Trash className="w-4 h-4" />
  <span className="sr-only">Delete item</span>
</Button>

<Badge>
  <span className="sr-only">Status: </span>
  Active
</Badge>
```

#### Skip Navigation

If the library provides a layout component, it **must** include a skip link:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:border focus:rounded-md focus:shadow-lg"
>
  Skip to main content
</a>
```

---

### 9. Form Accessibility

#### Required Form Patterns

Every form-related component **must** implement:

```tsx
<div role="group" aria-labelledby="field-label">
  <Label id="field-label" htmlFor="field-input">
    Email Address
    {required && (
      <span aria-hidden="true" className="text-destructive ml-1">
        *
      </span>
    )}
    {required && <span className="sr-only">(required)</span>}
  </Label>

  <Input
    id="field-input"
    aria-required={required}
    aria-invalid={!!error}
    aria-describedby={cn(helpText && 'field-help', error && 'field-error')}
  />

  {helpText && (
    <p id="field-help" className="text-sm text-muted-foreground">
      {helpText}
    </p>
  )}

  {error && (
    <p id="field-error" role="alert" className="text-sm text-destructive">
      <AlertCircle className="inline w-3 h-3 mr-1" />
      {error}
    </p>
  )}
</div>
```

#### Error Announcement Strategy

| Timing         | Method                                     | Example                           |
| -------------- | ------------------------------------------ | --------------------------------- |
| On field blur  | Inline error with `role="alert"`           | "Email is required"               |
| On form submit | Focus the first invalid field              | Programmatic `.focus()` call      |
| Error summary  | `aria-live="assertive"` region at form top | "3 errors found. Please correct." |

---

### 10. RTL (Right-to-Left) Support

Components must not break in RTL layouts:

- Use **logical CSS properties** instead of directional ones:

| ❌ Don't Use       | ✅ Use Instead          |
| ------------------ | ----------------------- |
| `margin-left`      | `margin-inline-start`   |
| `padding-right`    | `padding-inline-end`    |
| `text-align: left` | `text-align: start`     |
| `border-left`      | `border-inline-start`   |
| `left: 0`          | `inset-inline-start: 0` |

- In Tailwind, prefer `ms-*` / `me-*` / `ps-*` / `pe-*` over `ml-*` / `mr-*` / `pl-*` / `pr-*`.
- Icons that imply direction (arrows, chevrons) must flip in RTL mode.
- Test every component with `dir="rtl"` on the root element.

---

### 11. Accessibility Testing (3-Layer Protocol)

#### Layer A: Automated (axe-core) — Every PR

Every component test file **must** include axe-core assertions:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

describe('accessibility', () => {
  it('has no axe violations (default)', async () => {
    const { container } = render(<Button>Click me</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (disabled state)', async () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (all variants)', async () => {
    const { container } = render(
      <>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

#### Layer B: Keyboard E2E (Playwright) — Every PR

```tsx
// Playwright keyboard navigation test
test('Dialog: full keyboard flow', async ({ page }) => {
  await page.goto('/storybook/dialog--default');

  // Open dialog
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // Verify focus is inside dialog
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Tab through focusable elements inside
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox')).toBeFocused();

  // Close with Escape
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();

  // Verify focus returned to trigger
  await expect(page.getByRole('button', { name: 'Open Dialog' })).toBeFocused();
});
```

#### Layer C: Manual Screen Reader Audit — Before Major Release

Before any major version release, manually verify every component with:

| Screen Reader | Browser          | OS      |
| ------------- | ---------------- | ------- |
| **VoiceOver** | Safari           | macOS   |
| **NVDA**      | Chrome / Firefox | Windows |
| **TalkBack**  | Chrome           | Android |

**What to verify:**

- Component role is announced correctly
- State changes are announced (open/closed, checked/unchecked, expanded/collapsed)
- Error messages are announced immediately
- Focus order is logical
- All interactive elements are reachable and operable

---

## 🧪 Testing Requirements

> **No component ships without tests.** Period.

### Test Pyramid

```
         ┌──────────────┐
         │  Playwright   │  Visual regression + E2E
         │  (few, slow)  │  → Screenshot comparisons
         ├──────────────┤
         │   Vitest +    │  Component integration
         │   RTL (many)  │  → Render, interact, assert
         ├──────────────┤
         │   Vitest      │  Pure logic unit tests
         │  (fast, many) │  → Utils, hooks, helpers
         └──────────────┘
```

### Vitest (Unit / Integration)

Every component **must** have tests covering:

| Category            | What to Test                                             |
| ------------------- | -------------------------------------------------------- |
| **Rendering**       | Renders without crashing, correct HTML element           |
| **Props**           | Each prop affects output as expected                     |
| **Variants**        | Every variant renders with correct classes               |
| **Events**          | Click, change, focus, blur handlers fire correctly       |
| **Accessibility**   | axe-core passes, ARIA attributes present                 |
| **Ref forwarding**  | `ref` correctly attaches to DOM node                     |
| **className merge** | Custom `className` merges without overriding base styles |
| **Edge cases**      | Empty states, long text, missing optional props          |

### Playwright (Visual Regression)

- Take **baseline screenshots** of every Storybook story.
- Run on CI for every PR — fail if pixel diff exceeds **0.1%** threshold.
- Capture in **both light and dark modes**.
- Capture at **3 viewports**: `375px` (mobile), `768px` (tablet), `1440px` (desktop).

### Coverage Thresholds

| Metric     | Minimum |
| ---------- | ------- |
| Statements | 90%     |
| Branches   | 85%     |
| Functions  | 90%     |
| Lines      | 90%     |

CI will **fail** if coverage drops below these thresholds.

---

## 📖 Storybook Standards

We use **Storybook 10** with the React + Vite framework (`@storybook/react-vite`). Stories use the CSF3 format with `Meta` and `StoryObj` types from `@storybook/react`.

**Note:** Storybook 10 is **ESM-only**. It no longer publishes CommonJS; this reduces install size (~29%) and keeps the distribution un-minified for easier debugging. The Storybook app and config (e.g. `.storybook/main.ts`) must use ESM (`import`/`export`, `import.meta`).

### Story Structure

Every component must have a `.stories.tsx` file with:

1. **Default** story — Component with default props.
2. **All Variants** story — Grid showing every variant/size combination.
3. **Interactive** story — Demonstrates event handling with `action()` logger.
4. **Dark Mode** story — Explicit dark mode rendering.
5. **Edge Cases** story — Long text, empty states, disabled states, loading states.

### Story Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

### Storybook 10 Addons

| Addon                           | Purpose                                   |
| ------------------------------- | ----------------------------------------- |
| `@storybook/addon-docs`        | Auto-generated docs and MDX documentation |
| `@storybook/addon-links`       | Link between stories and external URLs    |
| `@storybook/addon-vitest`      | Run Vitest tests from within Storybook    |
| `@storybook/addon-essentials`  | (Optional) Controls, actions, viewport    |
| `@storybook/addon-a11y`        | (Optional) Accessibility panel in stories |
| `@storybook/addon-themes`      | (Optional) Light/dark mode toggle         |

---

## 🌍 Internationalization (i18n)

> **Philosophy:** Components are **i18n-ready**, not **i18n-bundled**.
> We don't ship translations — we make every component trivially easy to internationalize with whatever i18n library the consumer uses (`react-intl`, `next-intl`, `i18next`, or plain functions).

---

### Core Principle: Zero Hardcoded Strings

**No component may contain hardcoded user-facing text.** Every piece of visible text must come from:

- Props (for simple components)
- Children (for compositional components)
- A labels/messages prop object (for complex components with many internal strings)

```tsx
// ❌ WRONG — hardcoded English strings
const Dialog = () => (
  <div>
    <button>Close</button>
    <p>Are you sure you want to continue?</p>
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
);

// ✅ CORRECT — all text via props/children
interface DialogProps {
  children: React.ReactNode;
  /** Labels for internal UI elements (close button, etc.) */
  labels?: {
    close?: string; // default: "Close"
  };
}

const Dialog = ({ children, labels }: DialogProps) => (
  <div>
    <button aria-label={labels?.close ?? 'Close'}>
      <X className="w-4 h-4" />
    </button>
    {children}
  </div>
);
```

---

### Default Labels Object Pattern

For components with internal text (buttons, placeholders, status messages), expose a **`labels`** prop with sensible English defaults:

```tsx
// Define defaults in a separate constant (exported for documentation)
export const DEFAULT_DIALOG_LABELS = {
  close: 'Close',
} as const;

export const DEFAULT_PAGINATION_LABELS = {
  previous: 'Previous',
  next: 'Next',
  page: 'Page',
  of: 'of',
  showing: 'Showing',
  results: 'results',
} as const;

export const DEFAULT_FILE_UPLOAD_LABELS = {
  dragDrop: 'Drag & drop files here',
  browse: 'Browse files',
  uploading: 'Uploading...',
  uploaded: 'Upload complete',
  error: 'Upload failed',
  remove: 'Remove file',
  maxSize: 'Max file size: {size}',
} as const;

// Component usage
interface PaginationProps {
  labels?: Partial<typeof DEFAULT_PAGINATION_LABELS>;
}

const Pagination = ({ labels: userLabels }: PaginationProps) => {
  const labels = { ...DEFAULT_PAGINATION_LABELS, ...userLabels };
  return (
    <nav aria-label={labels.page}>
      <button>{labels.previous}</button>
      <span>
        {labels.page} 1 {labels.of} 10
      </span>
      <button>{labels.next}</button>
    </nav>
  );
};
```

```tsx
// Consumer usage — Japanese
<Pagination
  labels={{
    previous: '前へ',
    next: '次へ',
    page: 'ページ',
    of: '/',
  }}
/>
```

**Rule for contributors:** Always export the `DEFAULT_*_LABELS` constant so consumers can see all translatable keys and their defaults.

---

### i18n Provider Pattern (Optional)

For apps that want to configure translations globally (instead of per-component), we provide a `DeveditorUIProvider`:

```tsx
// Provider definition (in the library)
import { createContext, useContext } from 'react';

interface DeveditorUILocale {
  /** Text direction */
  dir: 'ltr' | 'rtl';
  /** BCP 47 locale tag */
  locale: string;
  /** Global label overrides — keyed by component name */
  labels?: {
    dialog?: Partial<typeof DEFAULT_DIALOG_LABELS>;
    pagination?: Partial<typeof DEFAULT_PAGINATION_LABELS>;
    fileUpload?: Partial<typeof DEFAULT_FILE_UPLOAD_LABELS>;
    // ... one entry per component with internal text
  };
}

const defaultLocale: DeveditorUILocale = {
  dir: 'ltr',
  locale: 'en-US',
};

const UIContext = createContext<DeveditorUILocale>(defaultLocale);

export const DeveditorUIProvider = ({
  value,
  children,
}: {
  value: Partial<DeveditorUILocale>;
  children: React.ReactNode;
}) => <UIContext.Provider value={{ ...defaultLocale, ...value }}>{children}</UIContext.Provider>;

export const useUILocale = () => useContext(UIContext);
```

```tsx
// Consumer usage — Arabic app
import { DeveditorUIProvider } from '@deveditor/ui';

<DeveditorUIProvider
  value={{
    dir: 'rtl',
    locale: 'ar-SA',
    labels: {
      dialog: { close: 'إغلاق' },
      pagination: { previous: 'السابق', next: 'التالي', page: 'صفحة', of: 'من' },
    },
  }}
>
  <App />
</DeveditorUIProvider>;
```

**Label resolution order:**

1. Component-level `labels` prop (highest priority)
2. `DeveditorUIProvider` global labels
3. `DEFAULT_*_LABELS` English fallback

```tsx
// Inside a component — resolving labels
const Pagination = ({ labels: propLabels }: PaginationProps) => {
  const { labels: globalLabels } = useUILocale();
  const labels = {
    ...DEFAULT_PAGINATION_LABELS, // 3. English defaults
    ...globalLabels?.pagination, // 2. Provider overrides
    ...propLabels, // 1. Prop overrides (wins)
  };
  // ...
};
```

---

### Locale-Aware Formatting

Components that display **numbers, dates, currencies, or lists** must use the browser's `Intl` APIs — never hardcode formatting.

#### Numbers

```tsx
// ❌ Wrong — hardcoded format
<span>{count.toLocaleString()}</span>;

// ✅ Correct — locale from provider
const { locale } = useUILocale();
const formatter = new Intl.NumberFormat(locale);
<span>{formatter.format(count)}</span>;
// en-US: "1,234,567"  •  de-DE: "1.234.567"  •  hi-IN: "12,34,567"
```

#### Dates & Times

```tsx
const { locale } = useUILocale();

// Relative time ("2 hours ago")
const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
<span>{rtf.format(-2, 'hour')}</span>;
// en: "2 hours ago"  •  ja: "2 時間前"  •  ar: "قبل ساعتين"

// Absolute date
const dtf = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
<time dateTime={date.toISOString()}>{dtf.format(date)}</time>;
// en-US: "Mar 12, 2026"  •  de-DE: "12. März 2026"
```

#### Lists

```tsx
const { locale } = useUILocale();
const lf = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' });
<span>{lf.format(['Red', 'Green', 'Blue'])}</span>;
// en: "Red, Green, and Blue"  •  ja: "Red、Green、Blue"
```

**Rule:** Never use string concatenation for formatted output. Always use `Intl` APIs.

---

### Pluralization

Use `Intl.PluralRules` for quantity-dependent text:

```tsx
const { locale } = useUILocale();
const pr = new Intl.PluralRules(locale);

// Define plural forms per locale
const resultMessages: Record<string, string> = {
  zero: 'No results found',
  one: '1 result found',
  other: `${count} results found`,
};

<span>{resultMessages[pr.select(count)]}</span>;
```

For components with default internal messages, include all plural forms in the `labels` object:

```tsx
export const DEFAULT_SEARCH_LABELS = {
  results_zero: 'No results',
  results_one: '{count} result',
  results_other: '{count} results',
} as const;
```

---

### RTL Layout (Reference)

RTL layout rules are covered in [Accessibility Standards → Section 10: RTL Support](#10-rtl-right-to-left-support). Key reminders:

- Use logical CSS properties (`ms-*`, `me-*`, `ps-*`, `pe-*` in Tailwind)
- Flip directional icons
- Set `dir` attribute from the `DeveditorUIProvider`
- Test every component in RTL mode

The `DeveditorUIProvider` automatically sets `dir` on the wrapping element:

```tsx
export const DeveditorUIProvider = ({ value, children }: ProviderProps) => {
  const config = { ...defaultLocale, ...value };
  return (
    <UIContext.Provider value={config}>
      <div dir={config.dir} lang={config.locale}>
        {children}
      </div>
    </UIContext.Provider>
  );
};
```

---

### Font & Script Considerations

Different scripts have different typographic needs:

| Script         | Consideration                                       | Action                                   |
| -------------- | --------------------------------------------------- | ---------------------------------------- |
| **CJK**        | Characters are wider; line heights need adjustment  | Use `leading-relaxed` or `leading-loose` |
| **Arabic**     | Cursive connections; RTL; different numeral systems | Use `font-feature-settings: "calt"`      |
| **Devanagari** | Requires more vertical space; conjuncts             | Increase `line-height` by ~20%           |
| **Thai**       | No word breaks; needs `word-break: keep-all`        | Add `break-keep` Tailwind class          |

**Rule:** Components must not set `overflow: hidden` on text containers without also setting `text-overflow: ellipsis`. Truncated text in longer scripts (German, Finnish) would otherwise silently disappear.

---

### i18n Component Checklist

Before marking any component as i18n-ready:

- [ ] **Zero hardcoded strings** — all visible text comes from props, children, or `labels`
- [ ] **`labels` prop exposed** — with exported `DEFAULT_*_LABELS` constant
- [ ] **Provider integration** — reads from `useUILocale()` as fallback
- [ ] **Intl formatting** — numbers, dates, lists use `Intl` APIs with `locale`
- [ ] **Pluralization** — quantity-dependent text handles all plural categories
- [ ] **RTL tested** — component renders correctly with `dir="rtl"`
- [ ] **Long text tested** — UI doesn't break with German/Finnish translations (~40% longer)
- [ ] **CJK tested** — layout handles wider characters without overflow
- [ ] **`lang` attribute** — content sections set `lang` if they differ from the page locale
- [ ] **Storybook stories** — includes a "Localized" story showing at least 2 non-English locales

---

## 🖥️ SSR & Next.js Compatibility

> **Primary consumer:** Next.js App Router (Server Components + Client Components).
> Every component must render correctly on the server and hydrate without mismatches.

---

### `"use client"` Directive Rules

Next.js App Router defaults to **Server Components**. Any component using hooks, event handlers, or browser APIs must be marked as a Client Component.

**Rule:** Add `"use client"` at the **top of the component file** (not the barrel `index.ts`).

```tsx
// packages/ui/src/components/dialog/Dialog.tsx
'use client';

import React, { useState } from 'react';
// ...
```

```tsx
// packages/ui/src/components/dialog/index.ts
// ⚠️ NO "use client" here — let the component file declare it
export { Dialog } from './Dialog';
export type { DialogProps } from './Dialog.types';
```

#### What Requires `"use client"`

| Trigger                                | Examples                              |
| -------------------------------------- | ------------------------------------- |
| `useState`, `useReducer`               | Toggle, form state, controlled inputs |
| `useEffect`, `useLayoutEffect`         | Side effects, DOM measurements        |
| `useRef` (with DOM mutation)           | Focus management, scroll position     |
| `useContext`                           | `useUILocale()`, theme context        |
| Event handlers (`onClick`, `onChange`) | All interactive components            |
| Browser APIs (`window`, `document`)    | Media queries, localStorage           |

#### What Does NOT Require `"use client"`

| Pattern                        | Examples                                 |
| ------------------------------ | ---------------------------------------- |
| Pure props → JSX               | `Badge`, `Separator`, display-only cards |
| `cn()` class merging           | All components (cn is a pure function)   |
| `cva` variant generation       | Variant helpers                          |
| Type definitions (`.types.ts`) | Props interfaces                         |
| Utility functions (`utils/`)   | `cn()`, formatters, validators           |

---

### Forbidden Browser APIs on the Server

These APIs do not exist during SSR. **Never** call them at the module level or during render:

| ❌ Forbidden at Render    | ✅ Safe Alternative                            |
| ------------------------- | ---------------------------------------------- |
| `window.innerWidth`       | `useEffect` + state, or CSS media queries      |
| `document.getElementById` | `useRef` + `useEffect`                         |
| `localStorage.getItem`    | `useEffect` to read after hydration            |
| `navigator.clipboard`     | Guard: `typeof navigator !== "undefined"`      |
| `window.matchMedia`       | `useEffect` with SSR-safe default (see below)  |
| `crypto.randomUUID()`     | Use in `useEffect` or pass as prop from server |

**Pattern for SSR-safe browser API access:**

```tsx
'use client';

const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
};

// Usage in component
const MyComponent = () => {
  const isClient = useIsClient();
  const width = isClient ? window.innerWidth : 0;
  // ...
};
```

---

### Hydration Mismatch Prevention

Hydration mismatches occur when server HTML differs from the first client render. These are the **#1 source of SSR bugs.**

#### Rules to Prevent Mismatches

1. **No conditional rendering based on browser APIs during initial render:**

```tsx
// ❌ WRONG — server renders "light", client might render "dark"
const theme =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    : 'light';
return <div data-theme={theme}>...</div>;

// ✅ CORRECT — use CSS variables, which adapt without JS
return <div className="bg-background text-foreground">...</div>;
```

2. **No `Date.now()` or `Math.random()` in render output:**

```tsx
// ❌ WRONG — different value on server vs client
<span>Generated at {Date.now()}</span>

// ✅ CORRECT — pass as prop from a server component, or set in useEffect
<span>Generated at {timestamp}</span>
```

3. **No `typeof window` checks that change rendered HTML:**

```tsx
// ❌ WRONG — renders different content on server
{
  typeof window !== 'undefined' ? <ClientContent /> : null;
}

// ✅ CORRECT — useEffect + state to reveal client-only content after hydration
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
{
  mounted && <ClientContent />;
}
```

---

### SSR-Safe Hook Pattern

Hooks that depend on browser APIs must return a **safe default** on the server:

```tsx
'use client';

import { useState, useEffect } from 'react';

/**
 * Returns true if the user prefers reduced motion.
 * SSR-safe: returns false on the server, updates after hydration.
 */
export const useReducedMotion = (): boolean => {
  const [prefersReduced, setPrefersReduced] = useState(false); // SSR default

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
};

/**
 * Returns true after the component has mounted on the client.
 * Useful for rendering client-only content without hydration mismatches.
 */
export const useIsMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

/**
 * SSR-safe media query hook.
 * Returns false on the server, then updates after hydration.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false); // SSR default

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
};
```

---

### Component SSR Classification

Every component should be classified in its JSDoc:

| Classification      | Meaning                                         | Example Components                   |
| ------------------- | ----------------------------------------------- | ------------------------------------ |
| **Server-safe**     | No `"use client"` needed, pure render           | `Badge`, `Separator`, `Skeleton`     |
| **Client-required** | Needs `"use client"`, interactive               | `Button`, `Dialog`, `Tabs`, `Select` |
| **Client-deferred** | Renders placeholder on server, updates on mount | Theme toggle, clipboard buttons      |

```tsx
/**
 * @ssr client-required
 * @reason Uses useState for open/close state and focus trapping
 */
const Dialog = React.forwardRef<HTMLDivElement, DialogProps>();
// ...
```

---

## ⚡ Performance Budget

### Bundle Size Rules

| Constraint                  | Limit                                    |
| --------------------------- | ---------------------------------------- |
| Individual component        | < **5 KB** gzipped (CSS + JS)            |
| Total package (all exports) | < **50 KB** gzipped                      |
| No dependency > 10KB gz     | Choose lighter alternatives or lazy-load |

### Performance Rules

1. **Tree-shaking**: All exports must be tree-shakeable. Use named exports only — never `export default` for components.
2. **No side effects**: Declare `"sideEffects": false` in `package.json` (except CSS imports).
3. **Lazy load heavy components**: Components requiring large deps (e.g., syntax highlighting, date pickers) must use `React.lazy()` and `Suspense`.
4. **Minimize re-renders**: Use `React.memo()` for components that render often with the same props. Memoize expensive computations with `useMemo()`.
5. **CSS-only animations**: Prefer CSS transitions over JavaScript-driven animation libraries.

---

## 📝 Documentation Requirements

> **Goal:** Anyone contributing to the project should be able to understand the code by reading it. Every piece of logic should be clear from the code itself, with comments where intent or behavior is not obvious.

### Inline Comments for Logic

- **Document non-obvious logic** — Use inline comments to explain *why* something is done, not *what* the code does (the code should show that). This helps contributors (and future you) understand intent, edge cases, and constraints.
- **Where to comment:** Complex conditionals, workarounds, non-obvious algorithms, accessibility or focus logic, integration with third-party APIs (e.g. Radix), and any branch that exists to satisfy a specific requirement (a11y, SSR, etc.).
- **Keep comments concise** — One line above the block or a short trailing comment. Update comments when you change the logic; remove comments that become obsolete.
- **Prefer self-explanatory code** — Good naming and small functions often make comments unnecessary. Add comments when the "why" or context is not obvious from the code alone.

### Every Component Must Have:

1. **JSDoc on the component** — Description, example usage.
2. **JSDoc on every prop** — What it does, default value, constraints.
3. **Inline comments** — For any logic that isn’t obvious so contributors can follow the code without guessing.
4. **Storybook stories** — As defined above.
5. **README.md** (optional for simple components) — For complex components with non-obvious behavior.

### JSDoc Example

````tsx
/**
 * Primary UI button component.
 *
 * Supports multiple variants, sizes, and can render as a child element
 * using the `asChild` prop (via Radix Slot).
 *
 * @example
 * ```tsx
 * <Button variant="outline" size="lg">
 *   Click me
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>();
// ...
````

### Props Documentation

```tsx
interface ButtonProps {
  /**
   * The visual style of the button.
   * @default "default"
   */
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';

  /**
   * The size of the button.
   * @default "default"
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';

  /**
   * When true, the button renders its child as the root element (Radix Slot pattern).
   * Useful for rendering as `<a>`, `<Link>`, or custom elements.
   * @default false
   */
  asChild?: boolean;
}
```

---

## 🔀 Git & Versioning Protocol

### Branch Strategy

| Branch       | Purpose                              |
| ------------ | ------------------------------------ |
| `main`       | Production — auto-publishes to NPM   |
| `dev`        | Integration — PR target for features |
| `feat/*`     | New component or feature             |
| `fix/*`      | Bug fix                              |
| `docs/*`     | Documentation only                   |
| `refactor/*` | Internal refactor, no API change     |

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(button): add icon-only variant
fix(dialog): correct focus trap on close
docs(input): add placeholder story
test(card): add visual regression baseline
chore(ci): update Node.js version in workflow
```

### Changeset Protocol

Before merging any feature or fix PR:

1. Run `pnpm changeset` in the repo root.
2. Select affected packages.
3. Choose version bump type (`patch` / `minor` / `major`).
4. Write a human-readable summary of the change.
5. Commit the generated `.changeset/*.md` file with the PR.

### Versioning Rules

| Change Type                       | Version Bump |
| --------------------------------- | ------------ |
| Bug fix (no API change)           | `patch`      |
| New feature (backward compatible) | `minor`      |
| Breaking API change               | `major`      |
| New component added               | `minor`      |
| Component removed or renamed      | `major`      |
| Design token value change         | `minor`      |
| Design token name change          | `major`      |

---

## ✅ Checklist: Before You Merge

> Copy this checklist into every PR description. **All items must be checked.**

```markdown
### Component PR Checklist

#### Code Quality

- [ ] TypeScript strict — no `any`, no `@ts-ignore`; types in `.types.ts`; `@ts-expect-error` only with comment if unavoidable
- [ ] `forwardRef` with `displayName` set
- [ ] Props spread onto root element
- [ ] `className` prop accepted and merged via `cn()`
- [ ] Variants defined with `cva`
- [ ] No hardcoded colors, spacing, or font sizes
- [ ] All exports added to `packages/ui/src/index.ts`

#### Customization

- [ ] `className` prop merges correctly (last arg in `cn()`)
- [ ] `classNames` prop exposed (compound components with ≥2 styled parts)
- [ ] `data-*` attributes rendered for all stateful props/states
- [ ] `asChild` supported (components with `<button>`, `<a>`, `<input>` root)
- [ ] `unstyled` prop strips all cva classes
- [ ] Slots / render props exposed for replaceable content areas

#### Styling

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive at 375px, 768px, 1440px
- [ ] Uses only design tokens and Tailwind scale values
- [ ] Animations respect `prefers-reduced-motion`

#### Accessibility

- [ ] Keyboard navigable (Tab, Enter, Space, Escape)
- [ ] Focus indicator visible
- [ ] ARIA attributes correct
- [ ] Color contrast meets WCAG AA (4.5:1 / 3:1)
- [ ] Icon-only buttons have `aria-label`
- [ ] axe-core test passes

#### Testing

- [ ] Vitest unit tests cover: render, props, variants, events, ref, className
- [ ] Customization tests: className merge, classNames, data attrs, asChild, unstyled
- [ ] axe-core a11y assertion included
- [ ] Playwright visual baseline captured (light + dark, 3 viewports)
- [ ] Coverage thresholds maintained (90/85/90/90)

#### Internationalization

- [ ] Zero hardcoded user-facing strings
- [ ] `labels` prop exposed with exported `DEFAULT_*_LABELS`
- [ ] `useUILocale()` fallback integrated for labels resolution
- [ ] Numbers/dates/lists use `Intl` APIs (not string concatenation)
- [ ] RTL layout tested (`dir="rtl"`)
- [ ] Long text (German/Finnish ~40% longer) doesn't break layout
- [ ] Storybook story: Localized (at least 2 non-English locales)

#### Documentation

- [ ] JSDoc on component and all props
- [ ] Inline comments on non-obvious logic (why, not what) so contributors can follow the code
- [ ] Storybook stories: Default, AllVariants, Interactive, DarkMode, EdgeCases
- [ ] Storybook stories: Customization (classNames, unstyled, themed)
- [ ] Changeset file created (`pnpm changeset`)

#### Performance

- [ ] Component < 5KB gzipped
- [ ] No unnecessary re-renders (React.memo if applicable)
- [ ] Tree-shakeable (named exports only)
```

---

> **This design system is a living document.** Update it as patterns evolve, but never lower the quality bar.
> _Follow this system for every component. No exceptions._
