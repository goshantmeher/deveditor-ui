# Contributing

## Branch workflow

- **All PRs target the `dev` branch** (integration). Do not open PRs directly to `master`.
- **Releases:** A maintainer opens a single PR **dev → master** when ready to release. Only that PR can be merged into `master` (enforced by CI and branch protection).

```mermaid
flowchart LR
  subgraph contribute [Contributing]
    feature[Feature branch] -->|PR| dev[dev]
  end
  subgraph release [Releasing]
    dev -->|Push triggers CI| versionPR["Version PR\n(changeset-release/dev)"]
    versionPR -->|Merge| dev
    dev -->|PR dev → master| master[master]
    master -->|Push runs publish| npm[npm publish]
  end
```

## Making a change

1. **Create a branch** from `dev`:
   ```bash
   git fetch origin dev
   git checkout -b your-feature origin/dev
   ```

2. **Make your changes.** If you change any code under **`packages/`** (published npm packages), you must add a changeset (see below). Changes under `apps/` (e.g. Storybook) do not require a changeset.

3. **Add a changeset** (only when you changed `packages/`):
   ```bash
   pnpm changeset
   ```
   - Select the package(s) affected (e.g. `@deveditor/ui`).
   - Choose bump type: `patch` | `minor` | `major` (see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for rules).
   - Write a short summary for the changelog.
   - Commit the new `.changeset/*.md` file with your changes.

4. **Open a PR** from your branch **to `dev`** (not to `master`). CI will run:
   - Lint, typecheck, build, test.
   - **Changeset required** — fails if you changed `packages/` but did not add a release changeset.

5. After review, your PR is merged into `dev`.

## Releasing (maintainers)

1. **Version PR on dev:** CI creates or updates a “chore: version packages” PR from **changeset-release/dev** into **dev** on every push to `dev`. Merge that PR into `dev` when you want to bump versions and update changelogs.
2. When `dev` is ready for release, open a PR **dev → master**.
3. CI must pass, including **Master only from dev** (only the `dev` branch can target `master`).
4. Merge the PR. CI on push to `master` runs **publish** (`pnpm run release`: build and publish to npm) and deploys Storybook to GitHub Pages (if configured).

## References

- [.changeset/README.md](./.changeset/README.md) — Changeset workflow and changelog format.
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Design system and versioning rules.
