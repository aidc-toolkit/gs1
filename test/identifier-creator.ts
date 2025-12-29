import { expect } from "vitest";
import {
    ContentCharacterSets,
    type GTINLength,
    GTINLengths,
    IdentifierTypes,
    LeaderTypes,
    type PrefixManager,
    PrefixTypes
} from "../src/index.js";
import { validateGTINValidator } from "./gtin-validator.test.js";
import { validateNonNumericIdentifierValidator } from "./non-numeric-identifier-validator.js";
import { validateNonSerializableNumericIdentifierValidator } from "./non-serializable-numeric-identifier-validator.js";
import { validateSerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator.js";

export function validateIdentifierCreators(prefixManager: PrefixManager): void {
    let gtinLength: GTINLength;

    switch (prefixManager.prefixType) {
        case PrefixTypes.GS1CompanyPrefix:
            expect(prefixManager.prefix).toBe(prefixManager.gs1CompanyPrefix);
            gtinLength = GTINLengths.GTIN13;
            break;

        case PrefixTypes.UPCCompanyPrefix:
            expect(prefixManager.prefix).toBe(prefixManager.upcCompanyPrefix);
            gtinLength = GTINLengths.GTIN12;
            break;

        case PrefixTypes.GS18Prefix:
            expect(prefixManager.prefix).toBe(prefixManager.gs18Prefix);
            gtinLength = GTINLengths.GTIN8;
            break;
    }

    // Validate creator caching.
    expect(prefixManager.gtinCreator).toBe(prefixManager.gtinCreator);

    validateGTINValidator(prefixManager.gtinCreator, true, gtinLength);

    if (prefixManager.prefixType !== PrefixTypes.GS18Prefix) {
        // Validate creator caching.
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

        validateNonSerializableNumericIdentifierValidator(prefixManager.glnCreator, true, IdentifierTypes.GLN, 13, LeaderTypes.None);
        validateNonSerializableNumericIdentifierValidator(prefixManager.ssccCreator, true, IdentifierTypes.SSCC, 18, LeaderTypes.ExtensionDigit);
        validateSerializableNumericIdentifierValidator(prefixManager.graiCreator, true, IdentifierTypes.GRAI, 13, LeaderTypes.None, 16, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(prefixManager.giaiCreator, true, IdentifierTypes.GIAI, 30, ContentCharacterSets.AI82, false);
        validateNonSerializableNumericIdentifierValidator(prefixManager.gsrnCreator, true, IdentifierTypes.GSRN, 18, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(prefixManager.gdtiCreator, true, IdentifierTypes.GDTI, 13, LeaderTypes.None, 17, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(prefixManager.gincCreator, true, IdentifierTypes.GINC, 30, ContentCharacterSets.AI82, false);
        validateNonSerializableNumericIdentifierValidator(prefixManager.gsinCreator, true, IdentifierTypes.GSIN, 17, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(prefixManager.gcnCreator, true, IdentifierTypes.GCN, 13, LeaderTypes.None, 12, ContentCharacterSets.Numeric);
        validateNonNumericIdentifierValidator(prefixManager.cpidCreator, true, IdentifierTypes.CPID, 30, ContentCharacterSets.AI39, false);
        validateNonNumericIdentifierValidator(prefixManager.gmnCreator, true, IdentifierTypes.GMN, 25, ContentCharacterSets.AI82, true);
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

export function testIdentifierCreatorCallback(callback?: () => void): void {
    if (callback !== undefined) {
        callback();
    }
}
