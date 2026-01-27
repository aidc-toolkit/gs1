import { omit } from "@aidc-toolkit/core";
import type { GCPLengthCache } from "./gcp-length-cache.js";
import { type GCPLengthData, type GCPLengthHeader, isGCPLengthData } from "./gcp-length-data.js";
import { GTINLengths } from "./gtin-length.js";
import { GTINValidator } from "./gtin-validator.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import { IdentifierValidators, isNumericIdentifierValidator } from "./identifier-validators.js";
import { LeaderTypes } from "./leader-type.js";
import { i18nextGS1 } from "./locale/i18n.js";

/**
 * Leaf of GS1 Company Prefix length tree.
 */
interface Leaf {
    readonly length: number;
}

/**
 * Branch of GS1 Company Prefix length tree.
 */
interface Branch {
    readonly childNodes: ReadonlyArray<Node | undefined>;
}

/**
 * Root of GS1 Company Prefix length tree.
 */
interface Root extends GCPLengthHeader, Branch {
}

/**
 * Node in GS1 Company Prefix length tree.
 */
type Node = Branch | Leaf;

/**
 * Determine if a node is a leaf.
 *
 * @param node
 * Node.
 *
 * @returns
 * True if node is a leaf.
 */
function isLeaf(node: Node): node is Leaf {
    return "length" in node;
}

/**
 * Interim branch of GS1 Company Prefix length tree with writeable child nodes.
 */
export interface InterimBranch {
    readonly childNodes: Array<InterimBranch | Leaf | undefined>;
}

/**
 * GS1 Company Prefix length service. The constructor takes a {@linkcode GCPLengthCache} object, which is responsible
 * for managing the cache and source.
 *
 * The first step is to load the GS1 Company Prefix length data. This is done using the
 * {@linkcode GCPLength.load | load()} method, which works as follows:
 *
 * - If the next check date/time is in the future, the method returns immediately, regardless of whether any data is
 * available. It does this to prevent a large number of requests to the source in the event of a failure.
 * - Otherwise, if the cache date/time is undefined or less than the source date/time, it loads from the source,
 * converts the data if necessary, and updates the cache.
 * - Otherwise, it continues with the cached data.
 * - The next check date/time is updated to the later of the source date/time plus one week and the current date/time
 * plus one day.
 *
 * The base class implementation of the `GCPLengthCache` manages only the cache itself, and it requires an
 * application-provided storage implementation. The source is expected to be either a {@linkcode GCPLengthData} object
 * (created via another cache implementation) or a {@linkcode GCPLengthSourceJSON} object, which is the format of the
 * file provided by GS1.
 *
 * Once the data is loaded, the {@linkcode GCPLength.lengthOf | lengthOf()} method can be used to get the length of a
 * GS1 Company Prefix for an identifier type and identifier.
 */
export class GCPLength {
    /**
     * Entry in binary data to indicate that child node is undefined.
     */
    static readonly #BINARY_UNDEFINED = 0x0F;

    /**
     * Entry in binary data to indicate that child node is a branch.
     */
    static readonly #BINARY_BRANCH = 0x0E;

    /**
     * GS1 Company Prefix length cache.
     */
    readonly #gcpLengthCache: GCPLengthCache;

    /**
     * GS1 Company Prefix length tree root.
     */
    #root?: Root;

    /**
     * Constructor.
     *
     * @param gcpLengthCache
     * GS1 Company Prefix length cache.
     */
    constructor(gcpLengthCache: GCPLengthCache) {
        this.#gcpLengthCache = gcpLengthCache;
    }

    /**
     * Get the GS1 Company Prefix length tree root.
     *
     * @returns
     * GS1 Company Prefix length tree root.
     */
    get root(): Root {
        if (this.#root === undefined) {
            throw new RangeError(i18nextGS1.t("GCPLength.gs1CompanyPrefixLengthDataNotLoaded"));
        }

        return this.#root;
    }

    /**
     * Get the date/time the GS1 Company Prefix length data was last updated.
     */
    get dateTime(): Date {
        return this.root.dateTime;
    }

    /**
     * Get the disclaimer for the GS1 Company Prefix length data.
     */
    get disclaimer(): string {
        return this.root.disclaimer;
    }

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
    static #fromBinary(binaryData: Uint8Array, childNodes: Array<Node | undefined>, startIndex: number): number {
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

