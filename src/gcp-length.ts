import type { GCPLengthCache } from "./gcp-length-cache.js";
import { GTINLengths } from "./gtin-length.js";
import { GTINValidator } from "./gtin-validator.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import { IdentifierValidators, isNumericIdentifierValidator } from "./identifier-validators.js";
import { LeaderTypes } from "./leader-type.js";

/**
 * GS1 Company Prefix length JSON source file format.
 */
interface GCPLengthJSON {
    /**
     * Disclaimer.
     */
    _disclaimer: string[];

    /**
     * Format list.
     */
    GCPPrefixFormatList: {
        /**
         * ISO data/time the table was last updated.
         */
        date: string;

        /**
         * Entries.
         */
        entry: Array<{
            /**
             * Identification key prefix start.
             */
            prefix: string;

            /**
             * Length of GS1 Company Prefix.
             */
            gcpLength: number;
        }>;
    };
}

/**
 * Leaf of GS1 Company Prefix length tree.
 */
export interface Leaf {
    length: number;
}

/**
 * Branch of GS1 Company Prefix length tree.
 */
export interface Branch {
    childNodes: Array<Node | undefined>;
}

/**
 * Root of GS1 Company Prefix length tree.
 */
export interface Root extends Branch {
    dateTime: Date;
}

/**
 * Node in GS1 Company Prefix length tree.
 */
export type Node = Root | Branch | Leaf;

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
 * Entry in binary data to indicate that child node is undefined.
 */
const BINARY_UNDEFINED = 0x0F;

/**
 * Entry in binary data to indicate that child node is a branch.
 */
const BINARY_BRANCH = 0x0E;

/**
 * Build the GS1 Company Prefix length tree from a binary data array.
 *
 * @param binaryData
 * Binary data array.
 *
 * @param childNodes
 * Child nodes array to fill.
 *
 * @param startIndex
 * Start index into binary data array.
 *
 * @returns
 * End index into binary data array.
 */
function fromBinary(binaryData: Uint8Array, childNodes: Array<Node | undefined>, startIndex: number): number {
    let endIndex = startIndex;

    const decompressedLengths = new Array<number>(10);

    // Decompress lengths for the child nodes.
    for (let childNodeIndex = 0; childNodeIndex < 10; childNodeIndex += 2) {
        const byte = binaryData[endIndex++];

        decompressedLengths[childNodeIndex] = byte >> 4;
        decompressedLengths[childNodeIndex + 1] = byte & 0x0F;
    }

    for (let childNodeIndex = 0; childNodeIndex < 10; childNodeIndex++) {
        const length = decompressedLengths[childNodeIndex];

        if (length !== BINARY_UNDEFINED) {
            let childNode: Node;

            if (length === BINARY_BRANCH) {
                childNode = {
                    childNodes: []
                };

                endIndex = fromBinary(binaryData, childNode.childNodes, endIndex);
            } else {
                childNode = {
                    length
                };
            }

            // eslint-disable-next-line no-param-reassign -- Purpose is to build tree.
            childNodes[childNodeIndex] = childNode;
        }
    }

    return endIndex;
}

/**
 * Add an entry to the tree by recursively walking the tree to a leaf.
 *
 * @param branch
 * Current branch.
 *
 * @param prefix
 * Remainder of current prefix.
 *
 * @param length
 * Current prefix length.
 *
 * @returns
 * Number of branches added; used to determine size of binary array.
 */
function addEntry(branch: Branch, prefix: string, length: number): number {
    const digit = Number(prefix.charAt(0));

    const existingChildNode = branch.childNodes[digit];

    let branchesAdded = 0;

    if (prefix.length !== 1) {
        let childBranch: Branch;

        if (existingChildNode === undefined) {
            childBranch = {
                childNodes: []
            };

            branchesAdded++;
        } else {
            if (isLeaf(existingChildNode)) {
                // File format error or application bug; localization not necessary.
                throw new Error("Overlapping entry");
            }

            childBranch = existingChildNode;
        }

        // eslint-disable-next-line no-param-reassign -- Purpose is to build tree.
        branch.childNodes[digit] = childBranch;

        // Continue with remainder of prefix.
        branchesAdded += addEntry(childBranch, prefix.substring(1), length);
    } else {
        if (existingChildNode !== undefined) {
            // File format error or application bug; localization not necessary.
            throw new Error("Duplicate entry");
        }

        // eslint-disable-next-line no-param-reassign -- Purpose is to build tree.
        branch.childNodes[digit] = {
            length
        };
    }

    return branchesAdded;
}

/**
 * Get the length of a child node if defined and it's a leaf, otherwise mark it with 0x0E if defined (branch) or 0x0F
 * (no branch) if not.
 *
 * @param childNode
 * Child node.
 *
 * @returns
 * Child node length, 0x0E (branch), or 0x0F (undefined).
 */
function childNodeValue(childNode: Node | undefined): number {
    return childNode !== undefined ? isLeaf(childNode) ? childNode.length : BINARY_BRANCH : BINARY_UNDEFINED;
}

/**
 * Add a branch to a binary data array.
 *
 * @param binaryData
 * Binary data array.
 *
 * @param branch
 * Branch.
 *
 * @param startIndex
 * Start index into binary data array.
 *
 * @returns
 * End index into binary data array.
 */
