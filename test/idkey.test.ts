import { I18NEnvironment, i18nInit } from "@aidc-toolkit/core";
import { CharacterSetCreator, Exclusion, NUMERIC_CREATOR, Sequencer } from "@aidc-toolkit/utility";
import { describe, expect, test } from "vitest";
import {
    AI39_CREATOR,
    AI82_CREATOR,
    ContentCharacterSet,
    CPID_VALIDATOR,
    GCN_VALIDATOR,
    GDTI_VALIDATOR,
    GIAI_VALIDATOR,
    GINC_VALIDATOR,
    GLN_VALIDATOR,
    GMN_VALIDATOR,
    GRAI_VALIDATOR,
    GSIN_VALIDATOR,
    GSRN_VALIDATOR,
    GTIN12_VALIDATOR,
    GTIN13_VALIDATOR,
    GTIN8_VALIDATOR,
    GTIN_VALIDATORS,
    GTINCreator,
    GTINLevel,
    GTINType,
    type GTINValidator,
    hasValidCheckCharacterPair,
    hasValidCheckDigit,
    IdentificationKeyType,
    type IdentificationKeyValidator,
    LeaderType,
    type NonGTINNumericIdentificationKeyCreator,
    type NonGTINNumericIdentificationKeyValidator,
    type NonNumericIdentificationKeyCreator,
    type NonNumericIdentificationKeyValidator,
    type NumericIdentificationKeyCreator,
    type NumericIdentificationKeyValidator,
    PrefixManager,
    PrefixType,
    type SerializableNumericIdentificationKeyCreator,
    type SerializableNumericIdentificationKeyValidator,
    SSCC_VALIDATOR
} from "../src/index.js";

await i18nInit(I18NEnvironment.CLI);

function creatorFor(characterSet: ContentCharacterSet): CharacterSetCreator {
    let creator: CharacterSetCreator;

    switch (characterSet) {
        case ContentCharacterSet.Numeric:
            creator = NUMERIC_CREATOR;
            break;

        case ContentCharacterSet.AI82:
            creator = AI82_CREATOR;
            break;

        case ContentCharacterSet.AI39:
            creator = AI39_CREATOR;
            break;
    }

    return creator;
}

function validateIdentificationKeyValidator(creator: IdentificationKeyValidator, identificationKeyType: IdentificationKeyType, prefixType: PrefixType, length: number): void {
    expect(creator.identificationKeyType).toBe(identificationKeyType);
    expect(creator.prefixType).toBe(prefixType);
    expect(creator.length).toBe(length);
}

function validateNumericIdentificationKeyValidator(validator: NumericIdentificationKeyValidator, isCreator: boolean, identificationKeyType: IdentificationKeyType, prefixType: PrefixType, length: number, leaderType: LeaderType): void {
    validateIdentificationKeyValidator(validator, identificationKeyType, prefixType, length);

    expect(validator.leaderType).toBe(leaderType);
    expect(validator.referenceCharacterSet).toBe(ContentCharacterSet.Numeric);
    expect(validator.referenceCreator).toBe(NUMERIC_CREATOR);

    if (isCreator) {
        expect((validator as NumericIdentificationKeyCreator).referenceCreator).toBe(NUMERIC_CREATOR);
    }
}

function validateGTINValidator(validator: GTINValidator, isCreator: boolean, gtinType: GTINType): void {
    let prefixType: PrefixType;

    switch (gtinType) {
        case GTINType.GTIN13:
            prefixType = PrefixType.GS1CompanyPrefix;
            break;

        case GTINType.GTIN12:
            prefixType = PrefixType.UPCCompanyPrefix;
            break;

        case GTINType.GTIN8:
            prefixType = PrefixType.GS18Prefix;
            break;

        default:
            throw new Error("Not supported");
    }

    validateNumericIdentificationKeyValidator(validator, isCreator, IdentificationKeyType.GTIN, prefixType, gtinType, LeaderType.IndicatorDigit);

    expect(validator.gtinType).toBe(gtinType);
}

function validateNonGTINNumericIdentificationKeyValidator(validator: NonGTINNumericIdentificationKeyValidator, isCreator: boolean, identificationKeyType: IdentificationKeyType, length: number, leaderType: LeaderType): void {
    validateNumericIdentificationKeyValidator(validator, isCreator, identificationKeyType, PrefixType.GS1CompanyPrefix, length, leaderType);
}

function validateSerializableNumericIdentificationKeyValidator(validator: SerializableNumericIdentificationKeyValidator, isCreator: boolean, identificationKeyType: IdentificationKeyType, length: number, leaderType: LeaderType, serialLength: number, serialCharacterSet: ContentCharacterSet): void {
    validateNonGTINNumericIdentificationKeyValidator(validator, isCreator, identificationKeyType, length, leaderType);

    const serialCreator = creatorFor(serialCharacterSet);

    expect(validator.serialComponentLength).toBe(serialLength);
    expect(validator.serialComponentCharacterSet).toBe(serialCharacterSet);
    expect(validator.serialComponentCreator).toBe(serialCreator);

    if (isCreator) {
        expect((validator as SerializableNumericIdentificationKeyCreator).serialComponentCreator).toBe(serialCreator);
    }
}

function validateNonNumericIdentificationKeyValidator(validator: NonNumericIdentificationKeyValidator, isCreator: boolean, identificationKeyType: IdentificationKeyType, length: number, referenceCharacterSet: ContentCharacterSet, requiresCheckCharacterPair: boolean): void {
    validateIdentificationKeyValidator(validator, identificationKeyType, PrefixType.GS1CompanyPrefix, length);

    const referenceCreator = creatorFor(referenceCharacterSet);

    expect(validator.referenceCharacterSet).toBe(referenceCharacterSet);
    expect(validator.referenceCreator).toBe(referenceCreator);
    expect(validator.requiresCheckCharacterPair).toBe(requiresCheckCharacterPair);

    if (isCreator) {
        expect((validator as NonNumericIdentificationKeyCreator).referenceCreator).toBe(referenceCreator);
    }
}

