# AGENTS.md — car-machine-effect

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Vite library build → `dist/index.{js,cjs,d.ts}` |
| `npm run test` | Vitest run (all) |
| `npm run test:watch` | Vitest watch mode |
| `npm run typecheck` | `tsc --noEmit` (source only, excludes `test/` and `stories/`) |
| `npm run storybook` | Storybook dev server on `:6006` |
| `npm run build-storybook` | Static Storybook build |
| `npm run dev` | `vite build --watch` (re-build on change; **not** a dev server) |

Husky hooks: pre-commit → `typecheck`, pre-push → `test`, prepublishOnly → `build && test`.

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
└── templates/            # 5 side-effect modules (byd, nio, xpeng, li-auto, tesla)
                          # Importing templates/index.ts auto-registers via side-effect
test/                     # Flat test files, one per module
stories/                  # Storybook stories (CarScreen.stories.tsx, Effects.stories.tsx)
```

## Key facts

- **Build**: Vite library mode, ESM (`dist/index.js`) + CJS (`dist/index.cjs`) dual output. React/ReactDOM are externalized peer deps. Types emitted by `vite-plugin-dts`.
- **Vitest config**: Lives inside `vite.config.ts` (jsdom env, test setup at `test/setup.ts`). No separate vitest config file.
- **Testing**: Vitest + jsdom + `@testing-library/react`. RTL auto-cleanup is unreliable — use explicit `afterEach(cleanup)` in every test file that renders components.
- **Typecheck**: `tsc --noEmit` only checks `src/` (tsconfig `exclude: ["test", "stories"]`). Run separately; not part of `build` or `test`.
- **Templates side-effect**: `import '../src/templates'` is required in tests/stories to register templates into the registry before use.
- **Screen effects**: Pure CSS (`filter`, `transform`, `radial-gradient` overlays). No Canvas dependency.
- **Peer deps**: React ^16.8.0–^19.0.0. Dev dep is React 19.
- **Design authority**: `design.md` is the canonical design doc (but its architecture diagrams may show planned/unreleased files; always check the actual source tree).
- **CarScreen props**: Uses `showToolbar` (boolean), not `toolbar`. Also accepts `toolbarPosition`, `toolbarCollapsed`, `defaultEffects`. CarToolbar requires `ScreenEffectsProvider` ancestor.

## Conventions

- No JSDoc or inline comments in source code.
- Inline styles throughout (no CSS modules or CSS-in-JS libs).
- `CarToolbar` and its collapsed toggle button use `position: fixed` — RTL queries must be specific enough to avoid cross-contamination between tests; `position: fixed` elements can survive `cleanup()`.
- Type exports from React barrel use separate `export type` lines.
- **Major feature changes must update all three README files** (`README.md`, `README.en.md`, `README.zh-CN.md`) in the same change set.
- Import tests from source barrels (e.g. `'../src/react/effects'`) rather than deep imports into individual files.

## Gotchas

- `.npmrc` (contains npm publish token) is `.gitignore`d — do **not** commit it or expose the token.
- `npm test` (vitest) and `npm run build` (vite) each take ~5-10s. Prefer `npm run typecheck` for quick pre-commit validation.
- `design.md` references `bmw.ts` and `mercedes.ts` templates that do not yet exist in `src/templates/`.
- `Layer.src` now accepts `string | File`. When `src` is a `File`, `LayerStack` and `PhotoWall` internally call `URL.createObjectURL()`. Memory cleanup (`revokeObjectURL`) is not automatic for thumbnails in `PhotoWall`.
- `URL` mocks (`createObjectURL` / `revokeObjectURL`) must be set up in tests that render layers with `File` src or use `PhotoWall` — jsdom does not implement these.
- `PhotoWall` is the flagship end-user component. It internally uses `CarScreen` for the car preview. `CarScreen` is now a pure preview component with no built-in upload logic.
- `PhotoWall` accepts `(string | File)[]` for `files`. String items are URLs for echo/edit mode; File items are for new uploads. The `onChange` callback returns the same union type.
