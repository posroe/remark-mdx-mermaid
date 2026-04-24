# remark-mdx-mermaid

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://www.gnu.org/licenses/mit)
[![npm version](https://badge.fury.io/js/remark-mdx-mermaid.svg)](https://www.npmjs.com/package/remark-mdx-mermaid)
[![npm download](https://img.shields.io/npm/dt/remark-mdx-mermaid)](https://www.npmjs.com/package/remark-mdx-mermaid)

A remark plugin for MDX that transforms fenced `mermaid` code blocks into `<Mermaid>` JSX elements, paired with a `useMermaid` React hook that handles rendering.

## Installation

```bash
npm install remark-mdx-mermaid
```

## Usage

### 1. Add the plugin to your MDX config

```js
// next.config.mjs
import remarkMermaid from "remark-mdx-mermaid";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkMermaid],
  },
});

export default withMDX(nextConfig);
```

### 2. Build a component with `useMermaid`

```tsx
import useMermaid from "remark-mdx-mermaid/react";

const config = {
  theme: "base",
  darkMode: false,
  themeVariables: {
    primaryColor: ["#e0f2fe", "#0f172a"],
  },
};

export default function Mermaid({ chart }: { chart: string }) {
  const { svg, isLoading, error } = useMermaid({ chart, config });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to render diagram</p>;

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

### 3. Register the component in your MDX provider

```tsx
// mdx-components.tsx
import Mermaid from "@/components/Mermaid";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Mermaid,
  };
}
```

### 4. Write diagrams in your MDX

````md
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action A]
    B -->|No| D[Action B]
```
````

## Dark Mode

`themeVariables` supports a `[light, dark]` tuple. When `config.darkMode` is `true`, the second value is used automatically.

```ts
themeVariables: {
  primaryColor: ["#dbeafe", "#1e3a5f"],  // [light, dark]
  lineColor: "#94a3b8",                  // same in both modes
}
```

## API

### `useMermaid({ chart, config })`

| Parameter | Type                                 | Description                                            |
| --------- | ------------------------------------ | ------------------------------------------------------ |
| `chart`   | `string`                             | Mermaid diagram definition string                      |
| `config`  | `MermaidConfig & { themeVariables }` | Mermaid config with optional dark mode tuple variables |

Returns:

| Property    | Type                 | Description                           |
| ----------- | -------------------- | ------------------------------------- |
| `svg`       | `string`             | Rendered SVG markup                   |
| `isLoading` | `boolean`            | `true` while rendering is in progress |
| `error`     | `Error \| undefined` | Set if rendering failed               |
