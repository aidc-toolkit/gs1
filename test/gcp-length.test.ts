import type { Promisable } from "@aidc-toolkit/core";
import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, test } from "vitest";
import * as GCPLength from "../src/gcp-length.js";
import {
    type GCPLengthCache,
    IdentifierTypes,
    PrefixManager,
    PrefixTypes,
    PrefixValidator,
    RemoteGCPLengthCache
} from "../src/index.js";

interface ReadonlyStorage<T> {
    read: () => Promisable<T>;
}

interface Storage<T> extends ReadonlyStorage<T | undefined> {
    write: (value: T) => Promisable<void>;
}

function makeReadonly<T>(storage: Storage<T>): ReadonlyStorage<T> {
    return {
        async read(): Promise<T> {
            const t = await storage.read();

            if (t === undefined) {
                throw new Error("Storage has no data");
            }

            return t;
        }
    };
}

function createGCPLengthCache(nextCheckDateTimeStorage: Storage<Date>, cacheDateTimeStorage: Storage<Date>, cacheDataStorage: Storage<Uint8Array>, sourceDateTimeStorage: ReadonlyStorage<Date>, sourceDataStorage: ReadonlyStorage<string> | ReadonlyStorage<Uint8Array>): GCPLengthCache {
    return {
        getNextCheckDateTime: nextCheckDateTimeStorage.read,
        setNextCheckDateTime: nextCheckDateTimeStorage.write,
        getCacheDateTime: cacheDateTimeStorage.read,
        setCacheDateTime: cacheDateTimeStorage.write,
        getCacheData: cacheDataStorage.read,
        setCacheData: cacheDataStorage.write,
        getSourceDateTime: sourceDateTimeStorage.read,
        getSourceData: sourceDataStorage.read
    };
}

const DATA_DIRECTORY = "test/data";

const BINARY_1_DATE_TIME_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-date-time-1.txt");

const BINARY_1_DATA_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-1.bin");

const BINARY_2_DATE_TIME_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-date-time-2.txt");

const BINARY_2_DATA_PATH = path.resolve(DATA_DIRECTORY, "gcp-length-2.bin");

const JSON_1_DATA_PATH = path.resolve(DATA_DIRECTORY, "gcpprefixformatlist-1.json");

const JSON_2_DATA_PATH = path.resolve(DATA_DIRECTORY, "gcpprefixformatlist-2.json");

interface GCPLengthJSON {
    _disclaimer: string[];
    GCPPrefixFormatList: {
        date: string;
        entry: Array<{
            prefix: string;
            gcpLength: number;
        }>;
    };
}

