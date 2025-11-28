# Private Registry Guide (Design Tokens)

## Overview
- Goal: publish the generated design tokens package to a private npm registry and let web/Flutter teams consume it securely.
- Recommended: **GitHub Packages (npm)** - works with existing GitHub auth and scopes.
- Alternatives: Verdaccio (self-hosted, on-prem) or npm Enterprise/Artifact Registry if your org requires them.

## Option A: GitHub Packages (npm) - recommended

### 1) Prerequisites
- GitHub org + repo (this one).
- Package name scoped to the org, e.g. `@acme/design-tokens`.
- `GITHUB_TOKEN` (provided automatically in Actions) has `packages: write`.
- Users need a Personal Access Token (classic or fine-grained) with `read:packages` to install.

### 2) Project setup
- Ensure `package.json` name is scoped: `"name": "@acme/design-tokens"`.
- Add an `.npmrc` (repo root) for publishing:
  ```
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
  @acme:registry=https://npm.pkg.github.com
  always-auth=true
  ```
- Add a local `.npmrc` example for consumers (do NOT commit real tokens):
  ```
  //npm.pkg.github.com/:_authToken=${PERSONAL_ACCESS_TOKEN}
  @acme:registry=https://npm.pkg.github.com
  always-auth=true
  ```

### 3) CI publish step (replace auto-commit)
Add to `.github/workflows/build-tokens.yml` after build:
```yaml
      - name: Publish package (GitHub Packages)
        if: github.ref == 'refs/heads/main'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm publish --registry https://npm.pkg.github.com
```
Notes:
- Permissions: `contents: write` and `packages: write`.
- Keep `paths: 'tokens/**'` so only token changes publish.
- Consider versioning via `pnpm version patch` in CI or manual tagging.

### 4) Consumer install
- Add consumer `.npmrc` (user machine or project root):
  ```
  @acme:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=${PERSONAL_ACCESS_TOKEN}
  ```
- Install: `npm install @acme/design-tokens` (or `pnpm add ...`).
- Import:
  - CSS vars: `import '@acme/design-tokens/css';`
  - SCSS: `@use '@acme/design-tokens/scss';`
  - Vanilla Extract: `import { tokens } from '@acme/design-tokens/vanilla-extract';`
  - Flutter: vendor `build/flutter/tokens.dart` inside the package; Flutter team can consume via git subdir or separate Dart package if desired.

### 5) Access control
- Visibility follows repo permissions. Only users with `read:packages` on the org and repo access can install.
- To revoke: remove PAT or restrict package permissions in GitHub Packages settings.

### 6) Versioning & release flow
- Bump version (`pnpm version patch|minor|major`).
- Tag optional: `git tag v0.1.1 && git push --tags`.
- CI publishes on main; tags help consumers pin.

### 7) Troubleshooting
- 404 on install: check scope/registry in `.npmrc` and PAT scopes (`read:packages`).
- 403 on publish: ensure workflow permissions include `packages: write`; token not expired.
- ERESOLVE/private package: your lockfile likely built against public registry; run install with correct `.npmrc` and prune lockfile.

## Option B: Verdaccio (self-hosted, quick)
- Run `docker run -p 4873:4873 verdaccio/verdaccio`.
- Add `.npmrc`:
  ```
  registry=http://localhost:4873
  //localhost:4873/:_authToken=your-token
  ```
- Configure uplinks to npmjs if you also need public packages.
- Publish: `pnpm publish --registry http://localhost:4873`.
- Secure with reverse proxy + auth for production use.

## What to do next in this repo
1) Pick the registry (GitHub Packages recommended).
2) Add repo `.npmrc` for publishing (with token env var).
3) Update the workflow to publish instead of auto-commit.
4) Add consumer `.npmrc` template to docs/README (no secrets committed).
5) Test: bump version, push to main, run workflow, install from a clean project using PAT.
