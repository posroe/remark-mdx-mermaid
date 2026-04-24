"use client"

import React from "react";
import mermaid, { type MermaidConfig } from "mermaid";
import { jsx } from "react/jsx-runtime";

export interface MermaidProps {
    chart: string;
    config: MermaidConfig & {
        themeVariables: Record<string, [string, string] | string>;
    };
    onRendered?: (isRendered: boolean, error?: Error) => void;
}

export default function Mermaid({ chart, config, onRendered }: MermaidProps): React.ReactNode {
    const id = React.useId();
    const [svg, setSvg] = React.useState("");

    React.useEffect(() => {
        mermaid.initialize({
            ...config,
            themeVariables: {
                ...Object.fromEntries(
                    Object.entries(config.themeVariables).map(([key, value]) => {
                        if (Array.isArray(value)) {
                            const [light, dark] = value;
                            return [key, config.darkMode ? dark : light];
                        }
                        return [key, value];
                    })
                )
            }
        });
        mermaid
            .render(
                id.replace(/[^a-zA-Z]+/g, ""),
                `${chart}`
            )
            .then(({ svg }) => {
                setSvg(svg);
                onRendered?.(true);
            })
            .catch((error) => {
                onRendered?.(false, error);
            });
    }, [id, chart, config.darkMode]);

    return jsx("div", {
        className: "flex justify-center",
        dangerouslySetInnerHTML: { __html: svg }
    });
}