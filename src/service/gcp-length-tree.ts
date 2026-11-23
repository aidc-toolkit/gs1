import type { GCPLengthHeader } from "./gcp-length-data.js";

/**
 * Leaf of GS1 Company Prefix length tree.
 */
interface Leaf {
    /**
     * GS1 Company Prefix length.
     */
    readonly length: number;
}

/**
 * Branch of GS1 Company Prefix length tree.
 */
export interface Branch {
    /**
     * Child nodes.
     */
    readonly childNodes: ReadonlyArray<Node | undefined>;
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

/**
 * Interim branch of GS1 Company Prefix length tree with writeable child nodes.
 */
export interface InterimBranch {
    /**
     * Child nodes.
     */
    readonly childNodes: Array<InterimBranch | Leaf | undefined>;
}

/**
 * Root of GS1 Company Prefix length tree.
 */
export interface Root extends GCPLengthHeader, Branch {
}
