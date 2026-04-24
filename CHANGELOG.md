# CHANGELOG

## [1.0.4] - 2026-04-24

### Added

- Add MermaidRendered type definition for `onRendered` callback prop on the `Mermaid` component

## [1.0.3] - 2026-04-24

### Fixed

- `onRendered` callback prop on the `Mermaid` component — called with `isRendered` boolean on success, or with `isRendered: false` and `Error` on failure

## [1.0.2] - 2026-04-24

### Added

- `onRendered` callback prop on the `Mermaid` component — called with no arguments on success, or with an Error on failure

## [1.0.1] - 2026-04-24

### Fixed

- Fixed the `warn: incorrect peer dependency` warning for `react` version to `"react": "^18 || ^19"` instead of `"react": "^19.2.5"`

## [1.0.0] -Initial Release

### Added

- Remark plugin that transforms fenced `mermaid` code blocks into `<Mermaid>` JSX elements
- React component (`remark-mdx-mermaid/react`) that renders Mermaid diagrams as inline SVGs
- Dark mode support via `[light, dark]` tuple in `themeVariables`
