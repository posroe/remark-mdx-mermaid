import { visit } from "unist-util-visit";
import type { Root, Code } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx";

export default () => (tree: Root) => {
    const nodes: Array<{ node: Code; index: number; parent: any }> = [];

    visit(tree, "code", (node, index, parent) => {
        if (node.lang === "mermaid" && index !== undefined && parent) {
            nodes.push({ node, index, parent });
        }
    });

    if (nodes.length === 0) return;

    for (const { node, index, parent } of nodes) {
        const jsxNode: MdxJsxFlowElement = {
            type: "mdxJsxFlowElement",
            name: "Mermaid",
            attributes: [
                {
                    type: "mdxJsxAttribute",
                    name: "chart",
                    value: node.value,
                },
            ],
            children: [],
        };

        parent.children.splice(index, 1, jsxNode);
    }
};