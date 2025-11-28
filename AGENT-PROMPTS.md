# Agent-Ready Prompts for Style Dictionary Implementation

> **Usage**: Copy each prompt when you're ready to execute that phase. Start with Batch 1 and proceed sequentially.

---

## 📦 Batch 1: Repository Foundation

```
Complete Phase 1 from PLAN.md: Repository Foundation.

Your task:
1. Verify environment prerequisites (Node.js 22+, pnpm, Git)
2. Initialize the Node.js project with proper package.json configuration
3. Install Style Dictionary v5 and sd-transforms dependencies
4. Create the complete directory structure (tokens/, build/, src/, .github/)
5. Configure package.json with ES modules and build scripts
6. Set up .gitignore and make initial Git commit

Requirements:
- Use pnpm (or npm if pnpm not available)
- Ensure "type": "module" in package.json
- Create all directories as specified in the plan
- Verify installations with pnpm list --depth=0

Complete ALL checkboxes in Phase 1, then provide:
- Summary of what was created/configured
- Verification checklist results
- Any issues encountered
- Confirmation that Phase 1 is complete and ready for Phase 2
```

---

## ⚙️ Batch 2: Style Dictionary Configuration

**Prerequisites**: Phase 1 must be complete

```
Complete Phase 2 from PLAN.md: Style Dictionary Configuration.

Your task:
1. Verify DTCG-formatted token JSON files exist in tokens/ directory
   - If they don't exist: Create minimal sample files for testing
2. Create src/style-dictionary.config.mjs with proper ES module syntax
3. Register sd-transforms preprocessor
4. Configure CSS platform with outputReferences: true
5. Implement async build() function
6. Run first build and verify CSS output

Requirements:
- Use ES module imports (import, not require)
- Must include: preprocessors: ['tokens-studio']
- Must include: expand: { typesMap: expandTypesMap }
- CSS output must use kebab-case with --ds- prefix
- Semantic tokens must reference primitives via var()

Complete ALL checkboxes in Phase 2, then provide:
- Content of src/style-dictionary.config.mjs
- Build output log
- Sample lines from build/css/variables.css showing primitives and semantics
- Verification checklist results
- Confirmation ready for Phase 3
```

---

## 🎨 Batch 3: Multi-Platform Outputs

**Prerequisites**: Phase 2 must be complete (CSS building successfully)

```
Complete Phase 3 from PLAN.md: Multi-Platform Outputs.

Your task:
1. Add SCSS platform configuration and verify output
2. Create custom Flutter/Dart format and platform configuration
3. Create custom Vanilla Extract format and platform configuration
4. Test full multi-platform build

Requirements:
- SCSS: Use scss/variables format with $ prefix
- Flutter: Generate abstract class DSTokens with Color and double constants
- Flutter: Use camelCase naming (colorPrimitiveBlue500)
- Vanilla Extract: Generate nested TypeScript object with type export
- All platforms must build from same source tokens
- All custom formats registered before config object

Complete ALL checkboxes in Phase 3, then provide:
- Updated config showing all 4 platforms
- Sample output from each platform (CSS, SCSS, Dart, TS)
- Build output showing all platforms compiled
- Verification that same token values appear across all platforms
- Confirmation ready for Phase 4

Optional: If this phase feels too large, you can split it:
- Part 3A: SCSS platform only
- Part 3B: Flutter platform only
- Part 3C: Vanilla Extract platform + full test
```

---

## 🌓 Batch 4: Theme Architecture

**Prerequisites**: Phase 3 must be complete (all 4 platforms building)

```
Complete Phase 4 from PLAN.md: Theme Architecture.

Your task:
1. Verify theme JSON files exist (tokens/themes/light.json and dark.json)
   - If they don't exist: Create minimal sample theme files
2. Restructure configuration to support multiple builds
3. Create baseConfig, lightConfig, darkConfig, and allPlatformsConfig
4. Update build() function to build all three configurations
5. Test theme builds and verify selector strategies
6. (Optional) Create HTML test file to verify theme switching

Requirements:
- Light theme selector: :root, [data-theme="light"]
- Dark theme selector: [data-theme="dark"]
- Themes must override semantic tokens only (not primitives)
- Build must generate 3 CSS files: variables.css, variables-light.css, variables-dark.css
- Theme values must be inverted (light background → dark, vice versa)

Complete ALL checkboxes in Phase 4, then provide:
- Updated build() function showing three separate builds
- Selector output from variables-light.css
- Selector output from variables-dark.css
- Comparison showing inverted values (e.g., background-default)
- Verification checklist results
- Confirmation ready for Phase 5
```

---

## 🤖 Batch 5: CI/CD Build Automation

**Prerequisites**: Phase 4 must be complete (themes building locally)

```
Complete Phase 5 from PLAN.md: CI/CD Build Automation.

Your task:
1. Verify GitHub repository exists and is accessible
2. Create .github/workflows/build-tokens.yml with proper configuration
3. Configure workflow to trigger on tokens/** changes only
4. Set up Node.js 22, pnpm, and build steps
5. Add auto-commit step for build artifacts
6. Commit and push workflow to GitHub
7. Test workflow with manual trigger
8. Verify auto-commit appears
9. Test workflow with token change trigger
10. Confirm no infinite loops

Requirements:
- Workflow must use Node.js 22
- Workflow must use pnpm (with caching)
- Must install with --frozen-lockfile
- Paths filter: - 'tokens/**' only
- Auto-commit must use stefanzweifel/git-auto-commit-action@v5
- File pattern for commit: 'build/**'

IMPORTANT: Before running, instruct me to:
- Enable "Read and write permissions" in GitHub Settings → Actions → General

Complete ALL checkboxes in Phase 5, then provide:
- Complete .github/workflows/build-tokens.yml content
- GitHub Actions run URL (after manual trigger)
- Screenshot or log showing successful workflow completion
- Confirmation that auto-commit appeared
- Verification that second run didn't create infinite loop
- Confirmation ready for Phase 6
```