function toBinary(binaryData: Uint8Array, branch: Branch, startIndex: number): number {
    let endIndex = startIndex;

    const childNodes = branch.childNodes;

    // Add length or non-leaf indicators, compressing 10 nibbles into 5 bytes.
    for (let childNodeIndex = 0; childNodeIndex < 10; childNodeIndex += 2) {
        // eslint-disable-next-line no-param-reassign -- Purpose is to build array.
        binaryData[endIndex++] = (childNodeValue(childNodes[childNodeIndex]) << 4) | childNodeValue(childNodes[childNodeIndex + 1]);
    }

    // Process child nodes.
    for (const childNode of childNodes) {
        if (childNode !== undefined && !isLeaf(childNode)) {
            endIndex = toBinary(binaryData, childNode, endIndex);
        }
    }

    return endIndex;
}

/**
 * Add days to a date.
 *
 * @param date
 * Date.
 *
 * @param days
 * Days.
 *
 * @returns
 * New date.
 */
function addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/**
 * Load the GS1 Company Prefix length data.
 *
 * @param gcpLengthCache
 * GS1 Company Prefix length cache.
 *
 * @returns
 * Root of tree.
 */
export async function loadData(gcpLengthCache: GCPLengthCache): Promise<Root> {
    let root: Root | undefined = undefined;

    let nextCheckDateTime = await gcpLengthCache.getNextCheckDateTime();
    let cacheDateTime = await gcpLengthCache.getCacheDateTime();
    let cacheData = await gcpLengthCache.getCacheData();

    const now = new Date();
    const tomorrow = addDays(now, 1);

    if (nextCheckDateTime === undefined || nextCheckDateTime.getTime() <= now.getTime() || cacheDateTime === undefined || cacheData === undefined) {
        const sourceDateTime = await gcpLengthCache.getSourceDateTime();

        if (cacheDateTime === undefined || cacheData === undefined || cacheDateTime.getTime() < sourceDateTime.getTime()) {
            const sourceData = await gcpLengthCache.getSourceData();

            if (typeof sourceData !== "string") {
                root = {
                    dateTime: sourceDateTime,
                    childNodes: []
                };

                fromBinary(sourceData, root.childNodes, 0);

                cacheData = sourceData;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- File format is known.
                const gcpLength = JSON.parse(sourceData) as GCPLengthJSON;

                root = {
                    dateTime: new Date(gcpLength.GCPPrefixFormatList.date),
                    childNodes: []
                };

                let branchesAdded = 1;

                for (const entry of gcpLength.GCPPrefixFormatList.entry) {
                    branchesAdded += addEntry(root, entry.prefix, entry.gcpLength);
                }

                // Each branch has ten (possibly undefined) entries, two per byte.
                cacheData = new Uint8Array(branchesAdded * 5);

                toBinary(cacheData, root, 0);
            }
            
            cacheDateTime = sourceDateTime;

            await gcpLengthCache.setCacheData(cacheData);
            await gcpLengthCache.setCacheDateTime(cacheDateTime);

            // Next check date/time is a week from source date/time or tomorrow, whichever is later.
            nextCheckDateTime = addDays(sourceDateTime, 7);
            if (nextCheckDateTime.getTime() < tomorrow.getTime()) {
                nextCheckDateTime = tomorrow;
            }
        } else {
            // Next check date/time is tomorrow.
            nextCheckDateTime = tomorrow;
        }

        await gcpLengthCache.setNextCheckDateTime(nextCheckDateTime);
    }

    // Root is undefined if cached data is still valid.
    if (root === undefined) {
        root = {
            dateTime: cacheDateTime,
            childNodes: []
        };

        fromBinary(cacheData, root.childNodes, 0);
    }

    return root;
}

/**
 * Get the length of a GS1 Company Prefix for an identifier.
 *
 * @param root
 * Root of tree.
 *
 * @param identifierType
 * Identifier type.
 *
 * @param identifier
 * Identifier.
 *
 * @returns
 * Length of GS1 Company Prefix, 0 if not a GS1 Company Prefix, or -1 if not found.
 */
export function getFor(root: Root, identifierType: IdentifierType, identifier: string): number {
    let identifierPrefix: string;

    if (identifierType === IdentifierTypes.GTIN) {
        // Normalize the GTIN, pad to 14 digits, and extract the identifier prefix at the first character.
        identifierPrefix = GTINValidator.normalize(identifier).padStart(GTINLengths.GTIN14, "0").substring(1);
    } else {
        const identifierValidator = IdentifierValidators[identifierType];

        identifierValidator.validate(identifier);

        identifierPrefix = !isNumericIdentifierValidator(identifierValidator) || identifierValidator.leaderType !== LeaderTypes.ExtensionDigit ? identifier : identifier.substring(1);
    }

    let node: Node | undefined = root;

    let digitIndex = 0;

    // Traverse tree until exhausted or at a leaf.
    while (node !== undefined && !isLeaf(node)) {
        node = node.childNodes[Number(identifierPrefix.charAt(digitIndex++))];
    }

    return node?.length ?? -1;
}
