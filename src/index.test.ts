import { describe, it, expect } from "vitest";
import remarkMdxMermaid from "./index";
import type { Root, Code } from "mdast";

function makeTree(children: any[]): Root {
    return { type: "root", children };
}

function makeCodeNode(lang: string | null, value: string): Code {
    return { type: "code", lang, value, meta: null };
}

describe("remarkMdxMermaid plugin", () => {
    it("transforms a mermaid code block into a MdxJsxFlowElement", () => {
        const chart = "graph TD\n  A --> B";
        const tree = makeTree([makeCodeNode("mermaid", chart)]);

        remarkMdxMermaid()(tree);

        expect(tree.children).toHaveLength(1);
        const node = tree.children[0] as any;
        expect(node.type).toBe("mdxJsxFlowElement");
        expect(node.name).toBe("Mermaid");
        expect(node.children).toEqual([]);
    });

    it("sets the chart attribute to the code block value", () => {
        const chart = "sequenceDiagram\n  Alice ->> Bob: Hello";
        const tree = makeTree([makeCodeNode("mermaid", chart)]);

        remarkMdxMermaid()(tree);

        const node = tree.children[0] as any;
        const chartAttr = node.attributes.find((a: any) => a.name === "chart");
        expect(chartAttr).toBeDefined();
        expect(chartAttr.value).toBe(chart);
    });

    it("does NOT transform code blocks with a different language", () => {
        const tree = makeTree([makeCodeNode("javascript", "const x = 1;")]);

        remarkMdxMermaid()(tree);

        const node = tree.children[0] as any;
        expect(node.type).toBe("code");
    });

    it("does NOT transform code blocks with no language", () => {
        const tree = makeTree([makeCodeNode(null, "some plain code")]);

        remarkMdxMermaid()(tree);

        expect(tree.children[0].type).toBe("code");
    });

    it("transforms multiple mermaid blocks independently", () => {
        const chart1 = "graph LR\n  A --> B";
        const chart2 = "pie\n  title Pie\n  A: 60\n  B: 40";
        const tree = makeTree([
            makeCodeNode("mermaid", chart1),
            makeCodeNode("mermaid", chart2),
        ]);

        remarkMdxMermaid()(tree);

        expect(tree.children).toHaveLength(2);

        const [node1, node2] = tree.children as any[];
        expect(node1.type).toBe("mdxJsxFlowElement");
        expect(node1.attributes[0].value).toBe(chart1);

        expect(node2.type).toBe("mdxJsxFlowElement");
        expect(node2.attributes[0].value).toBe(chart2);
    });

    it("only transforms mermaid blocks and leaves other nodes untouched", () => {
        const tree = makeTree([
            makeCodeNode("javascript", "console.log('hi')"),
            makeCodeNode("mermaid", "graph TD\n  A --> B"),
            { type: "paragraph", children: [{ type: "text", value: "hello" }] },
        ]);

        remarkMdxMermaid()(tree);

        expect(tree.children[0].type).toBe("code");
        expect(tree.children[1].type).toBe("mdxJsxFlowElement");
        expect(tree.children[2].type).toBe("paragraph");
    });

    it("returns early and leaves the tree unchanged when there are no mermaid blocks", () => {
        const tree = makeTree([
            makeCodeNode("typescript", "const x: number = 1;"),
        ]);
        const originalChildren = [...tree.children];

        remarkMdxMermaid()(tree);

        expect(tree.children).toEqual(originalChildren);
    });

    it("handles an empty mermaid code block value", () => {
        const tree = makeTree([makeCodeNode("mermaid", "")]);

        remarkMdxMermaid()(tree);

        const node = tree.children[0] as any;
        expect(node.type).toBe("mdxJsxFlowElement");
        expect(node.attributes[0].value).toBe("");
    });

    it("preserves surrounding nodes order when replacing a mermaid block", () => {
        const tree = makeTree([
            { type: "paragraph", children: [{ type: "text", value: "before" }] },
            makeCodeNode("mermaid", "graph TD\n  A --> B"),
            { type: "paragraph", children: [{ type: "text", value: "after" }] },
        ]);

        remarkMdxMermaid()(tree);

        expect(tree.children[0].type).toBe("paragraph");
        expect(tree.children[1].type).toBe("mdxJsxFlowElement");
        expect(tree.children[2].type).toBe("paragraph");
    });
});