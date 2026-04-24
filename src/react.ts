import React from "react";
import mermaid, { type MermaidConfig } from "mermaid";

export interface UseMermaidProps {
    chart: string;
    config: MermaidConfig & {
        themeVariables: Record<string, [string, string] | string>;
    };
}

export interface UseMermaidReturn {
    isLoading: boolean;
    error?: Error;
    svg?: string;
}

export default function useMermaid({ chart, config }: UseMermaidProps): UseMermaidReturn {
    const id = React.useId();
    const [svg, setSvg] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | undefined>(undefined);

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
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, [id, chart, config.darkMode]);

    return {
        svg,
        isLoading,
        error,
    }
}