describe("Validators", () => {
    test("GTIN", () => {
        expect(GTIN_VALIDATORS[PrefixType.GS1CompanyPrefix]).toBe(GTIN13_VALIDATOR);
        expect(GTIN_VALIDATORS[PrefixType.UPCCompanyPrefix]).toBe(GTIN12_VALIDATOR);
        expect(GTIN_VALIDATORS[PrefixType.GS18Prefix]).toBe(GTIN8_VALIDATOR);
    });

    test("Structure", () => {
        validateGTINValidator(GTIN13_VALIDATOR, false, GTINType.GTIN13);
        validateGTINValidator(GTIN12_VALIDATOR, false, GTINType.GTIN12);
        validateGTINValidator(GTIN8_VALIDATOR, false, GTINType.GTIN8);
        validateNonGTINNumericIdentificationKeyValidator(GLN_VALIDATOR, false, IdentificationKeyType.GLN, 13, LeaderType.None);
        validateNonGTINNumericIdentificationKeyValidator(SSCC_VALIDATOR, false, IdentificationKeyType.SSCC, 18, LeaderType.ExtensionDigit);
        validateSerializableNumericIdentificationKeyValidator(GRAI_VALIDATOR, false, IdentificationKeyType.GRAI, 13, LeaderType.None, 16, ContentCharacterSet.AI82);
        validateNonNumericIdentificationKeyValidator(GIAI_VALIDATOR, false, IdentificationKeyType.GIAI, 30, ContentCharacterSet.AI82, false);
        validateNonGTINNumericIdentificationKeyValidator(GSRN_VALIDATOR, false, IdentificationKeyType.GSRN, 18, LeaderType.None);
        validateSerializableNumericIdentificationKeyValidator(GDTI_VALIDATOR, false, IdentificationKeyType.GDTI, 13, LeaderType.None, 17, ContentCharacterSet.AI82);
        validateNonNumericIdentificationKeyValidator(GINC_VALIDATOR, false, IdentificationKeyType.GINC, 30, ContentCharacterSet.AI82, false);
        validateNonGTINNumericIdentificationKeyValidator(GSIN_VALIDATOR, false, IdentificationKeyType.GSIN, 17, LeaderType.None);
        validateSerializableNumericIdentificationKeyValidator(GCN_VALIDATOR, false, IdentificationKeyType.GCN, 13, LeaderType.None, 12, ContentCharacterSet.Numeric);
        validateNonNumericIdentificationKeyValidator(CPID_VALIDATOR, false, IdentificationKeyType.CPID, 30, ContentCharacterSet.AI39, false);
        validateNonNumericIdentificationKeyValidator(GMN_VALIDATOR, false, IdentificationKeyType.GMN, 25, ContentCharacterSet.AI82, true);
    });
});

function validateIdentificationKeyCreators(prefixManager: PrefixManager): void {
    let gtinType: GTINType;

    switch (prefixManager.prefixType) {
        case PrefixType.GS1CompanyPrefix:
            expect(prefixManager.prefix).toBe(prefixManager.gs1CompanyPrefix);
            gtinType = GTINType.GTIN13;
            break;

        case PrefixType.UPCCompanyPrefix:
            expect(prefixManager.prefix).toBe(prefixManager.upcCompanyPrefix);
            gtinType = GTINType.GTIN12;
            break;

        case PrefixType.GS18Prefix:
            expect(prefixManager.prefix).toBe(prefixManager.gs18Prefix);
            gtinType = GTINType.GTIN8;
            break;
    }

    expect(prefixManager.gtinCreator).toBe(prefixManager.gtinCreator);

    validateGTINValidator(prefixManager.gtinCreator, true, gtinType);

    if (prefixManager.prefixType !== PrefixType.GS18Prefix) {
        expect(prefixManager.glnCreator).toBe(prefixManager.glnCreator);
        expect(prefixManager.ssccCreator).toBe(prefixManager.ssccCreator);
        expect(prefixManager.graiCreator).toBe(prefixManager.graiCreator);
        expect(prefixManager.giaiCreator).toBe(prefixManager.giaiCreator);
        expect(prefixManager.gsrnCreator).toBe(prefixManager.gsrnCreator);
        expect(prefixManager.gdtiCreator).toBe(prefixManager.gdtiCreator);
        expect(prefixManager.gincCreator).toBe(prefixManager.gincCreator);
        expect(prefixManager.gsinCreator).toBe(prefixManager.gsinCreator);
        expect(prefixManager.gcnCreator).toBe(prefixManager.gcnCreator);
        expect(prefixManager.cpidCreator).toBe(prefixManager.cpidCreator);
        expect(prefixManager.gmnCreator).toBe(prefixManager.gmnCreator);

        validateNonGTINNumericIdentificationKeyValidator(prefixManager.glnCreator, true, IdentificationKeyType.GLN, 13, LeaderType.None);
        validateNonGTINNumericIdentificationKeyValidator(prefixManager.ssccCreator, true, IdentificationKeyType.SSCC, 18, LeaderType.ExtensionDigit);
        validateSerializableNumericIdentificationKeyValidator(prefixManager.graiCreator, true, IdentificationKeyType.GRAI, 13, LeaderType.None, 16, ContentCharacterSet.AI82);
        validateNonNumericIdentificationKeyValidator(prefixManager.giaiCreator, true, IdentificationKeyType.GIAI, 30, ContentCharacterSet.AI82, false);
        validateNonGTINNumericIdentificationKeyValidator(prefixManager.gsrnCreator, true, IdentificationKeyType.GSRN, 18, LeaderType.None);
        validateSerializableNumericIdentificationKeyValidator(prefixManager.gdtiCreator, true, IdentificationKeyType.GDTI, 13, LeaderType.None, 17, ContentCharacterSet.AI82);
        validateNonNumericIdentificationKeyValidator(prefixManager.gincCreator, true, IdentificationKeyType.GINC, 30, ContentCharacterSet.AI82, false);
        validateNonGTINNumericIdentificationKeyValidator(prefixManager.gsinCreator, true, IdentificationKeyType.GSIN, 17, LeaderType.None);
        validateSerializableNumericIdentificationKeyValidator(prefixManager.gcnCreator, true, IdentificationKeyType.GCN, 13, LeaderType.None, 12, ContentCharacterSet.Numeric);
        validateNonNumericIdentificationKeyValidator(prefixManager.cpidCreator, true, IdentificationKeyType.CPID, 30, ContentCharacterSet.AI39, false);
        validateNonNumericIdentificationKeyValidator(prefixManager.gmnCreator, true, IdentificationKeyType.GMN, 25, ContentCharacterSet.AI82, true);
    } else {
        expect(() => prefixManager.glnCreator).toThrow("GLN not supported by GS1-8 Prefix");
        expect(() => prefixManager.ssccCreator).toThrow("SSCC not supported by GS1-8 Prefix");
        expect(() => prefixManager.graiCreator).toThrow("GRAI not supported by GS1-8 Prefix");
        expect(() => prefixManager.giaiCreator).toThrow("GIAI not supported by GS1-8 Prefix");
        expect(() => prefixManager.gsrnCreator).toThrow("GSRN not supported by GS1-8 Prefix");
        expect(() => prefixManager.gdtiCreator).toThrow("GDTI not supported by GS1-8 Prefix");
        expect(() => prefixManager.gincCreator).toThrow("GINC not supported by GS1-8 Prefix");
        expect(() => prefixManager.gsinCreator).toThrow("GSIN not supported by GS1-8 Prefix");
        expect(() => prefixManager.gcnCreator).toThrow("GCN not supported by GS1-8 Prefix");
        expect(() => prefixManager.cpidCreator).toThrow("CPID not supported by GS1-8 Prefix");
        expect(() => prefixManager.gmnCreator).toThrow("GMN not supported by GS1-8 Prefix");
    }
}

