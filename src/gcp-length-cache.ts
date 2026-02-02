import {
    type AppData,
    type AppDataStorage,
    Cache,
    defaultHTTPFetch,
    type HTTPFetch,
    omit,
    RemoteAppDataStorage,
    WEBSITE_BASE_URL
} from "@aidc-toolkit/core";
import {
    type GCPLengthAppData,
    type GCPLengthData,
    type GCPLengthHeader,
    type GCPLengthSourceJSON,
    isGCPLengthAppData,
    isGCPLengthHeader
} from "./gcp-length-data.js";
import { i18nextGS1 } from "./locale/i18n.js";

/**
 * GS1 Company Prefix length cache.
 */
export abstract class GCPLengthCache extends Cache<GCPLengthData, GCPLengthData | GCPLengthSourceJSON> {
    /**
     * Storage key for full application data object.
     */
    static APP_DATA_STORAGE_KEY = "gcp-length";

    /**
     * Storage key for next check date/time.
     */
    static NEXT_CHECK_DATE_TIME_STORAGE_KEY = "gcp-length-next-check-date-time";

    /**
     * Storage key for header information (date/time and disclaimer).
     */
    static HEADER_STORAGE_KEY = "gcp-length-header";

    /**
     * Storage key for data only.
     */
    static DATA_STORAGE_KEY = "gcp-length-data";

    /**
     * Application data storage.
     */
    readonly #appDataStorage: AppDataStorage<boolean>;

    /**
     * GS1 Company Prefix application data.
     */
    #cacheGCPLengthAppData?: GCPLengthAppData | undefined;

    /**
     * Constructor.
     *
     * @param appDataStorage
     * Application data storage.
     */
    constructor(appDataStorage: AppDataStorage<boolean>) {
        super();

        this.#appDataStorage = appDataStorage;
    }

    /**
     * Get the application data storage.
     */
    get appDataStorage(): AppDataStorage<boolean> {
        return this.#appDataStorage;
    }

    /**
     * Load cached GS1 Company Prefix length application data from application data storage.
     *
     * @returns
     * GS1 Company Prefix length application data.
     */
    async #loadCache(): Promise<GCPLengthAppData> {
        if (this.#cacheGCPLengthAppData === undefined) {
            if (!this.appDataStorage.supportsBinary) {
                // Everything is stored in a single object.
                const appData = await this.appDataStorage.read(GCPLengthCache.APP_DATA_STORAGE_KEY);

                if (isGCPLengthAppData(appData)) {
                    this.#cacheGCPLengthAppData = appData;
                }
            } else {
                const nextCheckDateTime = await this.appDataStorage.read(GCPLengthCache.NEXT_CHECK_DATE_TIME_STORAGE_KEY);
                const header = await this.appDataStorage.read(GCPLengthCache.HEADER_STORAGE_KEY);
                const data = await this.appDataStorage.read(GCPLengthCache.DATA_STORAGE_KEY, true);

                this.#cacheGCPLengthAppData = {
                    nextCheckDateTime: nextCheckDateTime instanceof Date ? nextCheckDateTime : undefined,
                    gcpLengthData: isGCPLengthHeader(header) && data instanceof Uint8Array ?
                        {
                            ...header,
                            data
                        } :
                        undefined
                };
            }
        }

        // If there's nothing in the cache yet, create an object with the next check date/time set to now.
        if (this.#cacheGCPLengthAppData === undefined) {
            this.#cacheGCPLengthAppData = {
                nextCheckDateTime: new Date(),
                gcpLengthData: undefined
            };
        }

        return this.#cacheGCPLengthAppData;
    }

    /**
     * @inheritDoc
     */
    override get nextCheckDateTime(): Promise<Date | undefined> {
        return this.#loadCache().then(gcpLengthAppData => gcpLengthAppData.nextCheckDateTime);
    }

    /**
     * @inheritDoc
     */
    override get cacheDateTime(): Promise<Date | undefined> {
        return this.#loadCache().then(gcpLengthAppData => gcpLengthAppData.gcpLengthData?.dateTime);
    }

    /**
     * @inheritDoc
     */
    override get cacheData(): Promise<GCPLengthData> {
        return this.#loadCache().then((gcpLengthAppData) => {
            if (gcpLengthAppData.gcpLengthData === undefined) {
                // Application error; no localization necessary.
                throw new Error("GS1 Company Prefix length application data not loaded");
            }

            return gcpLengthAppData.gcpLengthData;
        });
    }

    /**
     * @inheritDoc
     */
    override async update(nextCheckDateTime: Date, _cacheDateTime?: Date, cacheData?: GCPLengthData): Promise<void> {
        this.#cacheGCPLengthAppData = {
            nextCheckDateTime,
            // Retain existing data if cache data is not provided.
            gcpLengthData: cacheData ?? this.#cacheGCPLengthAppData?.gcpLengthData
        };

        if (!this.appDataStorage.supportsBinary) {
            // Everything is stored in a single object.
            await this.appDataStorage.write(GCPLengthCache.APP_DATA_STORAGE_KEY, this.#cacheGCPLengthAppData);
        } else {
            await this.appDataStorage.write(GCPLengthCache.NEXT_CHECK_DATE_TIME_STORAGE_KEY, nextCheckDateTime);

            if (cacheData !== undefined) {
                await this.appDataStorage.write(GCPLengthCache.HEADER_STORAGE_KEY, omit(cacheData, "data"));
                await this.appDataStorage.write(GCPLengthCache.DATA_STORAGE_KEY, cacheData.data);
            }
        }
    }
}

