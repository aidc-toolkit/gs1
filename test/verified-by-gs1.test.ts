import { describe, expect, test } from "vitest";
import { type IdentifierType, IdentifierTypes, verifiedByGS1 } from "../src/index.js";

describe("Verified by GS1", () => {
    function testVerifiedByGS1(identifierType: IdentifierType, identifier: string, normalizedIdentifier: string, useKeyTypeParameter: boolean, text: string, details?: string): void {
        expect(verifiedByGS1(identifierType, identifier, text, details)).toEqual({
            reference: `https://www.gs1.org/services/verified-by-gs1/results?${!useKeyTypeParameter ? identifierType.toLowerCase() : "key"}=${normalizedIdentifier}${!useKeyTypeParameter ? "" : `&key_type=${identifierType.toLowerCase()}`}`,
            text,
            details
        });
    }

    test("GTIN", () => {
        testVerifiedByGS1(IdentifierTypes.GTIN, "9521873000122", "9521873000122", false, "9521873000122");
        testVerifiedByGS1(IdentifierTypes.GTIN, "09521873000122", "9521873000122", false, "09521873000122");
        testVerifiedByGS1(IdentifierTypes.GTIN, "19521873000129", "19521873000129", false, "19521873000129", "Let's add some details");
        testVerifiedByGS1(IdentifierTypes.GTIN, "95216843", "95216843", false, "95216843", "Let's add some details");
        testVerifiedByGS1(IdentifierTypes.GTIN, "00000095216843", "95216843", false, "00000095216843");
        expect(() => {
            verifiedByGS1(IdentifierTypes.GTIN, "95217800031");
        }).toThrow(RangeError);
        testVerifiedByGS1(IdentifierTypes.GTIN, "614141773985", "614141773985", false, "614141773985", "Let's add some details");
        testVerifiedByGS1(IdentifierTypes.GTIN, "0614141773985", "614141773985", false, "0614141773985");
        expect(() => {
            verifiedByGS1(IdentifierTypes.GTIN, "614141773991");
        }).toThrow(RangeError);
        testVerifiedByGS1(IdentifierTypes.GTIN, "09867539", "098600000759", false, "09867539");
        expect(() => {
            verifiedByGS1(IdentifierTypes.GTIN, "09800037");
        }).toThrow(RangeError);
    });

    test("Non-GTIN", () => {
        testVerifiedByGS1(IdentifierTypes.GLN, "9521873000122", "9521873000122", false, "9521873000122");
        expect(() => {
            verifiedByGS1(IdentifierTypes.GLN, "9521873000121");
        }).toThrow(RangeError);
        testVerifiedByGS1(IdentifierTypes.SSCC, "395218735078188407", "395218735078188407", true, "395218735078188407");
        expect(() => {
            verifiedByGS1(IdentifierTypes.SSCC, "39521873507818840");
        }).toThrow(RangeError);
        testVerifiedByGS1(IdentifierTypes.GDTI, "9521873295719ABCD1234", "9521873295719ABCD1234", true, "9521873295719ABCD1234");
        expect(() => {
            verifiedByGS1(IdentifierTypes.GDTI, "952187329571ABCD1234");
        }).toThrow(RangeError);
        testVerifiedByGS1(IdentifierTypes.GIAI, "9521873ABCD1234", "9521873ABCD1234", true, "9521873ABCD1234");
        expect(() => {
            verifiedByGS1(IdentifierTypes.GIAI, "9521873ABCD~1234");
        }).toThrow(RangeError);
        testVerifiedByGS1(IdentifierTypes.GMN, "9521873ABCDEFR7", "9521873ABCDEFR7", true, "9521873ABCDEFR7");
        expect(() => {
            verifiedByGS1(IdentifierTypes.GMN, "9521873ABCDEFRR");
        }).toThrow(RangeError);
    });
});
