import type { GCPLengthHeader } from "./gcp-length-data.js";

/**
 * Leaf of GS1 Company Prefix length tree.
 */
export interface Leaf {
    readonly length: number;
}

/**
 * Branch of GS1 Company Prefix length tree.
 */
export interface Branch {
    readonly childNodes: ReadonlyArray<Node | undefined>;
}

/**
 * Root of GS1 Company Prefix length tree.
 */
export interface Root extends GCPLengthHeader, Branch {
}

/**
 * Node in GS1 Company Prefix length tree.
 */
export type Node = Branch | Leaf;

/**
 * Determine if a node is a leaf.
 *
 * @param node
 * Node.
 *
 * @returns
 * True if node is a leaf.
 */
export function isLeaf(node: Node): node is Leaf {
    return "length" in node;
}
