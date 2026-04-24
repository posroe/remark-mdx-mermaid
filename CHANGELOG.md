# CHANGELOG

## 0.0.1

### Fixed

- Fixed the `warn: incorrect peer dependency` warning for `react` version to `"react": "^18 || ^19"` instead of `"react": "^19.2.5"`

## [1.0.0] -Initial Release

### Added

- Remark plugin that transforms fenced `mermaid` code blocks into `<Mermaid>` JSX elements
- React component (`remark-mdx-mermaid/react`) that renders Mermaid diagrams as inline SVGs
- Dark mode support via `[light, dark]` tuple in `themeVariables`
