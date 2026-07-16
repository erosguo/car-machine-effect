# Code Review Report

## Summary
- **Files reviewed**: 16 source files (232 lines), 7 test files (8.4KB), Storybook + README
- **Test count**: 24 tests, 0 failures
- **Build**: ESM + CJS + declarations, 13.4KB + 9.5KB

## Spec Compliance

| Plan Item | Status | Notes |
|-----------|--------|-------|
| A1-A3 Scaffolding | ✅ | package.json, tsconfig, vite, vitest |
| B1-B3 Core Logic | ✅ | types, utils, registry |
| C1-C4 Templates | ✅ | 5 templates (BYD, NIO, XPeng, Li, Tesla) |
| D1-D5 Components | ✅ | 2 hooks + 3 components |
| E1-E2 Entry Points | ✅ | Barrel exports clean |
| F1-F2 Tests | ✅ | 24 tests, all green |
| G1-G2 Storybook + README | ✅ | 6 stories, full README |
| H1 Build | ✅ | ESM + CJS + .d.ts |

## Issues Found

### Critical (blocking)
*None.*

### Major
*None.*

### Minor

1. **`theme` prop unused** (`src/react/components/CarScreen.tsx:9`)
   CarScreen accepts `theme` prop but never passes it to `ScreenFrame`. The frame always renders in dark style. Fix: either pass theme to ScreenFrame or remove the prop.

2. **Template names hardcoded in error message** (`src/react/components/CarScreen.tsx:44`)
   ```tsx
   byd-seal, nio-et5, xpeng-g9, li-l9, tesla-model-3
   ```
   Should import `templateNames` from `src/templates/index.ts` to stay in sync.

3. **`bezelImage` / `bezelCSS` in CarTemplate but ScreenFrame doesn't use them**
   These fields exist in the type definition and design doc but have no effect. Marked for v2 — acceptable for MVP.

4. **`useImageLoader` exported but not consumed internally**
   LayerStack uses its own inline error handling. The hook is available for consumers who need it, which is fine, but it's dead code internally.

5. **`useCallback` in LayerStack provides no benefit** (`src/react/components/LayerStack.tsx:13`)
   The `handleError` function returns a new closure on every call during render. The `useCallback` wrapper has no effect. Not a bug, just unnecessary.

## Test Coverage

| Suite | Tests | Coverage |
|-------|-------|----------|
| utils.test.ts | 7 | calcAspectRatio (3), validateTemplate (4) ✅ |
| registry.test.ts | 3 | register, get, getAll ✅ |
| useImageLoader.test.ts | 3 | loading, loaded, error ✅ |
| useCarTemplate.test.ts | 3 | string, unknown, object ✅ |
| ScreenFrame.test.tsx | 2 | children, width ✅ |
| LayerStack.test.tsx | 3 | count, alt, z-order ✅ |
| CarScreen.test.tsx | 3 | valid model, image, unknown ✅ |

**Missed edge cases**: duplicate zIndex sorting, `onLayerError` callback, `fallback` image on error.

## Verdict

**PASS** — No blocking issues. Code follows the plan, tests are green, build output is correct. The 5 minor issues are acceptable for MVP and can be addressed in the next iteration.
