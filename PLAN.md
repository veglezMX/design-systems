# Style Dictionary Repository - Implementation Plan

> **Reference Guide**: See `design-tokens-guide-2025.md` for detailed technical documentation.

## Overview

This plan covers the **Developer-Led workflow** for creating and transforming design tokens into multi-platform outputs (CSS, SCSS, Dart, TypeScript).

**Workflow**: Developer-Led (Direct JSON Editing)
**Scope**: Token creation, Style Dictionary configuration, and build automation
**Source of Truth**: `tokens/*.json` files edited directly in your code editor
**Output**: Platform-ready design tokens (CSS, SCSS, Flutter, Vanilla Extract)

> 💡 **Figma/Tokens Studio is optional.** This plan follows the Developer-Led workflow where you create and edit `tokens/*.json` files directly, commit to Git, build with Style Dictionary, and ship to production—**no Figma required**.

---

## Progress Overview

> ✅ **Tracking Progress**: Mark tasks as complete by changing `[ ]` to `[x]`. Update this section after completing each phase.

- [x] Phase 1: Repository Foundation ✅
- [x] Phase 2: Style Dictionary Configuration ✅
- [x] Phase 3: Multi-Platform Outputs ✅
- [ ] Phase 4: Theme Architecture
- [ ] Phase 5: CI/CD Build Automation
- [ ] Phase 6: Testing & Verification

**Last Updated**: November 28, 2025

---

## Phase 1: Repository Foundation

**Goal**: Set up Node.js project structure for Style Dictionary builds
**Time**: 15-20 minutes
**Prerequisites**: Node.js 22+, Git, pnpm/npm

### Environment Verification
- [x] Verify Node.js v22+ installed: `node -v`
- [x] Verify pnpm installed: `pnpm -v` (or npm)
- [x] Verify Git installed: `git --version`
- [x] Clone or initialize repository

### Project Initialization
- [x] Navigate to project directory: `cd design-systems`
- [x] Initialize package.json: `pnpm init` (if not exists)
- [x] Install Style Dictionary v5: `pnpm add style-dictionary@^5.1.0`
- [x] Install sd-transforms: `pnpm add @tokens-studio/sd-transforms@^2.0.0`
- [x] Verify installations: `pnpm list --depth=0`

### Directory Structure Setup
- [x] Create source directory: `mkdir -p tokens/primitives tokens/semantic tokens/themes`
- [x] Create build output directories: `mkdir -p build/css build/scss build/flutter build/vanilla-extract`
- [x] Create config directory: `mkdir -p src`
- [x] Create workflow directory: `mkdir -p .github/workflows`
- [x] Verify structure: `ls -la`

### Package.json Configuration
- [x] Add `"type": "module"` for ES modules support
- [x] Update `"name"`: `"@your-org/design-tokens"`
- [x] Set `"version"`: `"0.1.0"`
- [x] Add build script: `"build": "node src/style-dictionary.config.mjs"`
- [x] Add clean script: `"clean": "rm -rf build/*"`
- [x] Add rebuild script: `"rebuild": "pnpm clean && pnpm build"`
- [x] Add exports for platform outputs:
```json
{
  "exports": {
    "./css": "./build/css/variables.css",
    "./scss": "./build/scss/_variables.scss",
    "./flutter": "./build/flutter/tokens.dart",
    "./vanilla-extract": "./build/vanilla-extract/tokens.ts"
  }
}
```

### Git Configuration
- [x] Create/update .gitignore:
```
node_modules/
*.log
.DS_Store
.env
.idea/
.vscode/
```
- [x] Decide: Commit build/ folder? (Yes for consumption, No for cleaner repo)
- [x] Add to .gitignore if not committing: `build/`
- [x] Initial commit (if new): `git add . && git commit -m "chore: initialize style-dictionary repository"`

### Phase 1 Verification
- [x] Run `node -v` → v22.x.x or higher
- [x] Run `pnpm list --depth=0` → shows style-dictionary@5.x and sd-transforms@2.x
- [x] Verify package.json has `"type": "module"`
- [x] Verify folder structure exists: `ls tokens/ build/ src/`
- [x] Git status clean or ready for commit