            if (length !== GCPLength.#BINARY_UNDEFINED) {
                let childNode: Node;

                if (length === GCPLength.#BINARY_BRANCH) {
                    const childNodes: Array<Node | undefined> = [];

                    endIndex = GCPLength.#fromBinary(binaryData, childNodes, endIndex);

                    childNode = {
                        childNodes
                    };
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
     * Current (interim) branch under construction.
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
    static #addEntry(branch: InterimBranch, prefix: string, length: number): number {
        const digit = Number(prefix.charAt(0));

        const existingChildNode = branch.childNodes[digit];

        let branchesAdded = 0;

        if (prefix.length !== 1) {
            let childBranch: InterimBranch;

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
            branchesAdded += GCPLength.#addEntry(childBranch, prefix.substring(1), length);
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
    static #childNodeValue(childNode: Node | undefined): number {
        return childNode !== undefined ? isLeaf(childNode) ? childNode.length : GCPLength.#BINARY_BRANCH : GCPLength.#BINARY_UNDEFINED;
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
    static #toBinary(binaryData: Uint8Array, branch: Branch, startIndex: number): number {
        let endIndex = startIndex;

        const childNodes = branch.childNodes;

        // Add length or non-leaf indicators, compressing 10 nibbles into 5 bytes.
        for (let childNodeIndex = 0; childNodeIndex < 10; childNodeIndex += 2) {
            // eslint-disable-next-line no-param-reassign -- Purpose is to build array.
            binaryData[endIndex++] = (GCPLength.#childNodeValue(childNodes[childNodeIndex]) << 4) | GCPLength.#childNodeValue(childNodes[childNodeIndex + 1]);
        }

        // Process child nodes.
        for (const childNode of childNodes) {
            if (childNode !== undefined && !isLeaf(childNode)) {
                endIndex = GCPLength.#toBinary(binaryData, childNode, endIndex);
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
     * Future date.
     */
    static #addDays(date: Date, days: number): Date {
        const futureDate = new Date(date);

        futureDate.setDate(futureDate.getDate() + days);

        return futureDate;
    }

    /**
     * Load the GS1 Company Prefix length data.
     */
    async load(): Promise<void> {
        let root: Root | undefined = undefined;

        const gcpLengthCache = this.#gcpLengthCache;

        let nextCheckDateTime = await gcpLengthCache.nextCheckDateTime;
        let cacheDateTime = await gcpLengthCache.cacheDateTime;

        const now = new Date();
        const tomorrow = GCPLength.#addDays(now, 1);

        if (nextCheckDateTime === undefined || nextCheckDateTime.getTime() <= now.getTime()) {
            const sourceDateTime = await gcpLengthCache.sourceDateTime;

            if (cacheDateTime === undefined || cacheDateTime.getTime() < sourceDateTime.getTime()) {
                const sourceData = await gcpLengthCache.sourceData;

                let cacheData: GCPLengthData;

                if (isGCPLengthData(sourceData)) {
                    const childNodes: Array<Node | undefined> = [];

                    GCPLength.#fromBinary(sourceData.data, childNodes, 0);

                    root = {
                        dateTime: sourceData.dateTime,
                        disclaimer: sourceData.disclaimer,
                        childNodes
                    };

                    cacheData = sourceData;
                } else {
                    const interimRoot: InterimBranch = {
                        childNodes: []
                    };

                    let branchesAdded = 1;

                    for (const entry of sourceData.GCPPrefixFormatList.entry) {
                        branchesAdded += GCPLength.#addEntry(interimRoot, entry.prefix, entry.gcpLength);
                    }

                    root = {
                        dateTime: new Date(sourceData.GCPPrefixFormatList.date),
                        // Join disclaimer as a single string.
                        disclaimer: `${sourceData._disclaimer.reduce<string[]>((lines, line) => {
                            if (lines.length === 0 || lines[lines.length - 1] === "" || line === "") {
                                lines.push(line);
                            } else {
                                // Lines are part of the same paragraph.
                                lines.push(`${lines.pop()} ${line}`);
                            }

                            return lines;
                        }, []).join("\n")}\n`,
                        ...interimRoot
                    };

                    // Each branch has ten (some possibly undefined) entries, two per byte.
                    const data = new Uint8Array(branchesAdded * 5);

                    GCPLength.#toBinary(data, root, 0);

                    cacheData = {
                        ...omit(root, "childNodes"),
                        data
                    };
                }

                // Next check date/time is a week from source date/time or tomorrow, whichever is later.
                nextCheckDateTime = GCPLength.#addDays(sourceDateTime, 7);
                if (nextCheckDateTime.getTime() < tomorrow.getTime()) {
                    nextCheckDateTime = tomorrow;
                }

                cacheDateTime = sourceDateTime;

                await gcpLengthCache.update(nextCheckDateTime, cacheDateTime, cacheData);
            } else {
                // Next check date/time is tomorrow.
                await gcpLengthCache.update(tomorrow);
            }
        }

        // Root is undefined if cache data is still valid or retrying after prior failure.
        if (root === undefined && cacheDateTime !== undefined) {
            const cacheData = await gcpLengthCache.cacheData;

            const childNodes: Array<Node | undefined> = [];

            GCPLength.#fromBinary(cacheData.data, childNodes, 0);

            root = {
                ...omit(cacheData, "data"),
                childNodes
            };
        }

        // Update root only if successful.
        if (root !== undefined) {
            this.#root = root;
        }
    }

    /**
     * Get the length of a GS1 Company Prefix for an identifier.
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
    lengthOf(identifierType: IdentifierType, identifier: string): number {
        let identifierPrefix: string;

        if (identifierType === IdentifierTypes.GTIN) {
            // Normalize the GTIN, pad to 14 digits, and extract the identifier prefix at the first character.
            identifierPrefix = GTINValidator.normalize(identifier).padStart(GTINLengths.GTIN14, "0").substring(1);
        } else {
            const identifierValidator = IdentifierValidators[identifierType];

            identifierValidator.validate(identifier);

            identifierPrefix = !isNumericIdentifierValidator(identifierValidator) || identifierValidator.leaderType !== LeaderTypes.ExtensionDigit ? identifier : identifier.substring(1);
        }

        let node: Node | undefined = this.root;

        let digitIndex = 0;

        // Traverse tree until exhausted or at a leaf.
        while (node !== undefined && !isLeaf(node)) {
            node = node.childNodes[Number(identifierPrefix.charAt(digitIndex++))];
        }

        return node?.length ?? -1;
    }
}
