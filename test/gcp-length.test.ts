import { type AppDataStorage, LocalAppDataStorage } from "@aidc-toolkit/core";
import * as fs from "node:fs";
import * as path from "node:path";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import * as GCPLength from "../src/gcp-length.js";
import {
    GCPLengthCache,
    type GCPLengthData,
    type GCPLengthHeader,
    type GCPLengthSourceJSON,
    IdentifierTypes,
    isGCPLengthHeader,
    isGCPLengthSourceJSON,
    PrefixManager,
    PrefixTypes,
    PrefixValidator,
    RemoteGCPLengthCache
} from "../src/index.js";

const DATA_DIRECTORY = "test/data";

class GCPLengthCacheJSONSource extends GCPLengthCache {
    readonly #pathKey: string;

    #gcpLengthSourceJSON!: GCPLengthSourceJSON;

    constructor(appDataStorage: AppDataStorage<boolean>, index: number) {
        super(appDataStorage);

        this.#pathKey = `gcpprefixformatlist-${index}`;
    }

    get sourceDateTime(): Promise<Date> {
        return this.appDataStorage.read(this.#pathKey).then((appData) => {
            if (!isGCPLengthSourceJSON(appData)) {
                throw new Error(`File ${this.#pathKey}.json has invalid content`);
            }

            this.#gcpLengthSourceJSON = appData;

            return new Date(appData.GCPPrefixFormatList.date);
        });
    }

    get sourceData(): GCPLengthSourceJSON {
        return this.#gcpLengthSourceJSON;
    }
}

class GCPLengthCacheBinarySource extends GCPLengthCache {
    readonly #headerPathKey: string;

    readonly #dataPathKey: string;

    #gcpLengthHeader!: GCPLengthHeader;

    constructor(appDataStorage: AppDataStorage<boolean>, index: number) {
        super(appDataStorage);

        this.#headerPathKey = `${GCPLengthCache.HEADER_STORAGE_KEY}-${index}`;
        this.#dataPathKey = `${GCPLengthCache.DATA_STORAGE_KEY}-${index}`;
    }

    get sourceDateTime(): Promise<Date> {
        return this.appDataStorage.read(this.#headerPathKey).then((appData) => {
            if (!isGCPLengthHeader(appData)) {
                throw new Error(`File ${this.#headerPathKey}.json not found or has invalid content`);
            }
            
            this.#gcpLengthHeader = appData;
            
            return appData.dateTime;
        });
    }

    get sourceData(): Promise<GCPLengthData> {
        return this.appDataStorage.read(this.#dataPathKey, true).then((appData) => {
            if (!(appData instanceof Uint8Array)) {
                throw new Error(`File ${this.#dataPathKey}.bin not found or has invalid content`);
            }
            
            return {
                ...this.#gcpLengthHeader,
                data: appData
            };
        });
    }
}

const NEXT_CHECK_DATE_TIME_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-next-check-date-time.json");

const BINARY_HEADER_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-header.json");

const BINARY_DATA_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-data.bin");

const BINARY_1_HEADER_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-header-1.json");

const BINARY_1_DATA_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-data-1.bin");

const BINARY_2_HEADER_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-header-2.json");

const BINARY_2_DATA_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-data-2.bin");

