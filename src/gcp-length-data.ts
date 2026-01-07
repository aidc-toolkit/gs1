/**
 * GS1 Company Prefix length header.
 */
export interface GCPLengthHeader {
    /**
     * Date/time the data was last updated.
     */
    readonly dateTime: Date;

    /**
     * Disclaimer.
     */
    readonly disclaimer: string;
}

/**
 * Parse a JSON string representing a GS1 Company Prefix length header.
 *
 * @param s
 * JSON string.
 *
 * @returns
 * GS1 Company Prefix length header.
 */
export function parseGCPLengthHeader(s: string): GCPLengthHeader {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- File format is known.
    return JSON.parse(s, (key, value: unknown) =>
        key === "dateTime" && typeof value === "string" ? new Date(value) : value
    ) as GCPLengthHeader;
}

/**
 * Generate a JSON string representing a GS1 Company Prefix length header.
 *
 * @param gcpLengthHeader
 * GS1 Company Prefix length header.
 *
 * @param space
 * JSON string indentation.
 *
 * @returns
 * JSON string.
 */
export function stringifyGCPLengthHeader(gcpLengthHeader: GCPLengthHeader, space?: string | number): string {
    return JSON.stringify(gcpLengthHeader, (key, value: unknown) =>
        key === "dateTime" && value instanceof Date ? value.toISOString() : value,
    space);
}

/**
 * GS1 Company Prefix length data.
 */
export interface GCPLengthData extends GCPLengthHeader {
    /**
     * Date/time the data was last updated.
     */
    readonly dateTime: Date;

    /**
     * Disclaimer.
     */
    readonly disclaimer: string;

    /**
     * Tree data in binary form.
     */
    readonly data: Uint8Array;
}
