import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMermaid } from "./react";

vi.mock("mermaid", () => ({
    default: {
        initialize: vi.fn(),
        render: vi.fn(),
    },
}));

import mermaid from "mermaid";
const mockMermaid = mermaid as unknown as {
    initialize: ReturnType<typeof vi.fn>;
    render: ReturnType<typeof vi.fn>;
};

const defaultConfig = { theme: "default" as const };

beforeEach(() => {
    vi.clearAllMocks();
    mockMermaid.initialize.mockReset();
    mockMermaid.render.mockReset();
});

describe("useMermaid hook", () => {
    it("starts in loading state", () => {
        mockMermaid.render.mockReturnValue(new Promise(() => { })); // never resolves

        const { result } = renderHook(() =>
            useMermaid({ chart: "graph TD\n  A --> B", config: defaultConfig })
        );

        expect(result.current.isLoading).toBe(true);
        expect(result.current.svg).toBe("");
        expect(result.current.error).toBeUndefined();
    });

    it("sets svg and stops loading on successful render", async () => {
        const svgOutput = "<svg>mocked</svg>";
        mockMermaid.render.mockResolvedValue({ svg: svgOutput });

        const { result } = renderHook(() =>
            useMermaid({ chart: "graph TD\n  A --> B", config: defaultConfig })
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.svg).toBe(svgOutput);
        expect(result.current.error).toBeUndefined();
    });

    it("sets error and stops loading when render rejects", async () => {
        const err = new Error("invalid mermaid syntax");
        mockMermaid.render.mockRejectedValue(err);

        const { result } = renderHook(() =>
            useMermaid({ chart: "invalid!!!", config: defaultConfig })
        );

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.error).toBe(err);
        expect(result.current.svg).toBe("");
    });

    it("calls mermaid.render with the chart value", async () => {
        const chart = "sequenceDiagram\n  Alice->>Bob: Hello";
        mockMermaid.render.mockResolvedValue({ svg: "<svg />" });

        renderHook(() => useMermaid({ chart, config: defaultConfig }));

        await waitFor(() => {
            expect(mockMermaid.render).toHaveBeenCalledWith(
                expect.any(String),
                chart
            );
        });
    });

    it("passes a valid HTML-id-safe string as the render id", async () => {
        mockMermaid.render.mockResolvedValue({ svg: "<svg />" });

        renderHook(() =>
            useMermaid({ chart: "graph TD\n  A --> B", config: defaultConfig })
        );

        await waitFor(() => expect(mockMermaid.render).toHaveBeenCalled());

        const [renderId] = mockMermaid.render.mock.calls[0];

        expect(renderId).toMatch(/^[a-zA-Z]+$/);
    });

    it("re-renders and calls mermaid.render again when chart changes", async () => {
        mockMermaid.render.mockResolvedValue({ svg: "<svg />" });

        const { rerender } = renderHook(
            ({ chart }) => useMermaid({ chart, config: defaultConfig }),
            { initialProps: { chart: "graph TD\n  A --> B" } }
        );

        await waitFor(() => expect(mockMermaid.render).toHaveBeenCalledTimes(1));

        rerender({ chart: "graph LR\n  X --> Y" });

        await waitFor(() => expect(mockMermaid.render).toHaveBeenCalledTimes(2));
        expect(mockMermaid.render.mock.calls[1][1]).toBe("graph LR\n  X --> Y");
    });
});