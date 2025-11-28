# Private Registry Guide (Design Tokens)

## Overview
- Goal: publish the generated design tokens package to a controlled registry and let web/Flutter teams consume it securely.
- Recommended: **npmjs (scoped package)** for widest compatibility. If you need private visibility, use npm org private packages (requires paid plan) or fall back to GitHub Packages/self-hosted.
- Alternatives: GitHub Packages (npm scope) or Verdaccio (self-hosted/on-prem).

## Option A: npmjs (scoped; public or private org)

### 1) Prerequisites
- npm account with publish rights for the scope (e.g., `@veglez`).
- `NPM_TOKEN` with `publish` scope stored as repo secret.
- Scoped package name in `package.json`, e.g. `"name": "@veglez/design-tokens"`.

### 2) Project setup
- No special `.npmrc` needed for public scoped packages.
- For private npm org packages, add (do NOT commit real tokens):
  ```
  //registry.npmjs.org/:_authToken=${NPM_TOKEN}
  always-auth=true
  ```

### 3) CI publish step (replace auto-commit)
Add to `.github/workflows/build-tokens.yml` after build:
```yaml
      - name: Configure npm auth
        run: |
          pnpm config set //registry.npmjs.org/:_authToken ${NODE_AUTH_TOKEN}
          pnpm config set always-auth true
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Publish package (npmjs)
        if: github.ref == 'refs/heads/main'
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: pnpm publish --access public
        # for private org packages: remove --access public
```
Notes:
- Permissions: `contents: write`, `packages: write`.
- Keep `paths: 'tokens/**'` so only token changes publish.
- Bump version before publishing; npm rejects duplicates.

### 4) Consumer install
- Public scoped: `npm install @veglez/design-tokens` (no auth required).
- Private scoped: add `.npmrc` with auth token, then install.
- Imports:
  - CSS vars: `import '@veglez/design-tokens/css';`
  - SCSS: `@use '@veglez/design-tokens/scss';`
  - Vanilla Extract: `import { tokens } from '@veglez/design-tokens/vanilla-extract';`
  - Flutter: include `build/flutter/tokens.dart` in the package or ship a Dart package.

### 5) Access control
- Public scoped: readable by anyone; publishing controlled by NPM_TOKEN.
- Private scoped: access follows npm org permissions; revoke by rotating/removing tokens.

### 6) Versioning & release flow
- `pnpm version patch|minor|major`
- Optional tag: `git tag v0.1.1 && git push --tags`
- CI publishes on main after version bump.

### 7) Troubleshooting
- 403 on publish: check NPM_TOKEN scopes and workflow permissions.
- 409/version exists: bump version.
- ERESOLVE/private: ensure `.npmrc` present when installing private packages.

## Option B: GitHub Packages (npm) (alternative)

### 1) Prerequisites
- GitHub org + repo.
- Scoped name, e.g. `@veglez/design-tokens`.
- `GITHUB_TOKEN` (Actions) or PAT with `write:packages`/`read:packages`.

### 2) Project setup
- Add `.npmrc` (publishing):
  ```
  //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
  @veglez:registry=https://npm.pkg.github.com
  always-auth=true
  ```
- Consumer `.npmrc` with PAT (do not commit secrets).

### 3) CI publish step
```yaml
      - name: Publish package (GHP)
        if: github.ref == 'refs/heads/main'
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm publish --registry https://npm.pkg.github.com
```
Notes similar to npmjs.

### 4) Consumer install
- Add `.npmrc` pointing to `https://npm.pkg.github.com` for the scope.
- Install and import same as npmjs.

## Option C: Verdaccio (self-hosted, quick)
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
1) Pick the registry (npmjs recommended; use private npm org if needed).
2) Add repo `.npmrc` for publishing only if you need private auth; public npmjs needs none.
3) Workflow is already set to npm publish—ensure `NPM_TOKEN` secret exists and version is bumped.
4) Add consumer `.npmrc` template to docs/README for private installs (omit secrets).
5) Test: bump version, push to main, run workflow, install from a clean project using a token if private.