> ✅ **Phase 1 Complete**: Repository foundation established.

---

## Phase 2: Style Dictionary Configuration

**Goal**: Configure Style Dictionary v5 with sd-transforms preprocessor
**Time**: 25-30 minutes
**Prerequisites**: Phase 1 complete, token JSON files exist in tokens/

### Token Files Requirement
This phase requires DTCG-formatted JSON files. If they don't exist, create them now:
- [x] Create `tokens/primitives/*.json` files (colors, spacing, typography, etc.)
- [x] Create `tokens/semantic/*.json` files (semantic mappings referencing primitives)
- [x] Use DTCG format with `$value`, `$type` syntax
- [x] Reference primitives from semantic tokens using `{path.to.token}` syntax

> 📝 **Developer-Led Workflow**: Edit JSON files directly in your code editor. See `design-tokens-guide-2025.md` for DTCG format examples and the three-tier token hierarchy (Primitives → Semantic → Component).

### Create Basic Configuration File
- [x] Create `src/style-dictionary.config.mjs`
- [x] Add ES module imports:
```javascript
import StyleDictionary from 'style-dictionary';
import { register, expandTypesMap } from '@tokens-studio/sd-transforms';
```
- [x] Register sd-transforms: `register(StyleDictionary);`
- [x] Verify no syntax errors

### Configure Source and Preprocessor
- [x] Define source paths: `source: ['tokens/**/*.json']`
- [x] Add preprocessor: `preprocessors: ['tokens-studio']`
- [x] Add expand configuration:
```javascript
expand: {
  typesMap: expandTypesMap,
}
```
- [x] Add comments explaining each setting

### Create CSS Platform Configuration
- [x] Add `platforms` object
- [x] Create `css` platform entry
- [x] Set transformGroup: `'tokens-studio'`
- [x] Add transforms: `['name/kebab']`
- [x] Set prefix: `'ds'` (or your brand prefix)
- [x] Set buildPath: `'build/css/'`
- [x] Define file output:
```javascript
files: [{
  destination: 'variables.css',
  format: 'css/variables',
  options: {
    outputReferences: true, // Preserves var() references
  },
}]
```

### Create Async Build Function
- [x] Create async `build()` function:
```javascript
async function build() {
  console.log('🎨 Building design tokens...\n');

  const sd = new StyleDictionary(config);
  await sd.hasInitialized;
  await sd.buildAllPlatforms();

  console.log('\n✅ Build complete!');
}
```
- [x] Add error handling: `build().catch(console.error);`
- [x] Save file

### Run First Build
- [x] Execute: `pnpm build`
- [x] Check for errors in console
- [x] Verify output message: "Building design tokens..."
- [x] Verify success message: "✅ Build complete!"
- [x] Check `build/css/` folder created

### Verify CSS Output
- [x] Open `build/css/variables.css`
- [x] Verify `:root` selector exists
- [x] Verify CSS custom properties format: `--ds-color-*`
- [x] Verify kebab-case naming: `--ds-color-primitive-blue-500`
- [x] Verify semantic tokens use `var()` references:
  - Example: `--ds-color-action-primary: var(--ds-color-primitive-blue-500);`
- [x] Verify "Do not edit directly" warning comment
- [x] Verify all expected tokens appear

### Phase 2 Verification Checklist
- [x] Config file uses `.mjs` extension
- [x] Config uses ES module syntax (`import`, not `require`)
- [x] Build function is `async` with `await`
- [x] Preprocessor `['tokens-studio']` is registered
- [x] Build command runs without errors
- [x] CSS file generated successfully
- [x] CSS contains both primitive and semantic tokens
- [x] Semantic tokens reference primitives via `var()`
- [x] Token names use kebab-case with prefix

> ✅ **Phase 2 Complete**: Style Dictionary configured and CSS building successfully.

---

## Phase 3: Multi-Platform Outputs

**Goal**: Generate SCSS, Flutter/Dart, and Vanilla Extract outputs
**Time**: 30-40 minutes
**Prerequisites**: Phase 2 complete, CSS building successfully