describe("GS1 Company Prefix length", () => {
    function binaryDateTimeStorage(binaryDateTimePath: string): Storage<Date> {
        return {
            read(): Date | undefined {
                let dateTime: Date | undefined;

                try {
                    dateTime = new Date(fs.readFileSync(binaryDateTimePath).toString());
                } catch {
                    dateTime = undefined;
                }

                return dateTime;
            },

            write(value: Date): void {
                fs.writeFileSync(binaryDateTimePath, value.toISOString());
            }
        };
    }

    function binaryDataStorage(binaryDataPath: string): Storage<Uint8Array> {
        return {
            read(): Uint8Array | undefined {
                let data: Uint8Array | undefined;

                try {
                    data = fs.readFileSync(binaryDataPath);
                } catch {
                    data = undefined;
                }

                return data;
            },

            write(value: Uint8Array): void {
                fs.writeFileSync(binaryDataPath, value);
            }
        };
    }

    function jsonDateTimeStorage(jsonDateTimePath: string): ReadonlyStorage<Date> {
        return {
            read(): Date {
                return new Date((JSON.parse(fs.readFileSync(jsonDateTimePath).toString()) as GCPLengthJSON).GCPPrefixFormatList.date);
            }
        };
    }

    function jsonDataStorage(jsonDataPath: string): ReadonlyStorage<string> {
        return {
            read(): string {
                return fs.readFileSync(jsonDataPath).toString();
            }
        };
    }

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

    function unlink(path: string): void {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    function unlinkBinaries(): void {
        unlink(BINARY_1_DATE_TIME_PATH);
        unlink(BINARY_1_DATA_PATH);
        unlink(BINARY_2_DATE_TIME_PATH);
        unlink(BINARY_2_DATA_PATH);
    }

    const binary1DateTimeStorage = binaryDateTimeStorage(BINARY_1_DATE_TIME_PATH);
    const binary1DataStorage = binaryDataStorage(BINARY_1_DATA_PATH);
    const binary2DateTimeStorage = binaryDateTimeStorage(BINARY_2_DATE_TIME_PATH);
    const binary2DataStorage = binaryDataStorage(BINARY_2_DATA_PATH);
    const json1DateTimeStorage = jsonDateTimeStorage(JSON_1_DATA_PATH);
    const json1DataStorage = jsonDataStorage(JSON_1_DATA_PATH);
    const json2DateTimeStorage = jsonDateTimeStorage(JSON_2_DATA_PATH);
    const json2DataStorage = jsonDataStorage(JSON_2_DATA_PATH);

    const emptyStorage: Storage<Date> & Storage<string> & Storage<Uint8Array> = {
        read(): undefined {
            return undefined;
        },

        write() {
        }
    };

    test("Load", async () => {
        unlinkBinaries();

        let nextCheckDateTime: Date | undefined = undefined;

        const nextCheckDateTimeStorage: Storage<Date> = {
            read(): Date | undefined {
                return nextCheckDateTime;
            },

            write(value: Date): void {
                nextCheckDateTime = value;
            }
        };

        // Neither binary available.
        await expect((async () => {
            await GCPLength.loadData(createGCPLengthCache(nextCheckDateTimeStorage, binary1DateTimeStorage, binary1DataStorage, makeReadonly(binary2DateTimeStorage), makeReadonly(binary2DataStorage)));
        })()).rejects.toThrowError("Storage has no data");

        expect(nextCheckDateTime).toBeUndefined();

        let root1: GCPLength.Root | undefined;

        // Binary 1 not available, JSON 1 available.
        await expect((async () => {
            root1 = await GCPLength.loadData(createGCPLengthCache(nextCheckDateTimeStorage, binary1DateTimeStorage, binary1DataStorage, json1DateTimeStorage, json1DataStorage));
        })()).resolves.not.toThrowError(RangeError);

        expect(nextCheckDateTime).not.toBeUndefined();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Known not to be undefined.
        expect(new Date().getTime() + 24 * 60 * 60 * 1000 - nextCheckDateTime!.getTime()).toBeLessThan(10000);

        expect(root1).not.toBeUndefined();

        let root2: GCPLength.Root | undefined;

        // Binary 1 available, binary 2 not available but not in next check date/time window.
        await expect((async () => {
            root2 = await GCPLength.loadData(createGCPLengthCache(nextCheckDateTimeStorage, binary1DateTimeStorage, binary1DataStorage, makeReadonly(binary2DateTimeStorage), makeReadonly(binary2DataStorage)));
        })()).resolves.not.toThrowError(RangeError);

        expect(root2).not.toBeUndefined();

        // Load from JSON 1 equal to load from binary 1.
        expect(() => {
            verifyEqual("", root1, root2);
        }).not.toThrow(RangeError);

        root2 = undefined;

        // Binary 2 not available, JSON 2 available.
        await expect((async () => {
            root2 = await GCPLength.loadData(createGCPLengthCache(nextCheckDateTimeStorage, binary2DateTimeStorage, binary2DataStorage, json2DateTimeStorage, json2DataStorage));
        })()).resolves.not.toThrowError(RangeError);

        expect(root2).not.toBeUndefined();

        root2 = undefined;

        // Binary 1 available, binary 2 available and more recent but not in next check date/time window.
        await expect((async () => {
            root2 = await GCPLength.loadData(createGCPLengthCache(nextCheckDateTimeStorage, binary1DateTimeStorage, binary1DataStorage, makeReadonly(binary2DateTimeStorage), makeReadonly(binary2DataStorage)));
        })()).resolves.not.toThrowError(RangeError);

        // No change.
        expect(() => {
            verifyEqual("", root1, root2);
        }).not.toThrow(RangeError);

        nextCheckDateTime = new Date();

        // Binary 1 available, binary 2 available and more recent and in next check date/time window.
        await expect((async () => {
            root2 = await GCPLength.loadData(createGCPLengthCache(nextCheckDateTimeStorage, binary1DateTimeStorage, binary1DataStorage, makeReadonly(binary2DateTimeStorage), makeReadonly(binary2DataStorage)));
        })()).resolves.not.toThrowError(RangeError);

        expect(root2).not.toBeUndefined();

        // Load from binary 1 not equal to load from binary 2.
        expect(() => {
            verifyEqual("", root1, root2);
        }).toThrow(RangeError);

        unlinkBinaries();
    });

    test("Identifiers", async () => {
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

        const json = await json1DataStorage.read();

        const root = await GCPLength.loadData(createGCPLengthCache(emptyStorage, emptyStorage, emptyStorage, json1DateTimeStorage, json1DataStorage));

        const gcpLengthJSON = JSON.parse(json) as GCPLengthJSON;
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
        const gcpLengthCache = new class extends RemoteGCPLengthCache {
            #nextCheckDateTime: Date | undefined = undefined;

            #cacheDateTime: Date | undefined = undefined;

            #cacheData: Uint8Array | undefined = undefined;

            override getNextCheckDateTime(): Date | undefined {
                return this.#nextCheckDateTime;
            }

            override setNextCheckDateTime(nextCheckDateTime: Date): void {
                this.#nextCheckDateTime = nextCheckDateTime;
            }

            override getCacheDateTime(): Date | undefined {
                return this.#cacheDateTime;
            }

            override setCacheDateTime(cacheDateTime: Date): void {
                this.#cacheDateTime = cacheDateTime;
            }

            override getCacheData(): Uint8Array | undefined {
                return this.#cacheData;
            }

            override setCacheData(cacheData: Uint8Array): void {
                this.#cacheData = cacheData;
            }
        }();

        await expect((async () => {
            await GCPLength.loadData(gcpLengthCache);
        })()).resolves.not.toThrowError(RangeError);

        expect(gcpLengthCache.getNextCheckDateTime()).not.toBeUndefined();
        expect(gcpLengthCache.getCacheDateTime()).not.toBeUndefined();
        expect(gcpLengthCache.getCacheData()).not.toBeUndefined();
    });
});
