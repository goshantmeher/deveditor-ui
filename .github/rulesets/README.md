# Branch rulesets

Reference JSON for GitHub repository rulesets. Apply via **Settings → Rules → Rulesets** (or the [Rulesets API](https://docs.github.com/en/rest/repos/rules)).

## Restricting who can approve (feature→dev and dev→master)

Both rulesets have **Require review from Code Owners** enabled. That means only people listed in **`.github/CODEOWNERS`** can approve PRs.

### Option A: Specific people via CODEOWNERS (same approvers for both branches)

1. Edit **`.github/CODEOWNERS`** and set the last line to the usernames who may approve:
   - Personal repo: `* @username1 @username2`
   - Org repo: `* @org/username1 @org/username2`
2. Save and push. No ruleset changes needed — the rulesets already have `require_code_owner_review: true`.
3. Only those code owners can satisfy the required approval for both **feature→dev** and **dev→master** PRs.

### Option B: Different approvers per branch (via Required reviewers in GitHub)

Rulesets support **Required reviewers** by **team** (not individual usernames in the API). To have different people for dev vs master:

1. In your GitHub org, create two teams (e.g. "Dev PR approvers", "Master PR approvers") and add the right people to each.
2. **Settings → Rules → Rulesets** → open the ruleset for **dev** → under the pull request rule, add **Required reviewers** and select the dev-approvers team.
3. Open the ruleset for **master** → add **Required reviewers** and select the master-approvers team.
4. If you use teams, you can set `require_code_owner_review` back to `false` in the ruleset JSON so that team approval alone is enough (or keep it true if you also want code owner review).

---

## master branch

- Requires a pull request (dev → master only, enforced by CI).
- **Requires 1 approval** from a **code owner** (see CODEOWNERS). Optionally add Required reviewers (team) in the UI for extra restriction.
- **Merge methods:** Merge commit, squash, and rebase are all allowed.
- **Deletion not allowed** — Only users with bypass permission can delete the `master` branch.
- Push to master runs **publish** only (no version PR; versioning happens on dev).

## dev branch

- Requires a pull request. Status checks must pass (CI + Changeset required).
- **Requires 1 approval** from a **code owner** (see CODEOWNERS). Optionally add Required reviewers (team) in the UI.
- **Merge methods:** Merge commit, squash, and rebase are all allowed.
- **Deletion not allowed** — Only users with bypass permission can delete the `dev` branch.
- Push to dev triggers the **version PR** (changeset-release/dev → dev); merge it to bump versions and update changelogs.