### Add SCSS Platform
- [x] Open `src/style-dictionary.config.mjs`
- [x] Add `scss` platform to `platforms` object
- [x] Configure SCSS platform:
```javascript
scss: {
  transformGroup: 'tokens-studio',
  transforms: ['name/kebab'],
  prefix: 'ds',
  buildPath: 'build/scss/',
  files: [{
    destination: '_variables.scss',
    format: 'scss/variables',
    options: {
      outputReferences: true,
    },
  }],
}
```
- [x] Save file

### Test SCSS Build
- [x] Run: `pnpm build`
- [x] Verify `build/scss/_variables.scss` created
- [x] Open `_variables.scss`
- [x] Verify SCSS variable syntax: `$ds-color-primitive-blue-500: #0066ff;`
- [x] Verify semantic references: `$ds-color-action-primary: $ds-color-primitive-blue-500;`
- [x] Confirm no build errors

### Create Flutter/Dart Custom Format
- [x] Before `config` object, register Flutter format:
```javascript
StyleDictionary.registerFormat({
  name: 'flutter/tokens',
  format: async ({ dictionary }) => {
    const tokens = dictionary.allTokens;

    // Filter by type
    const colors = tokens.filter(t =>
      t.$type === 'color' || t.type === 'color'
    );
    const spacing = tokens.filter(t =>
      t.$type === 'dimension' || t.type === 'spacing' || t.type === 'sizing'
    );

    // Helper: Convert to camelCase
    const toDartName = (name) => {
      return name
        .split(/[.\-]/)
        .map((part, i) =>
          i === 0
            ? part.toLowerCase()
            : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join('');
    };

    // Helper: Convert hex to Flutter Color
    const toFlutterColor = (value) => {
      if (typeof value !== 'string') return 'Color(0xFF000000)';
      const hex = value.replace('#', '');
      return `Color(0xFF${hex.toUpperCase().padStart(6, '0')})`;
    };

    // Build output
    let output = `// Do not edit directly, this file was auto-generated.
// ignore_for_file: constant_identifier_names

import 'package:flutter/material.dart';

