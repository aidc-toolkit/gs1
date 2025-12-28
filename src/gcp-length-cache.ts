import { Cache } from "@aidc-toolkit/core";
import { i18nextGS1 } from "./locale/i18n.js";

/**
 * GS1 Company Prefix length cache.
 */
export abstract class GCPLengthCache extends Cache<Uint8Array, Uint8Array | string> {
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
     * Default base URL pointing to AIDC Toolkit website data directory.
     */
    static SOURCE_DATE_TIME_FILE_NAME = "gcp-length-date-time.txt";

    /**
     * Default base URL pointing to AIDC Toolkit website data directory.
     */
    static SOURCE_DATA_FILE_NAME = "gcp-length.bin";

    /**
     * Base URL.
     */
    readonly #baseURL: string;

    /**
     * Constructor.
     *
     * @param baseURL
     * Base URL. The URL must end with a slash, and must host the {@linkcode SOURCE_DATE_TIME_FILE_NAME} and
     * {@linkcode SOURCE_DATA_FILE_NAME} files.
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
        return this.#getRemoteFile(RemoteGCPLengthCache.SOURCE_DATE_TIME_FILE_NAME).then(async response =>
            await response.text()
        ).then(s =>
            new Date(s)
        );
    }

    /**
     * @inheritDoc
     */
    get sourceData(): Promise<Uint8Array> {
        return this.#getRemoteFile(RemoteGCPLengthCache.SOURCE_DATA_FILE_NAME).then(async response =>
            await response.arrayBuffer()
        ).then(a =>
            new Uint8Array(a)
        );
    }
}