describe("GS1 Company Prefix length", () => {
    function verifyEqual(prefix: string, node1: GCPLength.Node | undefined, node2: GCPLength.Node | undefined): void {
        if (node1 !== undefined) {
            if (node2 === undefined) {
                throw new RangeError(`Prefix ${prefix}: node1 defined, node2 undefined`);
            }

            if (GCPLength.isLeaf(node1)) {
                if (!GCPLength.isLeaf(node2)) {
                    throw new RangeError(`Prefix ${prefix}: node1 is leaf, node2 is branch`);
                }

                if (node1.length !== node2.length) {
                    throw new RangeError(`Prefix ${prefix}: node1.length = ${node1.length}, node2.length = ${node2.length}`);
                }
            } else if (!GCPLength.isLeaf(node2)) {
                for (let index = 0; index < 10; index++) {
                    verifyEqual(`${prefix}${index}`, node1.childNodes[index], (node2 as GCPLength.Branch).childNodes[index]);
                }
            } else {
                throw new RangeError(`Prefix ${prefix}: node1 is branch, node2 is leaf`);
            }
        } else if (node2 !== undefined) {
            throw new RangeError(`Prefix ${prefix}: node1 undefined, node2 defined`);
        }
    }

    function rm(...paths: string[]): void {
        for (const path of paths) {
            fs.rmSync(path, {
                force: true
            });
        }
    }

    function rmCache(): void {
        rm(NEXT_CHECK_DATE_TIME_PATH,
            BINARY_HEADER_PATH, BINARY_DATA_PATH,
            BINARY_1_HEADER_PATH, BINARY_1_DATA_PATH,
            BINARY_2_HEADER_PATH, BINARY_2_DATA_PATH
        );
    }

    function save(fileName: string, index: number): void {
        fs.renameSync(fileName, fileName.replace(".", `-${index}.`));
    }

    function saveBinary(index: number): void {
        save(BINARY_HEADER_PATH, index);
        save(BINARY_DATA_PATH, index);
    }

    function restore(fileName: string, index: number): void {
        fs.renameSync(fileName.replace(".", `-${index}.`), fileName);
    }

    function restoreBinary(index: number): void {
        restore(BINARY_HEADER_PATH, index);
        restore(BINARY_DATA_PATH, index);
    }

    beforeAll(rmCache);
    afterAll(rmCache);

    test("Load", async () => {
        const appDataStorage = new (await LocalAppDataStorage)(DATA_DIRECTORY);

        const gcpLengthCacheJSON1Source = new GCPLengthCacheJSONSource(appDataStorage, 1);
        const gcpLengthCacheJSON2Source = new GCPLengthCacheJSONSource(appDataStorage, 2);
        const gcpLengthCacheBinary1Source = new GCPLengthCacheBinarySource(appDataStorage, 1);
        const gcpLengthCacheBinary2Source = new GCPLengthCacheBinarySource(appDataStorage, 2);

        let root1: GCPLength.Root | undefined;
        let root2: GCPLength.Root | undefined;
        let nextCheckDateTime: Date | undefined;

        // Binary not available, JSON 1 available.
        await expect(GCPLength.loadData(gcpLengthCacheJSON1Source).then((root) => {
            root1 = root;
        })).resolves.not.toThrowError(RangeError);

        nextCheckDateTime = await gcpLengthCacheJSON1Source.nextCheckDateTime;

        expect(root1).not.toBeUndefined();
        expect(nextCheckDateTime).not.toBeUndefined();

        // Check next check date/time is a day from now.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Known to be defined.
        expect(new Date().getTime() + 24 * 60 * 60 * 1000 - nextCheckDateTime!.getTime()).toBeLessThan(10000);

        // Binary available, binary 1 not available but not in next check date/time window.
        await expect(GCPLength.loadData(gcpLengthCacheBinary1Source).then((root) => {
            root2 = root;
        })).resolves.not.toThrowError(RangeError);

        expect(root2).not.toBeUndefined();

        // Load from JSON 1 equal to load from binary.
        expect(() => {
            verifyEqual("", root1, root2);
        }).not.toThrow(RangeError);

        saveBinary(1);
        rm(NEXT_CHECK_DATE_TIME_PATH);

        // Binary not available, JSON 2 available.
        await expect(GCPLength.loadData(gcpLengthCacheJSON2Source).then((root) => {
            root2 = root;
        })).resolves.not.toThrowError(RangeError);

        nextCheckDateTime = await gcpLengthCacheJSON2Source.nextCheckDateTime;

        expect(root2).not.toBeUndefined();
        expect(nextCheckDateTime).not.toBeUndefined();

        saveBinary(2);
        restoreBinary(1);

        // Binary available, binary 2 available and more recent but not in next check date/time window.
        await expect(GCPLength.loadData(gcpLengthCacheBinary2Source).then((root) => {
            root2 = root;
        })).resolves.not.toThrowError(RangeError);

        // No change.
        expect(() => {
            verifyEqual("", root1, root2);
        }).not.toThrow(RangeError);

        await gcpLengthCacheBinary2Source.update(new Date());

        // Binary 1 available, binary 2 available and more recent and in next check date/time window.
        await expect(GCPLength.loadData(gcpLengthCacheBinary2Source).then((root) => {
            root2 = root;
        })).resolves.not.toThrowError(RangeError);

        expect(root2).not.toBeUndefined();

        // Load from binary 1 not equal to load from binary 2.
        expect(() => {
            verifyEqual("", root1, root2);
        }).toThrow(RangeError);
    });

    test("Identifiers", async () => {
        const gcpLengthCacheJSON2Source = new class extends GCPLengthCacheJSONSource {
            override get nextCheckDateTime(): Promise<Date | undefined> {
                return Promise.resolve(undefined);
            }

            override get cacheDateTime(): Promise<Date | undefined> {
                return Promise.resolve(undefined);
            }

            override async update(): Promise<void> {
                return Promise.resolve();
            }
        }(new (await LocalAppDataStorage)(DATA_DIRECTORY), 2);

        const tempRoot = await GCPLength.loadData(gcpLengthCacheJSON2Source);

        expect(tempRoot).not.toBeUndefined();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Known to be defined.
        const root = tempRoot!;

        function testIdentifiers(prefixManager: PrefixManager, prefixLength: number): void {
            expect(GCPLength.getFor(root, IdentifierTypes.GTIN, prefixManager.gtinCreator.create(0, true))).toBe(prefixLength);
            expect(GCPLength.getFor(root, IdentifierTypes.GTIN, prefixManager.gtinCreator.createGTIN14("4", 0, true))).toBe(prefixLength);

            if (prefixManager.prefixType !== PrefixTypes.GS18Prefix) {
                expect(GCPLength.getFor(root, IdentifierTypes.GLN, prefixManager.glnCreator.create(0, true))).toBe(prefixLength);
                expect(GCPLength.getFor(root, IdentifierTypes.SSCC, prefixManager.ssccCreator.create(0, true))).toBe(prefixLength);
                expect(GCPLength.getFor(root, IdentifierTypes.GRAI, prefixManager.graiCreator.create(0, true))).toBe(prefixLength);
                expect(GCPLength.getFor(root, IdentifierTypes.GRAI, prefixManager.graiCreator.createSerialized(0, "ABCD1234", true))).toBe(prefixLength);
                expect(GCPLength.getFor(root, IdentifierTypes.GIAI, prefixManager.giaiCreator.create("EFGH5678"))).toBe(prefixLength);
            }
        }

        const gcpLengthJSON = gcpLengthCacheJSON2Source.sourceData;
        const entries = gcpLengthJSON.GCPPrefixFormatList.entry;

        for (let i = 0; i < 1000; i++) {
            const entryIndex = Math.floor(Math.random() * entries.length);
            const gcpLengthJSONEntry = entries[entryIndex];
            const prefixLength = gcpLengthJSONEntry.gcpLength;
            const testPrefixLength = prefixLength !== 0 ? prefixLength : Math.max(PrefixValidator.GS1_COMPANY_PREFIX_MINIMUM_LENGTH, PrefixValidator.UPC_COMPANY_PREFIX_MINIMUM_LENGTH + 1, PrefixValidator.GS1_8_PREFIX_MINIMUM_LENGTH + 5);

            let prefix = gcpLengthJSONEntry.prefix;

            while (prefix.length !== testPrefixLength) {
                prefix = `${prefix}${Math.floor(Math.random() * 10)}`;
            }

            testIdentifiers(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, prefix), prefixLength);

            if (entryIndex !== entries.length - 1) {
                const nextGCPLengthJSONEntry = entries[entryIndex + 1];

                if (nextGCPLengthJSONEntry.prefix.length === gcpLengthJSONEntry.prefix.length && Number(nextGCPLengthJSONEntry.prefix) - Number(gcpLengthJSONEntry.prefix) !== 1) {
                    let nextPrefix = String(Number(gcpLengthJSONEntry.prefix) + 1).padStart(gcpLengthJSONEntry.prefix.length, "0");

                    while (nextPrefix.length !== testPrefixLength) {
                        nextPrefix = `${nextPrefix}${Math.floor(Math.random() * 10)}`;
                    }

                    testIdentifiers(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, nextPrefix), -1);
                }
            }
        }
    });

    test("Remote", async () => {
        let savedNextCheckDateTime: Date | undefined = undefined;
        let savedCacheDateTime: Date | undefined = undefined;
        let savedCacheData: GCPLengthData | undefined = undefined;

        const gcpLengthCache = new class extends RemoteGCPLengthCache {
            override get nextCheckDateTime(): Promise<Date | undefined> {
                return Promise.resolve(savedNextCheckDateTime);
            }

            override get cacheDateTime(): Promise<Date | undefined> {
                return Promise.resolve(savedCacheDateTime);
            }

            override async update(nextCheckDateTime: Date, cacheDateTime?: Date, cacheData?: GCPLengthData): Promise<void> {
                savedNextCheckDateTime = nextCheckDateTime;
                savedCacheDateTime = cacheDateTime;
                savedCacheData = cacheData;

                return Promise.resolve();
            }
        }(new (await LocalAppDataStorage)(DATA_DIRECTORY));

        await expect(GCPLength.loadData(gcpLengthCache)).resolves.not.toThrowError(RangeError);

        expect(savedNextCheckDateTime).not.toBeUndefined();
        expect(savedCacheDateTime).not.toBeUndefined();
        expect(savedCacheData).not.toBeUndefined();
    });
});