abstract class DSTokens {
`;

    if (colors.length > 0) {
      output += '\n  // Colors\n';
      colors.forEach(token => {
        output += `  static const Color ${toDartName(token.name)} = ${toFlutterColor(token.value)};\n`;
      });
    }

    if (spacing.length > 0) {
      output += '\n  // Spacing\n';
      spacing.forEach(token => {
        output += `  static const double ${toDartName(token.name)} = ${parseFloat(token.value) || 0};\n`;
      });
    }

    output += '}\n';
    return output;
  },
});
```
- [x] Save file

### Add Flutter Platform Configuration
- [x] Add `flutter` platform:
```javascript
flutter: {
  transformGroup: 'tokens-studio',
  buildPath: 'build/flutter/',
  files: [{
    destination: 'tokens.dart',
    format: 'flutter/tokens',
  }],
}
```
- [x] Save file

### Test Flutter Build
- [x] Run: `pnpm build`
- [x] Verify `build/flutter/tokens.dart` created
- [x] Open `tokens.dart`
- [x] Verify Dart syntax: `static const Color colorPrimitiveBlue500 = Color(0xFF0066FF);`
- [x] Verify camelCase naming convention
- [x] Verify abstract class structure
- [x] Confirm proper Dart formatting

### Create Vanilla Extract Custom Format
- [x] Register Vanilla Extract format:
```javascript
StyleDictionary.registerFormat({
  name: 'vanilla-extract/tokens',
  format: async ({ dictionary }) => {
    // Helper: Build nested object from flat tokens
    const buildNestedObject = (tokens) => {
      const result = {};
      tokens.forEach(token => {
        const parts = token.name.split('.');
        let current = result;

        parts.forEach((part, index) => {
          if (index === parts.length - 1) {
            // Leaf node - assign value
            current[part] = token.value;
          } else {
            // Branch node - create object if doesn't exist
            current[part] = current[part] || {};
            current = current[part];
          }
        });
      });
      return result;
    };

    const nestedTokens = buildNestedObject(dictionary.allTokens);

    return `// Do not edit directly, this file was auto-generated.

export const tokens = ${JSON.stringify(nestedTokens, null, 2)} as const;

export type Tokens = typeof tokens;
`;
  },
});
```
- [x] Save file

### Add Vanilla Extract Platform
- [x] Add `vanilla-extract` platform:
```javascript
'vanilla-extract': {
  transformGroup: 'tokens-studio',
  buildPath: 'build/vanilla-extract/',
  files: [{
    destination: 'tokens.ts',
    format: 'vanilla-extract/tokens',
  }],
}
```
- [x] Save file

### Test Vanilla Extract Build
- [x] Run: `pnpm build`
- [x] Verify `build/vanilla-extract/tokens.ts` created
- [x] Open `tokens.ts`
- [x] Verify TypeScript export: `export const tokens = {...} as const;`
- [x] Verify nested object structure
- [x] Verify type export: `export type Tokens = typeof tokens;`
- [x] Confirm valid TypeScript syntax

### Complete Multi-Platform Build Test
- [x] Run full build: `pnpm rebuild`
- [x] Verify all four outputs created:
  - `build/css/variables.css`
  - `build/scss/_variables.scss`
  - `build/flutter/tokens.dart`
  - `build/vanilla-extract/tokens.ts`
- [x] Check console shows all platforms built
- [x] Verify no errors or warnings

### Phase 3 Verification Checklist
- [x] All four platforms configured
- [x] CSS builds successfully
- [x] SCSS builds with proper syntax
- [x] Dart builds with valid Flutter code
- [x] TypeScript builds with proper exports
- [x] All platforms use same source tokens
- [x] Build time reasonable (< 10 seconds)
- [x] No build warnings or errors

---

## Phase 4: Theme Architecture

**Goal**: Configure light/dark theme builds with selector strategies
**Time**: 25-30 minutes
**Prerequisites**: Phase 3 complete, theme JSON files exist

### Verify Theme Files Exist
- [ ] Check for `tokens/themes/light.json`
- [ ] Check for `tokens/themes/dark.json`
- [ ] Verify theme files contain semantic overrides
- [ ] Verify themes reference primitives (not hardcoded values)
- [ ] If themes don't exist: Create them directly in your code editor following DTCG format

### Restructure Configuration for Themes
- [ ] Open `src/style-dictionary.config.mjs`
- [ ] Create `baseConfig` object with shared settings:
```javascript
const baseConfig = {
  preprocessors: ['tokens-studio'],
  expand: {
    typesMap: expandTypesMap,
  },
};
```
- [ ] Save existing full config as `allPlatformsConfig`

### Create Light Theme Configuration
- [ ] Define `lightConfig`:
```javascript
const lightConfig = {
  ...baseConfig,
  source: [
    'tokens/primitives/**/*.json',
    'tokens/semantic/**/*.json',
    'tokens/themes/light.json',
  ],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      prefix: 'ds',
      buildPath: 'build/css/',
      files: [{
        destination: 'variables-light.css',
        format: 'css/variables',
        options: {
          outputReferences: true,
          selector: ':root, [data-theme="light"]',
        },
      }],
    },
  },
};
```
- [ ] Note the dual selector strategy (`:root` for default + `[data-theme="light"]`)

### Create Dark Theme Configuration
- [ ] Define `darkConfig`:
```javascript
const darkConfig = {
  ...baseConfig,
  source: [
    'tokens/primitives/**/*.json',
    'tokens/semantic/**/*.json',
    'tokens/themes/dark.json',
  ],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      prefix: 'ds',
      buildPath: 'build/css/',
      files: [{
        destination: 'variables-dark.css',
        format: 'css/variables',
        options: {
          outputReferences: true,
          selector: '[data-theme="dark"]',
        },
      }],
    },
  },
};
```
- [ ] Note the single selector for dark theme

### Update Build Function for Multiple Configs
- [ ] Modify `build()` function:
```javascript
async function build() {
  console.log('🎨 Building design tokens...\n');

  // Build base tokens (all platforms)
  console.log('📦 Building base tokens...');
  const sdBase = new StyleDictionary(allPlatformsConfig);
  await sdBase.hasInitialized;
  await sdBase.buildAllPlatforms();

  // Build light theme CSS
  console.log('☀️  Building light theme...');
  const sdLight = new StyleDictionary(lightConfig);
  await sdLight.hasInitialized;
  await sdLight.buildAllPlatforms();

  // Build dark theme CSS
  console.log('🌙 Building dark theme...');
  const sdDark = new StyleDictionary(darkConfig);
  await sdDark.hasInitialized;
  await sdDark.buildAllPlatforms();

  console.log('\n✅ Build complete!');
}
```
- [ ] Save file

### Test Theme Builds
- [ ] Run: `pnpm build`
- [ ] Verify console shows three build steps:
  - "Building base tokens..."
  - "Building light theme..."
  - "Building dark theme..."
- [ ] Check files created:
  - `build/css/variables.css` (base)
  - `build/css/variables-light.css`
  - `build/css/variables-dark.css`
- [ ] Verify no errors

### Verify Light Theme Output
- [ ] Open `build/css/variables-light.css`
- [ ] Verify selector: `:root, [data-theme="light"] { ... }`
- [ ] Verify background colors reference "light" values:
  - Example: `--ds-color-background-default: var(--ds-color-primitive-white);`
- [ ] Verify foreground uses dark gray
- [ ] Check all expected tokens present

### Verify Dark Theme Output
- [ ] Open `build/css/variables-dark.css`
- [ ] Verify selector: `[data-theme="dark"] { ... }`
- [ ] Verify background colors reference "dark" values:
  - Example: `--ds-color-background-default: var(--ds-color-primitive-gray-900);`
- [ ] Verify foreground uses white/light colors
- [ ] Compare with light theme - values should be inverted

### Test Theme Switching Strategy
- [ ] Create test HTML file (optional):
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="build/css/variables.css">
  <link rel="stylesheet" href="build/css/variables-light.css">
  <link rel="stylesheet" href="build/css/variables-dark.css">
  <style>
    body {
      background: var(--ds-color-background-default);
      color: var(--ds-color-foreground-default);
    }
  </style>
</head>
<body>
  <h1>Light Theme (default)</h1>
  <div data-theme="dark">
    <h1>Dark Theme</h1>
  </div>
</body>
</html>
```
- [ ] Open in browser and verify themes work
- [ ] Test toggling data-theme attribute

### Phase 4 Verification Checklist
- [ ] Three separate configs defined (base, light, dark)
- [ ] Build function builds all three sequentially
- [ ] variables-light.css created with correct selector
- [ ] variables-dark.css created with correct selector
- [ ] Light/dark values properly inverted
- [ ] Same token names used in both themes
- [ ] Theme switching works in browser test
- [ ] No build errors

---

## Phase 5: CI/CD Build Automation

**Goal**: Automate token builds with GitHub Actions
**Time**: 20-25 minutes
**Prerequisites**: GitHub repository, Phase 4 complete

### GitHub Repository Setup
- [ ] Verify repository exists on GitHub
- [ ] Verify you have push access
- [ ] Check repository URL: `git remote -v`
- [ ] If no remote: `git remote add origin <URL>`
- [ ] Push current code: `git push -u origin main`

### Create GitHub Actions Workflow
- [ ] Create `.github/workflows/build-tokens.yml`
- [ ] Add workflow header:
```yaml
name: Build Design Tokens

on:
  push:
    branches: [main]
    paths:
      - 'tokens/**'  # Only trigger on token file changes
  workflow_dispatch:  # Allow manual trigger
```

### Configure Build Job
- [ ] Add job configuration:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    permissions:
      contents: write  # Required for auto-commit
```

### Add Workflow Steps
- [ ] Add checkout step:
```yaml
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
```
- [ ] Add pnpm setup:
```yaml
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
```
- [ ] Add Node.js setup:
```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
```
- [ ] Add dependency installation:
```yaml
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
```
- [ ] Add build step:
```yaml
      - name: Build design tokens
        run: pnpm build
```
- [ ] Add auto-commit step:
```yaml
      - name: Commit build artifacts
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: '🤖 chore: rebuild design tokens'
          file_pattern: 'build/**'
          commit_user_name: 'github-actions[bot]'
          commit_user_email: 'github-actions[bot]@users.noreply.github.com'
```
- [ ] Save file

### Enable GitHub Workflow Permissions
- [ ] Go to GitHub repository
- [ ] Navigate to Settings → Actions → General
- [ ] Scroll to "Workflow permissions"
- [ ] Select "Read and write permissions"
- [ ] Enable "Allow GitHub Actions to create and approve pull requests"
- [ ] Click Save

### Commit and Push Workflow
- [ ] Stage workflow: `git add .github/workflows/build-tokens.yml`
- [ ] Commit: `git commit -m "ci: add GitHub Actions build workflow"`
- [ ] Push: `git push origin main`
- [ ] Go to GitHub Actions tab
- [ ] Verify workflow file appears in list

### Test Automation (Manual Trigger)
- [ ] In GitHub Actions tab, click on workflow
- [ ] Click "Run workflow" button
- [ ] Select branch: main
- [ ] Click "Run workflow"
- [ ] Wait for workflow to start
- [ ] Monitor workflow execution
- [ ] Verify all steps complete successfully (green checkmarks)
- [ ] Check for auto-commit in repository

### Verify Auto-Commit
- [ ] Go to repository Code tab
- [ ] Check recent commits
- [ ] Find "🤖 chore: rebuild design tokens" commit
- [ ] Verify commit author is "github-actions[bot]"
- [ ] Click commit to see changes
- [ ] Verify build/ files were updated

### Test Automation (Push Trigger)
- [ ] Make a small change to any token file (or simulate)
- [ ] Commit change: `git commit -am "test: trigger CI build"`
- [ ] Push: `git push origin main`
- [ ] Go to GitHub Actions tab
- [ ] Verify workflow triggered automatically
- [ ] Wait for completion
- [ ] Verify auto-commit appears

### Verify No Infinite Loop
- [ ] Check that workflow doesn't trigger on auto-commit
- [ ] Verify `paths: - 'tokens/**'` filter is working
- [ ] Confirm only ONE auto-commit per token change
- [ ] If infinite loop occurs: Check paths filter

### Phase 5 Verification Checklist
- [ ] Workflow file exists in `.github/workflows/`
- [ ] Workflow uses Node.js 22
- [ ] Workflow uses pnpm
- [ ] "Read and write permissions" enabled
- [ ] Manual trigger works
- [ ] Push to tokens/** triggers build
- [ ] Auto-commit completes successfully
- [ ] Build artifacts updated in auto-commit
- [ ] No infinite loop (workflow doesn't retrigger)
- [ ] Workflow badge green in Actions tab

---

## Phase 6: Testing & Verification

**Goal**: Complete end-to-end validation of build pipeline
**Time**: 15-20 minutes
**Prerequisites**: All previous phases complete

### Full Build Test (Local)
- [ ] Clean build directory: `pnpm clean`
- [ ] Verify build/ is empty: `ls build/`
- [ ] Run full build: `pnpm build`
- [ ] Verify all outputs created:
  - CSS: `build/css/variables.css`
  - CSS Light: `build/css/variables-light.css`
  - CSS Dark: `build/css/variables-dark.css`
  - SCSS: `build/scss/_variables.scss`
  - Dart: `build/flutter/tokens.dart`
  - TypeScript: `build/vanilla-extract/tokens.ts`
- [ ] Verify build time reasonable (< 15 seconds)
- [ ] Check no errors or warnings in console

### Token Transformation Verification
- [ ] Open any primitive token in source JSON
- [ ] Note the value (e.g., `"$value": "#0066ff"`)
- [ ] Find same token in CSS output
- [ ] Verify CSS custom property format: `--ds-color-primitive-blue-500: #0066ff;`
- [ ] Find a semantic token referencing it
- [ ] Verify reference preserved: `--ds-color-action-primary: var(--ds-color-primitive-blue-500);`

### Cross-Platform Consistency Check
- [ ] Pick a primitive color token (e.g., blue.500)
- [ ] Find it in CSS: `--ds-color-primitive-blue-500: #0066ff;`
- [ ] Find it in SCSS: `$ds-color-primitive-blue-500: #0066ff;`
- [ ] Find it in Dart: `static const Color colorPrimitiveBlue500 = Color(0xFF0066FF);`
- [ ] Find it in TypeScript: `"blue": { "500": "#0066ff" }`
- [ ] Verify same hex value across all platforms

### Theme Consistency Check
- [ ] Open `build/css/variables-light.css`
- [ ] Find `--ds-color-background-default` value
- [ ] Open `build/css/variables-dark.css`
- [ ] Find `--ds-color-background-default` value
- [ ] Verify values are different (inverted)
- [ ] Verify both use var() references to primitives
- [ ] Test a few more semantic tokens

### CI/CD Integration Test
- [ ] Make intentional token change (e.g., change a color value)
- [ ] Commit: `git commit -am "test: verify CI/CD integration"`
- [ ] Push: `git push origin main`
- [ ] Watch GitHub Actions workflow run
- [ ] Verify workflow completes successfully
- [ ] Wait for auto-commit
- [ ] Pull changes: `git pull origin main`
- [ ] Verify build/ files updated with new values
- [ ] Check changed token appears in all platform outputs

### Format Verification (DTCG)
- [ ] Open source token JSON file
- [ ] Verify `$value` property (not `value`)
- [ ] Verify `$type` property (not `type`)
- [ ] Run: `grep -r '"$value"' tokens/`
- [ ] Confirm results returned (DTCG format confirmed)
- [ ] If no results: DTCG format not used, check token source

### Documentation Check
- [ ] Verify README.md exists (create if needed)
- [ ] Verify CLAUDE.md references design-tokens-guide-2025.md
- [ ] Verify PLAN.md is complete (this file)
- [ ] Verify package.json metadata is accurate
- [ ] Check all file paths in docs are correct

### Repository Cleanup
- [ ] Review .gitignore completeness
- [ ] Remove any test/temporary files
- [ ] Verify no sensitive data committed
- [ ] Check no .env files in repository
- [ ] Verify pnpm-lock.yaml is committed
- [ ] Check repository size is reasonable

### Performance Benchmark
- [ ] Time a clean build: `time pnpm rebuild`
- [ ] Record build time: _________ seconds
- [ ] Acceptable range: < 15 seconds
- [ ] If slow: Check token file sizes, investigate bottlenecks

### Error Recovery Test
- [ ] Intentionally break a token reference (e.g., `{color.nonexistent}`)
- [ ] Run build: `pnpm build`
- [ ] Verify descriptive error message appears
- [ ] Verify build fails gracefully
- [ ] Fix the reference
- [ ] Verify build succeeds again

### Phase 6 Verification Checklist
- [ ] All platforms build successfully
- [ ] All themes build successfully
- [ ] Token transformations accurate
- [ ] Cross-platform values consistent
- [ ] CI/CD pipeline functional
- [ ] DTCG format verified in source
- [ ] Documentation complete
- [ ] Repository clean
- [ ] Build performance acceptable
- [ ] Error handling works

---

## 🎉 Completion Checklist

### Infrastructure
- [ ] Node.js 22+ environment verified
- [ ] Repository structure established
- [ ] Dependencies installed and locked
- [ ] ES modules configured
- [ ] Git repository initialized

### Configuration
- [ ] Style Dictionary v5 configured
- [ ] sd-transforms registered
- [ ] Preprocessor enabled
- [ ] All platforms configured (CSS, SCSS, Dart, TS)
- [ ] Theme architecture implemented

### Build Pipeline
- [ ] Local builds succeed
- [ ] All platforms generate correctly
- [ ] Themes generate correctly
- [ ] outputReferences preserved
- [ ] Build scripts functional

### Automation
- [ ] GitHub Actions workflow created
- [ ] Workflow permissions configured
- [ ] Auto-commit on token changes working
- [ ] No infinite loops
- [ ] Manual trigger working

### Quality
- [ ] End-to-end tested
- [ ] Cross-platform consistency verified
- [ ] Theme switching tested
- [ ] Error handling validated
- [ ] Documentation complete

---

## 🔑 Key Technical Requirements

### Critical Success Factors

**1. Node.js Version**
- ✅ Must be v22+ (Style Dictionary v5 requirement)
- ❌ v18, v20 will NOT work
- Verify: `node -v`

**2. ES Modules**
- ✅ `"type": "module"` in package.json
- ✅ Config file uses `.mjs` extension
- ✅ Use `import` syntax (not `require`)

**3. Async Build API**
- ✅ Build function must be `async`
- ✅ Must `await sd.hasInitialized`
- ✅ Must `await sd.buildAllPlatforms()`

**4. sd-transforms Preprocessor**
- ✅ Must register: `register(StyleDictionary)`
- ✅ Must include: `preprocessors: ['tokens-studio']`
- ✅ Must add: `expand: { typesMap: expandTypesMap }`

**5. Input Format (DTCG)**
- ✅ Source tokens must use `$value`, `$type`
- ❌ Legacy `value`, `type` won't work properly
- Verify: `grep -r '"$value"' tokens/`

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot use import statement" | Missing ES modules | Add `"type": "module"` to package.json |
| "Reference not found" | Missing preprocessor | Add `preprocessors: ['tokens-studio']` |
| "Node version" errors | Old Node.js | Upgrade to v22+ |
| Build outputs missing | Wrong buildPath | Check paths in platform configs |
| Infinite CI loop | Wrong paths filter | Ensure `paths: - 'tokens/**'` only |
| No var() references | outputReferences false | Set `outputReferences: true` |

---

## 📊 Build Output Reference

### Expected File Structure After Build

```
build/
├── css/
│   ├── variables.css              # Base tokens, all platforms
│   ├── variables-light.css        # Light theme overrides
│   └── variables-dark.css         # Dark theme overrides
├── scss/
│   └── _variables.scss            # SCSS variables
├── flutter/
│   └── tokens.dart                # Dart constants
└── vanilla-extract/
    └── tokens.ts                  # TypeScript tokens
```

### Sample Output Formats

**CSS:**
```css
:root {
  --ds-color-primitive-blue-500: #0066ff;
  --ds-color-action-primary: var(--ds-color-primitive-blue-500);
}
```

**SCSS:**
```scss
$ds-color-primitive-blue-500: #0066ff;
$ds-color-action-primary: $ds-color-primitive-blue-500;
```

**Dart:**
```dart
abstract class DSTokens {
  static const Color colorPrimitiveBlue500 = Color(0xFF0066FF);
  static const double spacingMd = 16;
}
```

**TypeScript:**
```typescript
export const tokens = {
  color: {
    primitive: {
      blue: { "500": "#0066ff" }
    }
  }
} as const;
```

---

## 📝 Notes

- **Time Investment**: ~2-3 hours total
- **Reference Guide**: See `design-tokens-guide-2025.md` for detailed explanations
- **Token Source**: Created and edited directly in `tokens/*.json` files (Developer-Led workflow)
- **DTCG Format**: Required for all source tokens (`$value`, `$type` syntax)
- **Updates**: Check boxes as you complete each item

**Implementation Date**: [Add date when starting]
**Completion Date**: [Add date when finished]
**Status**: [Not Started | In Progress | Phase X | Complete]

---

## 🔗 Related Workflows

This plan covers the **Developer-Led workflow** (token creation + Style Dictionary build pipeline).

**What this plan includes:**
1. **Token Creation**: Creating `tokens/*.json` files directly in your code editor
2. **Build Pipeline**: Style Dictionary configuration and automation
3. **Multi-Platform Output**: CSS, SCSS, Flutter, Vanilla Extract generation

**Related workflows** (optional, separate plans):
1. **Designer-Led Workflow**: Figma + Tokens Studio setup (see `design-tokens-guide-2025.md` Phase 2)
2. **Token Consumption**: How apps import and use the generated tokens
3. **Design QA**: Verifying design-code parity

**Current Focus**: Developer-Led token creation and build automation
