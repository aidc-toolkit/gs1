import { Cache } from "@aidc-toolkit/core";
import { type GCPLengthData, type GCPLengthHeader, parseGCPLengthHeader } from "./gcp-length-data.js";
import { i18nextGS1 } from "./locale/i18n.js";

/**
 * GS1 Company Prefix length cache.
 */
export abstract class GCPLengthCache extends Cache<GCPLengthData, GCPLengthData | string> {
}

/**
 * GS1 Company Prefix length cache with remote source.
 */
export abstract class RemoteGCPLengthCache extends GCPLengthCache {
    /**
     * Default base URL pointing to AIDC Toolkit website data directory.
     */
    static DEFAULT_BASE_URL = "https://aidc-toolkit.com/data/";

    /**
     * File containing header information (date/time and disclaimer).
     */
    static SOURCE_HEADER_FILE_NAME = "gcp-length-header.json";

    /**
     * File containing tree data in binary form.
     */
    static SOURCE_DATA_FILE_NAME = "gcp-length-data.bin";

    /**
     * Base URL.
     */
    readonly #baseURL: string;

    /**
     * GS1 Company Prefix header data.
     */
    #gcpLengthHeader?: GCPLengthHeader | undefined;

    /**
     * Constructor.
     *
     * @param baseURL
     * Base URL. The URL must end with a slash, and must host the {@linkcode SOURCE_HEADER_FILE_NAME} and {@linkcode
     * SOURCE_DATA_FILE_NAME} files.
     */
    constructor(baseURL: string = RemoteGCPLengthCache.DEFAULT_BASE_URL) {
        super();

        this.#baseURL = baseURL;
    }

    /**
     * Get a remote file. If an exception is thrown, retrying is delayed for ten minutes to prevent repeated network
     * calls.
     *
     * @param fileName
     * File name relative to base URL.
     *
     * @returns
     * Response.
     */
    async #getRemoteFile(fileName: string): Promise<Response> {
        return fetch(`${this.#baseURL}${fileName}`).then((response) => {
            if (!response.ok) {
                throw new RangeError(i18nextGS1.t("Prefix.gs1CompanyPrefixLengthDataHTTPError", {
                    status: response.status
                }));
            }

            return response;
        }).catch(async (e: unknown) => {
            // Try again in ten minutes.
            const nowPlus10Minutes = new Date();
            nowPlus10Minutes.setMinutes(nowPlus10Minutes.getMinutes() + 10);

            await this.update(nowPlus10Minutes);

            throw e;
        });
    }

    /**
     * @inheritDoc
     */
    get sourceDateTime(): Promise<Date> {
        return this.#getRemoteFile(RemoteGCPLengthCache.SOURCE_HEADER_FILE_NAME).then(async response =>
            response.text()
        ).then((s) => {
            this.#gcpLengthHeader = parseGCPLengthHeader(s);

            return this.#gcpLengthHeader.dateTime;
        });
    }

    /**
     * @inheritDoc
     */
    get sourceData(): Promise<GCPLengthData> {
        if (this.#gcpLengthHeader === undefined) {
            // Application error; no localization necessary.
            throw new Error("GS1 Company Prefix length header not loaded");
        }

        const gcpLengthHeader = this.#gcpLengthHeader;

        // Clear header to allow for retry in case of failure.
        this.#gcpLengthHeader = undefined;

        return this.#getRemoteFile(RemoteGCPLengthCache.SOURCE_DATA_FILE_NAME).then(async response =>
            response.arrayBuffer()
        ).then(a => ({
            ...gcpLengthHeader,
            data: new Uint8Array(a)
        }));
    }
}
