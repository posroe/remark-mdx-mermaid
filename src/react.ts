import React from "react";
import mermaid, { type MermaidConfig } from "mermaid";

export interface UseMermaidProps {
    chart: string;
    config: MermaidConfig;
}

export interface UseMermaidReturn {
    isLoading: boolean;
    error?: Error;
    svg?: string;
}

let initialized = false;

export function useMermaid({ chart, config }: UseMermaidProps): UseMermaidReturn {
    const id = React.useId();
    const [svg, setSvg] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | undefined>(undefined);

    React.useEffect(() => {
        if (!initialized) {
            mermaid.initialize(config);
            initialized = true;
        }

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
    }, [id, chart]);

    return {
        svg,
        isLoading,
        error,
    }
}