describe("Prefix manager", () => {
    let prefixManager: PrefixManager;

    function validateGTINStartsWithPrefix(length: number): void {
        expect(prefixManager.gtinCreator.length).toBe(length);

        const gtin = prefixManager.gtinCreator.create(0);

        expect(gtin.startsWith(prefixManager.prefix)).toBe(true);
        expect(gtin.length).toBe(length);

        const gtin14 = prefixManager.gtinCreator.createGTIN14("5", 0);

        expect(gtin14.startsWith("5" + prefixManager.gs1CompanyPrefix)).toBe(true);
        expect(gtin14.length).toBe(14);
    }

    function validateNonGTINStartsWithGS1CompanyPrefix(): void {
        const gln = prefixManager.glnCreator.create(0);

        expect(gln.startsWith(prefixManager.gs1CompanyPrefix)).toBe(true);
        expect(gln.length).toBe(prefixManager.glnCreator.length);

        const grai = prefixManager.graiCreator.createSerialized(0, "1234");

        expect(grai.startsWith(prefixManager.gs1CompanyPrefix)).toBe(true);
        expect(grai.length).toBe(prefixManager.graiCreator.length + 4);

        const giai = prefixManager.giaiCreator.create("1234");

        expect(giai.startsWith(prefixManager.gs1CompanyPrefix)).toBe(true);
        expect(giai.length).toBe(prefixManager.gs1CompanyPrefix.length + 4);
    }

    test("Prefix equivalence", () => {
        expect(PrefixManager.get(PrefixType.GS1CompanyPrefix, "9521234")).toBe(PrefixManager.get(PrefixType.GS1CompanyPrefix, "9521234"));

        expect(PrefixManager.get(PrefixType.UPCCompanyPrefix, "614141")).toBe(PrefixManager.get(PrefixType.GS1CompanyPrefix, "0614141"));

        expect(PrefixManager.get(PrefixType.GS18Prefix, "952")).toBe(PrefixManager.get(PrefixType.GS1CompanyPrefix, "00000952"));
    });

    test("GS1 Company Prefix 9521234", () => {
        prefixManager = PrefixManager.get(PrefixType.GS1CompanyPrefix, "9521234");

        expect(prefixManager.prefixType).toBe(PrefixType.GS1CompanyPrefix);
        expect(prefixManager.prefix).toBe("9521234");
        expect(prefixManager.gs1CompanyPrefix).toBe(prefixManager.prefix);
        expect(prefixManager.upcCompanyPrefix).toBeUndefined();
        expect(prefixManager.gs18Prefix).toBeUndefined();

        validateGTINStartsWithPrefix(13);
        validateNonGTINStartsWithGS1CompanyPrefix();

        validateIdentificationKeyCreators(prefixManager);
    });

    test("U.P.C. Company Prefix 614141", () => {
        prefixManager = PrefixManager.get(PrefixType.GS1CompanyPrefix, "0614141");

        expect(prefixManager.prefixType).toBe(PrefixType.UPCCompanyPrefix);
        expect(prefixManager.prefix).toBe("614141");
        expect(prefixManager.gs1CompanyPrefix).toBe("0" + prefixManager.prefix);
        expect(prefixManager.upcCompanyPrefix).toBe(prefixManager.prefix);
        expect(prefixManager.gs18Prefix).toBeUndefined();

        validateGTINStartsWithPrefix(12);
        validateNonGTINStartsWithGS1CompanyPrefix();

        validateIdentificationKeyCreators(prefixManager);
    });

    test("GS1-8 Prefix 952", () => {
        prefixManager = PrefixManager.get(PrefixType.GS1CompanyPrefix, "00000952");

        expect(prefixManager.prefixType).toBe(PrefixType.GS18Prefix);
        expect(prefixManager.prefix).toBe("952");
        expect(prefixManager.gs1CompanyPrefix).toBe("00000" + prefixManager.prefix);
        expect(prefixManager.upcCompanyPrefix).toBeUndefined();
        expect(prefixManager.gs18Prefix).toBe(prefixManager.prefix);

        validateGTINStartsWithPrefix(8);

        validateIdentificationKeyCreators(prefixManager);
    });

    test("Prefix validation", () => {
        expect(() => PrefixManager.get(PrefixType.GS1CompanyPrefix, "952")).toThrow("Length 3 of GS1 Company Prefix must be greater than or equal to 4");
        expect(() => PrefixManager.get(PrefixType.GS1CompanyPrefix, "9520")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixType.GS1CompanyPrefix, "952123456789")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixType.GS1CompanyPrefix, "9521234567890")).toThrow("Length 13 of GS1 Company Prefix must be less than or equal to 12");

        expect(() => PrefixManager.get(PrefixType.GS1CompanyPrefix, "952123A56789")).toThrow("Invalid character 'A' at position 7 of GS1 Company Prefix");

        expect(() => PrefixManager.get(PrefixType.UPCCompanyPrefix, "61414")).toThrow("Length 5 of U.P.C. Company Prefix must be greater than or equal to 6");
        expect(() => PrefixManager.get(PrefixType.UPCCompanyPrefix, "614141")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixType.UPCCompanyPrefix, "61414112345")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixType.UPCCompanyPrefix, "614141123456")).toThrow("Length 12 of U.P.C. Company Prefix must be less than or equal to 11");
        expect(() => PrefixManager.get(PrefixType.UPCCompanyPrefix, "000614")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixType.UPCCompanyPrefix, "000061")).toThrow("U.P.C. Company Prefix can't start with \"0000\"");

        expect(() => PrefixManager.get(PrefixType.GS1CompanyPrefix, "00000952")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixType.GS1CompanyPrefix, "000000952")).toThrow("GS1 Company Prefix can't start with \"000000\"");

        expect(() => PrefixManager.get(PrefixType.GS18Prefix, "952")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixType.GS18Prefix, "0952")).toThrow("GS1-8 Prefix can't start with \"0\"");
    });
});

