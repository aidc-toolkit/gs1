import type { Cache, Promisable } from "@aidc-toolkit/core";
import { i18nextGS1 } from "./locale/i18n.js";

/**
 * GS1 Company Prefix length cache.
 */
export type GCPLengthCache = Cache<Uint8Array, Uint8Array | string>;

/**
 * GS1 Company Prefix length cache with remote source.
 */
export abstract class RemoteGCPLengthCache implements GCPLengthCache {
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
        this.#baseURL = baseURL;
    }

    /**
     * @inheritDoc
     */
    abstract getNextCheckDateTime(): Promisable<Date | undefined>;

    /**
     * @inheritDoc
     */
    abstract setNextCheckDateTime(nextCheckDateTime: Date): Promisable<void>;

    /**
     * @inheritDoc
     */
    abstract getCacheDateTime(): Promisable<Date | undefined>;

    /**
     * @inheritDoc
     */
    abstract setCacheDateTime(cacheDateTime: Date): Promisable<void>;

    /**
     * @inheritDoc
     */
    abstract getCacheData(): Promisable<Uint8Array | undefined>;

    /**
     * @inheritDoc
     */
    abstract setCacheData(cacheData: Uint8Array): Promisable<void>;

    /**
     * Get a remote file.
     *
     * @param fileName
     * File name relative to base URL.
     *
     * @returns
     * Response.
     */
    private async getRemoteFile(fileName: string): Promise<Response> {
        const response = await fetch(`${this.#baseURL}${fileName}`);

        if (!response.ok) {
            throw new RangeError(i18nextGS1.t("Prefix.gs1CompanyPrefixLengthDataHTTPError", {
                status: response.status
            }));
        }

        return response;
    }

    /**
     * @inheritDoc
     */
    async getSourceDateTime(): Promise<Date> {
        return this.getRemoteFile(RemoteGCPLengthCache.SOURCE_DATE_TIME_FILE_NAME).then(async response =>
            await response.text()
        ).then(s =>
            new Date(s)
        );
    }

    /**
     * @inheritDoc
     */
    async getSourceData(): Promise<string | Uint8Array> {
        return this.getRemoteFile(RemoteGCPLengthCache.SOURCE_DATA_FILE_NAME).then(async response =>
            await response.arrayBuffer()
        ).then(a =>
            new Uint8Array(a)
        );
    }
}
