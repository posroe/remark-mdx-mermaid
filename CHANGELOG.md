# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-25 (release)

### Changed

- `useMermaid` hook returns `UseMermaidReturn` type instead of `UseMermaidOptions`

### Removed

- Theme variables transformation for dark mode

## [1.0.5] - 2026-04-24

### Changed

- Replaced `Mermaid` React component with `useMermaid` custom hook — consumers now build their own component using `svg`, `isLoading`, and `error` returned from the hook

### Removed

- `onRendered` callback prop (superseded by `isLoading` and `error` from the hook)
- `MermaidRendered` type definition

## [1.0.4] - 2026-04-24

### Added

- `MermaidRendered` type definition for `onRendered` callback prop

## [1.0.3] - 2026-04-24

### Fixed

- `onRendered` callback called with `isRendered` boolean on success, or with `isRendered: false` and `Error` on failure

## [1.0.2] - 2026-04-24

### Added

- `onRendered` callback prop on the `Mermaid` component — called with no arguments on success, or with an `Error` on failure

## [1.0.1] - 2026-04-24

### Fixed

- Fixed `warn: incorrect peer dependency` warning for `react` version to `"react": "^18 || ^19"`

## [1.0.0] - Initial Release

### Added

- Remark plugin that transforms fenced `mermaid` code blocks into `<Mermaid>` JSX elements
- React component (`remark-mdx-mermaid/react`) that renders Mermaid diagrams as inline SVGs
- Dark mode support via `[light, dark]` tuple in `themeVariables`