describe("Sparse creation", () => {
    const prefixManager = PrefixManager.get(PrefixType.GS1CompanyPrefix, "9521234");

    const gtin1 = prefixManager.gtinCreator.create(0, true);
    const gln1 = prefixManager.glnCreator.create(0, true);

    test("Same length 1, not equal", () => {
        expect(gln1.length).toBe(gtin1.length);
        expect(gln1).not.toBe(gtin1);
    });

    prefixManager.tweakFactor = 123456;

    const gtin2 = prefixManager.gtinCreator.create(0, true);
    const gln2 = prefixManager.glnCreator.create(0, true);

    test("Same length 2, not equal", () => {
        expect(gln2.length).toBe(gtin2.length);
        expect(gln2).not.toBe(gtin2);
    });

    test("Same types 1 and 2, not equal", () => {
        expect(gtin2).not.toBe(gtin1);
        expect(gln2).not.toBe(gln1);
    });

    prefixManager.resetTweakFactor();

    const gtin3 = prefixManager.gtinCreator.create(0, true);
    const gln3 = prefixManager.glnCreator.create(0, true);

    test("Same length 3, not equal", () => {
        expect(gln3.length).toBe(gtin3.length);
        expect(gln3).not.toBe(gtin3);
    });

    test("Same types 1 and 3, equal", () => {
        expect(gtin3).toBe(gtin1);
        expect(gln3).toBe(gln1);
    });

    prefixManager.tweakFactor = 0;

    const sparseGTINs = Array.from(prefixManager.gtinCreator.create(new Sequencer(0, 10), true));
    const straightGTINs = Array.from(prefixManager.gtinCreator.create(new Sequencer(0, 10)));

    test("Tweak factor 0", () => {
        expect(sparseGTINs).toStrictEqual(straightGTINs);
    });

    prefixManager.resetTweakFactor();
});

function testIdentificationKeyCreatorCallback(callback?: () => void): void {
    if (callback !== undefined) {
        callback();
    }
}

function testNumericIdentificationKeyCreator(creator: NumericIdentificationKeyCreator, preTestCallback?: () => void, postTestCallback?: () => void): void {
    describe(creator.identificationKeyType === IdentificationKeyType.GTIN ? `${creator.identificationKeyType}-${creator.length}` : creator.identificationKeyType, () => {
        testIdentificationKeyCreatorCallback(preTestCallback);

        const prefix = creator.prefix;
        const prefixLength = prefix.length;
        const hasExtensionDigit = creator.leaderType === LeaderType.ExtensionDigit;
        const prefixSubstringStart = Number(hasExtensionDigit);
        const prefixSubstringEnd = prefixSubstringStart + prefixLength;
        const referenceLength = creator.length - prefixLength - 1;
        const referenceCount = Number(CharacterSetCreator.powerOf10(referenceLength));
        const referenceSubstringStart = prefixSubstringEnd;
        const referenceSubstringEnd = referenceSubstringStart + referenceLength - prefixSubstringStart;

        function validate(identificationKey: string, index: number, sparse: boolean): void {
            expect(() => {
                creator.validate(identificationKey);
            }).not.toThrow(RangeError);
            expect(identificationKey).toBe(creator.create(index, sparse));

            expect(identificationKey.length).toBe(creator.length);
            expect(identificationKey.substring(prefixSubstringStart, prefixSubstringEnd)).toBe(prefix);
            expect(hasValidCheckDigit(identificationKey)).toBe(true);
        }

        test("Straight", () => {
            expect(creator.referenceLength).toBe(referenceLength);
            expect(creator.capacity).toBe(Number(CharacterSetCreator.powerOf10(referenceLength)));

            const sequenceIterator = Iterator.from(creator.create(new Sequencer(0, referenceCount)));

            let allCount = 0;

            Iterator.from(creator.createAll()).forEach((identificationKey, index) => {
                validate(identificationKey, index, false);

                expect(Number((hasExtensionDigit ? identificationKey.charAt(0) : "") + identificationKey.substring(referenceSubstringStart, referenceSubstringEnd))).toBe(index);
                expect(sequenceIterator.next().value).toBe(identificationKey);

                allCount++;
            });

            expect(allCount).toBe(referenceCount);
            expect(sequenceIterator.next().value).toBeUndefined();

            const randomValues = new Array<number>();
            const identificationKeys = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identificationKeys.push(creator.create(randomValue));
            }

            expect(Array.from(creator.create(randomValues))).toStrictEqual(identificationKeys);
        });

        test("Sparse", () => {
            const sparseReferenceCount = Math.min(referenceCount, 1000);

            // Reference count of 1 is neither sequential nor sparse so treat it as sparse.
            let sequential = sparseReferenceCount !== 1;

            const sequenceSet = new Set<string>();

            let sequenceCount = 0;

            Iterator.from(creator.create(new Sequencer(0, sparseReferenceCount), true)).forEach((identificationKey, index) => {
                validate(identificationKey, index, true);

                sequential = sequential && Number((hasExtensionDigit ? identificationKey.charAt(0) : "") + identificationKey.substring(referenceSubstringStart, referenceSubstringEnd)) === index;

                expect(sequenceSet.has(identificationKey)).toBe(false);
                sequenceSet.add(identificationKey);

                sequenceCount++;
            });

            expect(sequential).toBe(false);
            expect(sequenceCount).toBe(sparseReferenceCount);

            const randomValues = new Array<number>();
            const identificationKeys = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identificationKeys.push(creator.create(randomValue, true));
            }

            expect(Array.from(creator.create(randomValues, true))).toStrictEqual(identificationKeys);
        });

        test("Validation position", () => {
            const identificationKey = creator.create(0);

            const badIdentificationKey1 = `${identificationKey.substring(0, identificationKey.length - 2)}O${identificationKey.substring(identificationKey.length - 1)}`;

            expect(badIdentificationKey1.length).toBe(creator.length);
            expect(() => {
                creator.validate(badIdentificationKey1);
            }).toThrow(`Invalid character 'O' at position ${creator.length - 1}`);

            const badIdentificationKey2 = `${identificationKey.substring(0, 2)}O${identificationKey.substring(3)}`;

            expect(badIdentificationKey2.length).toBe(creator.length);
            expect(() => {
                creator.validate(badIdentificationKey2);
            }).toThrow("Invalid character 'O' at position 3");
        });

        test("Position offset", () => {
            expect(() => {
                creator.validate(creator.create(0), {
                    positionOffset: 4
                });
            }).not.toThrow(RangeError);
        });

        testIdentificationKeyCreatorCallback(postTestCallback);
    });
}

