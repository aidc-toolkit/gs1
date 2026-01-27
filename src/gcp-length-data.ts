import type { AppData } from "@aidc-toolkit/core";

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
 * Determine if application data object is GS1 Company Prefix length header.
 *
 * @param appData
 * Application data object.
 *
 * @returns
 * True if application data object is GS1 Company Prefix length header.
 */
export function isGCPLengthHeader(appData: AppData | undefined): appData is GCPLengthHeader {
    // Property type check is necessary to guard against data corruption or changes in format.
    return typeof appData === "object" && "dateTime" in appData && appData.dateTime instanceof Date && "disclaimer" in appData && typeof appData.disclaimer === "string";
}

/**
 * GS1 Company Prefix length data.
 */
export interface GCPLengthData extends GCPLengthHeader {
    /**
     * Tree data in binary form.
     */
    readonly data: Uint8Array;
}

/**
 * Determine if application data object is GS1 Company Prefix length data.
 *
 * @param appData
 * Application data object.
 *
 * @returns
 * True if application data object is GS1 Company Prefix length data.
 */
export function isGCPLengthData(appData: AppData | undefined): appData is GCPLengthData {
    // Property type check is necessary to guard against data corruption or changes in format.
    return isGCPLengthHeader(appData) && "data" in appData && appData.data instanceof Uint8Array;
}

/**
 * GS1 Company Prefix length application data.
 */
export interface GCPLengthAppData {
    /**
     * Next check date/time.
     */
    nextCheckDateTime: Date | undefined;

    /**
     * GS1 Company Prefix length data.
     */
    gcpLengthData: GCPLengthData | undefined;
}

/**
 * Determine if application data object is GS1 Company Prefix length application data.
 *
 * @param appData
 * Application data object.
 *
 * @returns
 * True if application data object is GS1 Company Prefix length application data.
 */
export function isGCPLengthAppData(appData: AppData | undefined): appData is GCPLengthAppData {
    // Property type check is necessary to guard against data corruption or changes in format.
    return typeof appData === "object" && "nextCheckDateTime" in appData && appData.nextCheckDateTime instanceof Date && (
        !("gcpLengthData" in appData) || appData.gcpLengthData === undefined || (
            typeof appData.gcpLengthData === "object" && appData.gcpLengthData !== null && isGCPLengthData(appData.gcpLengthData)
        )
    );
}

/**
 * GS1 Company Prefix length JSON source file format.
 */
export interface GCPLengthSourceJSON {
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
 * Determine if application data object is GS1 Company Prefix length source JSON.
 *
 * @param appData
 * Application data object.
 *
 * @returns
 * True if application data object is GS1 Company Prefix length source JSON.
 */
export function isGCPLengthSourceJSON(appData: AppData | undefined): appData is GCPLengthSourceJSON {
    // Checking is minimal as this is generally used in a controlled environment (e.g., updating remote storage).
    return typeof appData === "object" && "_disclaimer" in appData && "GCPPrefixFormatList" in appData;
}
