# Branch rulesets

Reference JSON for GitHub repository rulesets. Apply via **Settings → Rules → Rulesets** (or the [Rulesets API](https://docs.github.com/en/rest/repos/rules)).

## master branch

- Requires a pull request (dev → master only, enforced by CI).
- **Requires 1 approval** before merge.
- **Restrict who can approve:** In GitHub go to **Settings → Rules → Rulesets** → open the ruleset that protects `master` → under the pull request rule, add **Required reviewers** and choose the specific people or team who are allowed to approve merges to `master`.
- Push to master runs **publish** only (no version PR; versioning happens on dev).

## dev branch

- Requires a pull request; no approval required. Status checks must pass (CI + Changeset required).
- Push to dev triggers the **version PR** (changeset-release/dev → dev); merge it to bump versions and update changelogs.