function testGTINCreator(creator: GTINCreator): void {
    testNumericIdentificationKeyCreator(creator, () => {
        test("Length", () => {
            switch (creator.prefixType) {
                case PrefixType.GS1CompanyPrefix:
                    expect(creator.length).toBe(13);
                    break;

                case PrefixType.UPCCompanyPrefix:
                    expect(creator.length).toBe(12);
                    break;

                case PrefixType.GS18Prefix:
                    expect(creator.length).toBe(8);
                    break;
            }
        });
    }, () => {
        const gs1CompanyPrefix = creator.prefixManager.gs1CompanyPrefix;
        const prefix = creator.prefix;
        const prefixLength = prefix.length;
        const prefixSubstringStart = 14 - creator.length;
        const prefixSubstringEnd = prefixSubstringStart + prefixLength;
        const referenceLength = creator.length - prefixLength - 1;
        const referenceCount = Number(CharacterSetCreator.powerOf10(referenceLength));
        const referenceSubstringStart = prefixSubstringEnd;
        const referenceSubstringEnd = referenceSubstringStart + referenceLength;

        function validate(gtin: string, index: number, sparse: boolean): void {
            expect(() => {
                GTINCreator.validateGTIN14(gtin);
            }).not.toThrow(RangeError);
            expect(gtin).toBe(creator.createGTIN14("5", index, sparse));

            expect(gtin.length).toBe(14);
            expect(gtin.charAt(0)).toBe("5");
            expect(gtin.substring(1, prefixSubstringEnd)).toBe(gs1CompanyPrefix);
            expect(gtin.substring(prefixSubstringStart, prefixSubstringEnd)).toBe(prefix);
            expect(hasValidCheckDigit(gtin)).toBe(true);
        }

        test("GTIN-14 straight", () => {
            let sequenceCount = 0;

            Iterator.from(creator.createGTIN14("5", new Sequencer(0, referenceCount))).forEach((gtin, index) => {
                expect(Number(gtin.substring(referenceSubstringStart, referenceSubstringEnd))).toBe(index);

                validate(gtin, index, false);

                sequenceCount++;
            });

            expect(sequenceCount).toBe(referenceCount);

            const randomValues = new Array<number>();
            const identificationKeys = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identificationKeys.push(creator.createGTIN14("5", randomValue));
            }

            expect(Array.from(creator.createGTIN14("5", randomValues))).toStrictEqual(identificationKeys);
        });

        test("GTIN-14 sparse", () => {
            const sparseReferenceCount = Math.min(referenceCount, 1000);

            // Reference count of 1 is neither sequential nor sparse so treat it as sparse.
            let sequential = sparseReferenceCount !== 1;

            const sequenceSet = new Set<string>();

            let sequenceCount = 0;

            Iterator.from(creator.createGTIN14("5", new Sequencer(0, sparseReferenceCount), true)).forEach((gtin, index) => {
                sequential = sequential && Number(gtin.substring(referenceSubstringStart, referenceSubstringEnd)) === index;

                validate(gtin, index, true);

                expect(sequenceSet.has(gtin)).toBe(false);
                sequenceSet.add(gtin);

                sequenceCount++;
            });

            expect(sequential).toBe(false);
            expect(sequenceCount).toBe(sparseReferenceCount);

            const randomValues = new Array<number>();
            const identificationKeys = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identificationKeys.push(creator.createGTIN14("5", randomValue, true));
            }

            expect(Array.from(creator.createGTIN14("5", randomValues, true))).toStrictEqual(identificationKeys);
        });

        if (creator.gtinType === GTINType.GTIN12) {
            test("Zero-suppress GTIN-12 rule 1", () => {
                expect(GTINCreator.zeroSuppress("012345000058")).toBe("01234558");
                expect(GTINCreator.zeroSuppress("012345000065")).toBe("01234565");
                expect(GTINCreator.zeroSuppress("012345000072")).toBe("01234572");
                expect(GTINCreator.zeroSuppress("012345000089")).toBe("01234589");
                expect(GTINCreator.zeroSuppress("012345000096")).toBe("01234596");
            });

            test("Zero-suppress GTIN-12 rule 2", () => {
                expect(GTINCreator.zeroSuppress("045670000080")).toBe("04567840");
            });

            test("Zero-suppress GTIN-12 rule 3", () => {
                expect(GTINCreator.zeroSuppress("034000005673")).toBe("03456703");
                expect(GTINCreator.zeroSuppress("034100005672")).toBe("03456712");
                expect(GTINCreator.zeroSuppress("034200005671")).toBe("03456721");
            });

            test("Zero-suppress GTIN-12 rule 4", () => {
                expect(GTINCreator.zeroSuppress("098300000752")).toBe("09837532");
                expect(GTINCreator.zeroSuppress("098400000751")).toBe("09847531");
                expect(GTINCreator.zeroSuppress("098500000750")).toBe("09857530");
                expect(GTINCreator.zeroSuppress("098600000759")).toBe("09867539");
                expect(GTINCreator.zeroSuppress("098700000758")).toBe("09877538");
                expect(GTINCreator.zeroSuppress("098800000757")).toBe("09887537");
                expect(GTINCreator.zeroSuppress("098900000756")).toBe("09897536");
            });

            test("Non-zero-suppressible GTIN-12 rule 1", () => {
                expect(() => GTINCreator.zeroSuppress("012345100055")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("012345010057")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("012345001055")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("012345000157")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("012345000041")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("012345000003")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Non-zero-suppressible GTIN-12 rule 2", () => {
                expect(() => GTINCreator.zeroSuppress("045670100087")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("045670010089")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("045670001087")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("045670000189")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Non-zero-suppressible GTIN-12 rule 3", () => {
                expect(() => GTINCreator.zeroSuppress("034010005670")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("034001005672")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("034000105670")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("034000015672")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Non-zero-suppressible GTIN-12 rule 4", () => {
                expect(() => GTINCreator.zeroSuppress("098310000759")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("098301000751")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("098300100759")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("098300010751")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINCreator.zeroSuppress("098300001759")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Zero-suppress other error", () => {
                expect(() => GTINCreator.zeroSuppress("0012345000059")).toThrow("GTIN must be 12 digits long");
                expect(() => GTINCreator.zeroSuppress("012345000059")).toThrow("Invalid check digit");
                expect(() => GTINCreator.zeroSuppress("112345000055")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Zero-expand GTIN-12 rule 1", () => {
                expect(GTINCreator.zeroExpand("01234558")).toBe("012345000058");
                expect(GTINCreator.zeroExpand("01234565")).toBe("012345000065");
                expect(GTINCreator.zeroExpand("01234572")).toBe("012345000072");
                expect(GTINCreator.zeroExpand("01234589")).toBe("012345000089");
                expect(GTINCreator.zeroExpand("01234596")).toBe("012345000096");
                expect(() => GTINCreator.zeroExpand("00000154")).toThrow("U.P.C. Company Prefix can't start with \"0000\"");
            });

            test("Zero-expand GTIN-12 rule 2", () => {
                expect(GTINCreator.zeroExpand("04567840")).toBe("045670000080");
                expect(() => GTINCreator.zeroExpand("00001047")).toThrow("U.P.C. Company Prefix can't start with \"0000\"");
            });

            test("Zero-expand GTIN-12 rule 3", () => {
                expect(GTINCreator.zeroExpand("03456703")).toBe("034000005673");
                expect(GTINCreator.zeroExpand("03456712")).toBe("034100005672");
                expect(GTINCreator.zeroExpand("03456721")).toBe("034200005671");
                expect(() => GTINCreator.zeroExpand("00000028")).not.toThrow(RangeError);
            });

            test("Zero-expand GTIN-12 rule 4", () => {
                expect(GTINCreator.zeroExpand("09837532")).toBe("098300000752");
                expect(GTINCreator.zeroExpand("09847531")).toBe("098400000751");
                expect(GTINCreator.zeroExpand("09857530")).toBe("098500000750");
                expect(GTINCreator.zeroExpand("09867539")).toBe("098600000759");
                expect(GTINCreator.zeroExpand("09877538")).toBe("098700000758");
                expect(GTINCreator.zeroExpand("09887537")).toBe("098800000757");
                expect(GTINCreator.zeroExpand("09897536")).toBe("098900000756");
                expect(() => GTINCreator.zeroExpand("00030037")).not.toThrow(RangeError);
            });

            test("Zero-expand error", () => {
                expect(() => GTINCreator.zeroExpand("001234505")).toThrow("Length 9 must be less than or equal to 8");
                expect(() => GTINCreator.zeroExpand("01234506")).toThrow("Invalid check digit");
                expect(() => GTINCreator.zeroExpand("11234506")).toThrow("Invalid zero-suppressed GTIN-12");
                expect(() => GTINCreator.zeroExpand("09800037")).toThrow("Invalid zero-suppressed GTIN-12");
                expect(() => GTINCreator.zeroExpand("09800047")).toThrow("Invalid zero-suppressed GTIN-12");
                expect(() => GTINCreator.zeroExpand("09800052")).toThrow("Invalid zero-suppressed GTIN-12");
            });
        }

        test("GTIN-14", () => {
            const gtin = creator.create(0, true);

            expect(gtin.length).toBe(creator.length);

            let gtin14 = GTINCreator.convertToGTIN14("0", gtin);

            expect(gtin14.length).toBe(14);
            expect(GTINCreator.normalize(gtin14)).toBe(gtin);

            gtin14 = GTINCreator.convertToGTIN14("1", gtin);

            expect(gtin14.length).toBe(14);
            expect(GTINCreator.normalize(gtin14)).not.toBe(gtin);

            gtin14 = GTINCreator.convertToGTIN14("2", gtin14);

            expect(gtin14.length).toBe(14);
            expect(GTINCreator.normalize(gtin14)).not.toBe(gtin);
        });
    });
}

function testGTINValidationAndNormalization(): void {
    describe("GTIN validation and normalization", () => {
        test("Validation", () => {
            expect(() => {
                GTINCreator.validateAny("9521873000122", GTINLevel.Any);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("19521873000129", GTINLevel.Any);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("9521873000160", GTINLevel.Any);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("95216843", GTINLevel.Any);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("95217800031", GTINLevel.Any);
            }).toThrow("GTIN must be 13, 12, 8, or 14 digits long");
            expect(() => {
                GTINCreator.validateAny("614141773985", GTINLevel.Any);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("614141773991", GTINLevel.Any);
            }).toThrow("Invalid check digit");
            expect(() => {
                GTINCreator.validateAny("09867539", GTINLevel.Any);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("09800037", GTINLevel.Any);
            }).toThrow("Invalid zero-suppressed GTIN-12");
            expect(() => {
                GTINCreator.validateAny("9521873000122", GTINLevel.RetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("19521873000129", GTINLevel.RetailConsumer);
            }).toThrow("GTIN not supported at retail consumer trade item level");
            expect(() => {
                GTINCreator.validateAny("9521873000160", GTINLevel.RetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("95216843", GTINLevel.RetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("95217800031", GTINLevel.RetailConsumer);
            }).toThrow("GTIN must be 13, 12, 8, or 14 digits long");
            expect(() => {
                GTINCreator.validateAny("614141773985", GTINLevel.RetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("0614141773985", GTINLevel.RetailConsumer);
            }).toThrow("GTIN-13 at retail consumer trade item level can't start with zero");
            expect(() => {
                GTINCreator.validateAny("614141773991", GTINLevel.RetailConsumer);
            }).toThrow("Invalid check digit");
            expect(() => {
                GTINCreator.validateAny("09867539", GTINLevel.RetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("09800037", GTINLevel.RetailConsumer);
            }).toThrow("Invalid zero-suppressed GTIN-12");
            expect(() => {
                GTINCreator.validateAny("9521873000122", GTINLevel.OtherThanRetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("19521873000129", GTINLevel.OtherThanRetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("9521873000160", GTINLevel.OtherThanRetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("95216843", GTINLevel.OtherThanRetailConsumer);
            }).toThrow("GTIN not supported at other than retail consumer trade item level");
            expect(() => {
                GTINCreator.validateAny("95217800031", GTINLevel.OtherThanRetailConsumer);
            }).toThrow("GTIN must be 13, 12, 8, or 14 digits long");
            expect(() => {
                GTINCreator.validateAny("614141773985", GTINLevel.OtherThanRetailConsumer);
            }).not.toThrow(RangeError);
            expect(() => {
                GTINCreator.validateAny("614141773991", GTINLevel.OtherThanRetailConsumer);
            }).toThrow("Invalid check digit");
            expect(() => {
                GTINCreator.validateAny("09867539", GTINLevel.OtherThanRetailConsumer);
            }).toThrow("GTIN not supported at other than retail consumer trade item level");
            expect(() => {
                GTINCreator.validateAny("09800037", GTINLevel.OtherThanRetailConsumer);
            }).toThrow("Invalid zero-suppressed GTIN-12");
        });

        test("Normalization", () => {
            // GTIN-14.
            expect(GTINCreator.normalize("09526543219996")).toBe("9526543219996");
            expect(GTINCreator.normalize("00614141009992")).toBe("614141009992");
            expect(() => GTINCreator.normalize("00000001234505")).toThrow("Invalid zero-suppressed GTIN-12 as GTIN-14");
            expect(GTINCreator.normalize("00000095209999")).toBe("95209999");
            expect(GTINCreator.normalize("49526543219994")).toBe("49526543219994");

            // GTIN-13.
            expect(GTINCreator.normalize("9526543219996")).toBe("9526543219996");
            expect(GTINCreator.normalize("0614141009992")).toBe("614141009992");
            expect(() => GTINCreator.normalize("0000001234505")).toThrow("Invalid zero-suppressed GTIN-12 as GTIN-13");
            expect(GTINCreator.normalize("0000095209999")).toBe("95209999");

            // GTIN-12.
            expect(GTINCreator.normalize("614141009992")).toBe("614141009992");
            expect(GTINCreator.normalize("01234505")).toBe("012000003455");
            expect(() => GTINCreator.normalize("09800037")).toThrow("Invalid zero-suppressed GTIN-12");

            // GTIN-8.
            expect(GTINCreator.normalize("95209999")).toBe("95209999");
        });
    });
}

function testNonGTINNumericIdentificationKeyCreator(creator: NonGTINNumericIdentificationKeyCreator, preTestCallback?: () => void, postTestCallback?: () => void): void {
    testNumericIdentificationKeyCreator(creator, preTestCallback, postTestCallback);
}

function testSerializableNumericIdentificationKeyCreator(creator: SerializableNumericIdentificationKeyCreator): void {
    testNonGTINNumericIdentificationKeyCreator(creator, undefined, () => {
        test("Serialization", () => {
            const identificationKey = creator.create(0, true);
            const serial = "12345678";
            const serializedIdentificationKey = identificationKey + serial;
            const serials = [serial, "23456789", "34567890", "456789012"];
            const serializedIdentificationKeys = serials.map(serial => identificationKey + serial);

            expect(creator.createSerialized(0, serial, true)).toBe(serializedIdentificationKey);
            expect(creator.concatenate(identificationKey, serial)).toBe(serializedIdentificationKey);
            expect(Array.from(creator.createSerialized(0, serials, true))).toStrictEqual(serializedIdentificationKeys);
            expect(Array.from(creator.concatenate(identificationKey, serials))).toStrictEqual(serializedIdentificationKeys);

            const fullLengthSerial = "0".repeat(creator.serialComponentLength);
            const fullLengthPlusOneSerial = fullLengthSerial + "0";
            const fullLengthPlusOneSerialErrorMessage = `Length ${creator.serialComponentLength + 1} of serial component must be less than or equal to ${creator.serialComponentLength}`;

            expect(() => creator.createSerialized(0, fullLengthSerial, true)).not.toThrow(RangeError);
            expect(() => creator.concatenate(identificationKey, fullLengthSerial)).not.toThrow(RangeError);
            expect(() => Array.from(creator.createSerialized(0, [...serials, fullLengthSerial], true))).not.toThrow(RangeError);
            expect(() => Array.from(creator.concatenate(identificationKey, [...serials, fullLengthSerial]))).not.toThrow(RangeError);
            expect(() => creator.createSerialized(0, fullLengthPlusOneSerial, true)).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => creator.concatenate(identificationKey, fullLengthPlusOneSerial)).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => Array.from(creator.createSerialized(0, [...serials, fullLengthPlusOneSerial], true))).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => Array.from(creator.concatenate(identificationKey, [...serials, fullLengthPlusOneSerial]))).toThrow(fullLengthPlusOneSerialErrorMessage);

            let invalidSerial: string;

            switch (creator.serialComponentCharacterSet) {
                case ContentCharacterSet.Numeric:
                    invalidSerial = "1234A5678";
                    break;

                case ContentCharacterSet.AI82:
                    invalidSerial = "ABCD~1234";
                    break;

                case ContentCharacterSet.AI39:
                    invalidSerial = "ABCD%1234";
                    break;
            }

            const invalidSerialErrorMessage = `Invalid character '${invalidSerial.charAt(4)}' at position 5 of serial component`;

            expect(() => creator.createSerialized(0, invalidSerial, true)).toThrow(invalidSerialErrorMessage);
            expect(() => creator.concatenate(identificationKey, invalidSerial)).toThrow(invalidSerialErrorMessage);
            expect(() => Array.from(creator.createSerialized(0, [...serials, invalidSerial], true))).toThrow(invalidSerialErrorMessage);
            expect(() => Array.from(creator.concatenate(identificationKey, [...serials, invalidSerial]))).toThrow(invalidSerialErrorMessage);
        });
    });
}

const TEST_REFERENCE_LENGTH = 2;

function testNonNumericIdentificationKeyCreator(creator: NonNumericIdentificationKeyCreator): void {
    describe(creator.identificationKeyType, () => {
        const prefix = creator.prefix;
        const prefixLength = prefix.length;
        const referenceLength = creator.length - prefixLength - 2 * Number(creator.requiresCheckCharacterPair);
        const referenceCount = creator.referenceCreator.characterSetSize ** TEST_REFERENCE_LENGTH;
        const referenceSubstringStart = prefixLength;
        const referenceSubstringEnd = prefixLength + TEST_REFERENCE_LENGTH;

        test("Straight", () => {
            expect(creator.referenceLength).toBe(referenceLength);

            let sequenceCount = 0;

            Iterator.from(creator.create(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, new Sequencer(0, referenceCount)))).forEach((identificationKey, index) => {
                expect(() => {
                    creator.validate(identificationKey);
                }).not.toThrow(RangeError);

                expect(Number(creator.referenceCreator.valueFor(identificationKey.substring(referenceSubstringStart, referenceSubstringEnd)))).toBe(index);

                expect(identificationKey.length).toBeLessThanOrEqual(creator.length);
                expect(identificationKey.substring(0, prefixLength)).toBe(prefix);
                expect(!creator.requiresCheckCharacterPair || hasValidCheckCharacterPair(identificationKey)).toBe(true);

                expect(identificationKey).toBe(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, index, Exclusion.None, undefined, reference => creator.create(reference)));

                sequenceCount++;
            });

            expect(sequenceCount).toBe(referenceCount);
        });

        test("Sparse", () => {
            let sequential = true;

            let sequenceCount = 0;

            Iterator.from(creator.create(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, new Sequencer(0, referenceCount), Exclusion.None, 123456n))).forEach((identificationKey, index) => {
                expect(() => {
                    creator.validate(identificationKey);
                }).not.toThrow(RangeError);

                expect(Number(creator.referenceCreator.valueFor(identificationKey.substring(referenceSubstringStart, referenceSubstringEnd), Exclusion.None, 123456n))).toBe(index);

                sequential = sequential && Number(creator.referenceCreator.valueFor(identificationKey.substring(referenceSubstringStart, referenceSubstringEnd))) === index;

                expect(identificationKey.length).toBeLessThanOrEqual(creator.length);
                expect(identificationKey.substring(0, prefixLength)).toBe(prefix);
                expect(!creator.requiresCheckCharacterPair || hasValidCheckCharacterPair(identificationKey)).toBe(true);

                expect(identificationKey).toBe(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, index, Exclusion.None, 123456n, reference => creator.create(reference)));

                sequenceCount++;
            });

            expect(sequential).toBe(false);
            expect(sequenceCount).toBe(referenceCount);
        });

        test("Position offset", () => {
            expect(() => {
                creator.validate(creator.create("ABC123"), {
                    positionOffset: 4
                });
            }).not.toThrow(RangeError);
        });

        test("Not all numeric", () => {
            expect(() => {
                creator.validate(creator.create("01234"), {
                    exclusion: Exclusion.AllNumeric
                });
            }).toThrow("Reference can't be all-numeric");

            expect(() => {
                creator.validate(creator.create("O1234"), {
                    exclusion: Exclusion.AllNumeric
                });
            }).not.toThrow(RangeError);
        });
    });
}

let prefixManager: PrefixManager;

prefixManager = PrefixManager.get(PrefixType.GS1CompanyPrefix, "952123456");

testGTINCreator(prefixManager.gtinCreator);

prefixManager = PrefixManager.get(PrefixType.UPCCompanyPrefix, "61414112");

testGTINCreator(prefixManager.gtinCreator);

prefixManager = PrefixManager.get(PrefixType.GS18Prefix, "9521");

testGTINCreator(prefixManager.gtinCreator);

testGTINValidationAndNormalization();

prefixManager = PrefixManager.get(PrefixType.GS1CompanyPrefix, "952123456");

testNonGTINNumericIdentificationKeyCreator(prefixManager.glnCreator);
testSerializableNumericIdentificationKeyCreator(prefixManager.graiCreator);
testNonNumericIdentificationKeyCreator(prefixManager.giaiCreator);
testSerializableNumericIdentificationKeyCreator(prefixManager.gdtiCreator);
testNonNumericIdentificationKeyCreator(prefixManager.gincCreator);
testSerializableNumericIdentificationKeyCreator(prefixManager.gcnCreator);
testNonNumericIdentificationKeyCreator(prefixManager.cpidCreator);
testNonNumericIdentificationKeyCreator(prefixManager.gmnCreator);

prefixManager = PrefixManager.get(PrefixType.GS1CompanyPrefix, "952123456789");

testNonGTINNumericIdentificationKeyCreator(prefixManager.ssccCreator);
testNonGTINNumericIdentificationKeyCreator(prefixManager.gsrnCreator);
testNonGTINNumericIdentificationKeyCreator(prefixManager.gsinCreator);
