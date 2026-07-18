# AGENTS.md — car-machine-effect

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Vite library build → `dist/index.{js,cjs,d.ts}` |
| `npm run test` | Vitest run (all) |
| `npm run test:watch` | Vitest watch mode |
| `npm run typecheck` | `tsc --noEmit` (separate from build) |
| `npm run storybook` | Storybook dev server on `:6006` |
| `npm run dev` | `vite build --watch` (re-build on change) |

Pre-commit order: `build && test` (enforced by `prepublishOnly`).

## Project structure

```
src/
├── index.ts              # Root barrel — re-exports everything
├── core/                 # Framework-agnostic: types, registry, utils
│   ├── types.ts          # Layer, CarTemplate
│   ├── registry.ts       # getTemplate, getAllTemplates, registerTemplate
│   └── utils.ts          # calcAspectRatio, validateTemplate
├── react/
│   ├── index.ts          # React barrel
│   ├── components/       # CarScreen, ScreenFrame, LayerStack
│   ├── hooks/            # useCarTemplate, useImageLoader
│   └── effects/          # ScreenEffectsContext, ScreenEffectsLayer, CarToolbar, presets
└── templates/            # 5 car templates (byd, nio, xpeng, li-auto, tesla)
                          # Side-effect: importing templates/index.ts auto-registers
test/                     # Flat test files, one per module
stories/                  # Storybook stories
```

## Key facts

- **Build**: Vite library mode, ESM + CJS dual output. React/ReactDOM are externalized peer deps.
- **Testing**: Vitest + jsdom + `@testing-library/react`. Setup in `test/setup.ts` imports `@testing-library/jest-dom/vitest`.
- **RTL cleanup**: Auto-cleanup is unreliable. Use explicit `afterEach(cleanup)` in every test file that renders components.
- **Typecheck**: `tsc --noEmit` (excludes `test/` and `stories/`). Run separately; not included in `build` or `test`.
- **Templates side-effect**: `import '../src/templates'` is needed in tests/stories to register templates into the registry.
- **Screen effects**: Pure CSS (`filter`, `transform`, radial-gradient overlays). No Canvas dependency.
- **Peer deps**: React ^16.8.0–^19.0.0. Dev dep is React 19.
- **Design authority**: `design.md` is the canonical design doc. Phase 2 (effects + toolbar) is fully implemented.

## Conventions

- No JSDoc or inline comments in source code.
- Inline styles throughout (no CSS modules or CSS-in-JS libs).
- `CarToolbar` uses `position: fixed`, so RTL queries must be specific enough to avoid cross-contamination between tests.
- Type exports from the React barrel use separate `export type` lines.
- **Major feature changes must update all three README files** (`README.md`, `README.en.md`, `README.zh-CN.md`) in the same change set. This includes API changes, new components, new props, or any user-facing additions.

## Gotchas

- Do NOT import from individual files under `src/react/effects/` in tests — import from the source barrel (`../src/react/effects`) or the component path for direct imports.
- The `@testing-library/react` `render` container attaches to `document.body`. `position: fixed` elements from the toolbar can survive cleanup without explicit `afterEach(cleanup)`.
- `tsc --noEmit` only checks `src/`. Test and story files are not typechecked.
