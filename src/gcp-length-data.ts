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