/**
 * GS1 Company Prefix length cache with remote source. This class provides access to the data from a remote source, by
 * default the AIDC Toolkit website. If any error occurs, the next check date/time is set to the current date/time plus
 * ten minutes to prevent the network from being overloaded.
 *
 * The data on the AIDC Toolkit website is updated regularly with the data provided by GS1, and it's stored in binary
 * format for faster retrieval.
 */
export class RemoteGCPLengthCache extends GCPLengthCache {
    /**
     * Default base URL pointing to AIDC Toolkit website data directory.
     */
    static DEFAULT_BASE_URL = `${WEBSITE_BASE_URL}/data`;

    /**
     * Remote application data storage.
     */
    readonly #remoteAppDataStorage: RemoteAppDataStorage;

    /**
     * Remote GS1 Company Prefix header data.
     */
    #remoteGCPLengthHeader?: GCPLengthHeader | undefined;

    /**
     * Constructor.
     *
     * @param appDataStorage
     * Application data storage.
     *
     * @param baseURL
     * Base URL. The URL must not end with a slash and must host the `gcp-length-header.json` and `gcp-length-data.bin`
     * files.
     *
     * @param httpFetch
     * HTTP fetch function.
     */
    constructor(appDataStorage: AppDataStorage<boolean>, baseURL: string = RemoteGCPLengthCache.DEFAULT_BASE_URL, httpFetch: HTTPFetch = defaultHTTPFetch) {
        super(appDataStorage);

        this.#remoteAppDataStorage = new RemoteAppDataStorage(baseURL, httpFetch);
    }

    /**
     * Get remote application data. If an exception is thrown while retrieving or processing the data, retrying is
     * delayed for ten minutes to prevent repeated network calls.
     *
     * @param pathKey
     * Key relative to base URL.
     *
     * @param asBinary
     * True if binary data is requested, false if string data is requested.
     *
     * @param callback
     * Callback function to process the application data.
     *
     * @returns
     * Application data.
     */
    async #getRemoteAppData<T>(pathKey: string, asBinary: boolean, callback: (appData: AppData) => T): Promise<T> {
        return this.#remoteAppDataStorage.read(pathKey, asBinary).then((appData) => {
            if (appData === undefined) {
                throw new RangeError(i18nextGS1.t("GCPLength.gs1CompanyPrefixLengthDataFileNotFound", {
                    key: pathKey
                }));
            }

            return callback(appData);
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
    override get sourceDateTime(): Promise<Date> {
        // Header is fetched on each call.
        return this.#getRemoteAppData(RemoteGCPLengthCache.HEADER_STORAGE_KEY, false, (appData) => {
            if (!isGCPLengthHeader(appData)) {
                // Application error; no localization necessary.
                throw new Error("Invalid GS1 Company Prefix length header");
            }

            this.#remoteGCPLengthHeader = appData;

            return this.#remoteGCPLengthHeader.dateTime;
        });
    }

    /**
     * @inheritDoc
     */
    override get sourceData(): Promise<GCPLengthData> {
        return this.#getRemoteAppData(RemoteGCPLengthCache.DATA_STORAGE_KEY, true, (appData) => {
            const gcpLengthHeader = this.#remoteGCPLengthHeader;

            if (gcpLengthHeader === undefined) {
                // Application error; no localization necessary.
                throw new Error("GS1 Company Prefix length header not loaded");
            }

            if (!(appData instanceof Uint8Array)) {
                // Application error; no localization necessary.
                throw new Error("Invalid GS1 Company Prefix length data");
            }

            return {
                ...gcpLengthHeader,
                data: appData
            };
        });
    }
}