---

## ✅ Batch 6: Testing & Verification

**Prerequisites**: Phase 5 must be complete (CI/CD working)

```
Complete Phase 6 from PLAN.md: Testing & Verification.

Your task:
1. Run full local build test (clean → rebuild)
2. Verify all 6 output files created
3. Test token transformation accuracy (source JSON → platforms)
4. Test cross-platform consistency (same value across CSS/SCSS/Dart/TS)
5. Test theme consistency (light vs dark values)
6. Test CI/CD integration with intentional token change
7. Verify DTCG format in source files
8. Review and update documentation (README, CLAUDE.md)
9. Clean up repository (remove test files, verify .gitignore)
10. Run performance benchmark
11. Test error recovery (intentional broken reference)

Requirements:
- All 6 outputs must exist: CSS, CSS-light, CSS-dark, SCSS, Dart, TS
- Build time must be < 15 seconds
- Token values must match across all platforms
- DTCG format verified: grep -r '"$value"' tokens/ returns results
- CI/CD must complete successfully with real token change
- Error handling must fail gracefully with descriptive messages

Complete ALL checkboxes in Phase 6, then provide:
- Build time measurement
- Cross-platform consistency verification (pick 3 tokens, show in all formats)
- Theme comparison (show 3 semantic tokens in light vs dark)
- CI/CD test results (workflow run URL)
- DTCG format verification output
- Final verification checklist results
- 🎉 COMPLETION CONFIRMATION with summary of entire implementation
```

---

## 🔄 Alternative: Split Batch 3 (If Needed)

If Batch 3 feels too large, use these instead:

### Batch 3A: SCSS Platform

```
Complete Phase 3 (Part 1) from PLAN.md: Add SCSS Platform.

Your task:
1. Add SCSS platform to existing config
2. Test SCSS build
3. Verify SCSS variable syntax and references

Stop after confirming build/scss/_variables.scss exists and is correct.

Provide verification then wait for instruction to proceed to Part 2.
```

### Batch 3B: Flutter Platform

```
Complete Phase 3 (Part 2) from PLAN.md: Add Flutter/Dart Platform.

Your task:
1. Create Flutter custom format
2. Add Flutter platform configuration
3. Test Flutter build
4. Verify Dart syntax and naming conventions

Stop after confirming build/flutter/tokens.dart exists and is correct.

Provide verification then wait for instruction to proceed to Part 3.
```

### Batch 3C: Vanilla Extract + Complete Test

```
Complete Phase 3 (Part 3) from PLAN.md: Add Vanilla Extract Platform and Final Testing.

Your task:
1. Create Vanilla Extract custom format
2. Add Vanilla Extract platform configuration
3. Test Vanilla Extract build
4. Run complete multi-platform build test
5. Complete Phase 3 verification checklist

Provide full verification that all 4 platforms build successfully.
```

---

## 📋 Execution Checklist

Track your progress through the batches:

- [ ] **Batch 1**: Repository Foundation ✓
- [ ] **Batch 2**: Style Dictionary Configuration ✓
- [ ] **Batch 3**: Multi-Platform Outputs ✓
  - [ ] (Optional) 3A: SCSS
  - [ ] (Optional) 3B: Flutter
  - [ ] (Optional) 3C: Vanilla Extract
- [ ] **Batch 4**: Theme Architecture ✓
- [ ] **Batch 5**: CI/CD Automation ✓
- [ ] **Batch 6**: Testing & Verification ✓

---

## 💡 Tips for Using These Prompts

### Before Starting Each Batch:

1. **Review the phase** in PLAN.md to understand what's coming
2. **Check prerequisites** are met from previous batches
3. **Copy the prompt** exactly as written
4. **Paste into your AI agent** (Claude, GPT, etc.)
5. **Let the agent complete** the entire phase
6. **Review verification results** before proceeding

### If Agent Gets Stuck:

- **Ask for status**: "What checkpoint are you at in Phase X?"
- **Request verification**: "Run the verification checklist for this phase"
- **Narrow scope**: Use the split prompts for Phase 3 if needed
- **Review outputs**: "Show me the current build/css/variables.css file"

### After Each Batch:

- [ ] Review the verification checklist the agent provides
- [ ] Test the build manually: `pnpm build`
- [ ] Check Git status: `git status`
- [ ] Commit if satisfied: `git commit -m "Complete Phase X"`
- [ ] Proceed to next batch

---

## 🎯 Expected Timeline

| Batch | Time | Cumulative |
|-------|------|------------|
| Batch 1 | 15-20 min | ~20 min |
| Batch 2 | 25-30 min | ~50 min |
| Batch 3 | 30-40 min | ~1h 30m |
| Batch 4 | 25-30 min | ~2h |
| Batch 5 | 20-25 min | ~2h 25m |
| Batch 6 | 15-20 min | ~2h 45m |

**Total**: Approximately 2-3 hours for complete implementation

---

## 🚀 Quick Start

**To begin implementation right now:**

1. Ensure you're in the design-systems directory
2. Copy "Batch 1: Repository Foundation" prompt above
3. Paste into your AI agent
4. Execute and review results
5. When Batch 1 is verified complete, proceed to Batch 2

**First prompt to use:**
```
Complete Phase 1 from PLAN.md: Repository Foundation.

Your task:
1. Verify environment prerequisites (Node.js 22+, pnpm, Git)
2. Initialize the Node.js project with proper package.json configuration
[... rest of Batch 1 prompt ...]
```

Good luck! 🎉
