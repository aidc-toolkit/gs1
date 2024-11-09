import { I18NEnvironment, i18nInit } from "@aidc-toolkit/core";
import { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { describe, expect, test } from "vitest";
import {
    checkCharacterPair,
    checkDigit,
    checkDigitSum,
    fiveDigitPriceWeightCheckDigit,
    fourDigitPriceWeightCheckDigit,
    hasValidCheckCharacterPair,
    hasValidCheckDigit
} from "../src/index.js";

await i18nInit(I18NEnvironment.CLI, true);

describe("Check digit", () => {
    const testNumericString = "1234567890";

    test("Basic check digit sum", () => {
        expect(checkDigitSum(false, testNumericString)).toBe((1 + 3 + 5 + 7 + 9) * 1 + (2 + 4 + 6 + 8 + 0) * 3);
        expect(checkDigitSum(true, testNumericString)).toBe((1 + 3 + 5 + 7 + 9) * 3 + (2 + 4 + 6 + 8 + 0) * 1);
    });

    test("Calculation and validation", () => {
        const calculatedCheckDigit = String(9 - ((checkDigitSum(true, testNumericString) + 9) % 10));

        expect(checkDigitSum(true, testNumericString + calculatedCheckDigit) % 10).toBe(0);
        expect(checkDigit(testNumericString)).toBe(calculatedCheckDigit);
        expect(hasValidCheckDigit(testNumericString + checkDigit(testNumericString))).toBe(true);
        expect(hasValidCheckDigit(testNumericString.replace("5", "6") + calculatedCheckDigit)).toBe(false);
    });

    test("Exception", () => {
        const testNonNumericString = "123456789O";

        expect(() => checkDigitSum(false, testNonNumericString)).toThrow("Invalid character 'O' at position 10");
        expect(() => checkDigit(testNonNumericString)).toThrow("Invalid character 'O' at position 10");
        expect(() => hasValidCheckDigit(testNonNumericString)).toThrow("Invalid character 'O' at position 10");
    });
});

describe("Price/weight check digit", () => {
    function weight2Minus(characterIndex: number): number {
        const product = characterIndex * 2;

        return (product - Math.trunc(product / 10)) % 10;
    }

    function weight3(characterIndex: number): number {
        return characterIndex * 3 % 10;
    }

    function weight5Plus(characterIndex: number): number {
        const product = characterIndex * 5;

        return (product + Math.trunc(product / 10)) % 10;
    }

    function weight5Minus(characterIndex: number): number {
        const product = characterIndex * 5;

        return (product - Math.trunc(product / 10)) % 10;
    }

    function testFourDigitPriceWeightCheckDigit(s: string): void {
        // All character indexes are known to be defined.
        const characterIndexes = NUMERIC_CREATOR.characterIndexes(s) as number[];

        const sum = weight2Minus(characterIndexes[0]) + weight2Minus(characterIndexes[1]) + weight3(characterIndexes[2]) + weight5Minus(characterIndexes[3]);

        expect(fourDigitPriceWeightCheckDigit(s)).toBe(NUMERIC_CREATOR.character(sum * 3 % 10));
    }

    function testFiveDigitPriceWeightCheckDigit(s: string): void {
        // All character indexes are known to be defined.
        const characterIndexes = NUMERIC_CREATOR.characterIndexes(s) as number[];

        const sum = weight5Plus(characterIndexes[0]) + weight2Minus(characterIndexes[1]) + weight5Minus(characterIndexes[2]) + weight5Plus(characterIndexes[3]) + weight2Minus(characterIndexes[4]);

        expect(weight5Minus(Number(fiveDigitPriceWeightCheckDigit(s)))).toBe(9 - (sum + 9) % 10);
    }

    test("Four-digit", () => {
        testFourDigitPriceWeightCheckDigit("0123");
        testFourDigitPriceWeightCheckDigit("1234");
        testFourDigitPriceWeightCheckDigit("2345");
        testFourDigitPriceWeightCheckDigit("3456");
        testFourDigitPriceWeightCheckDigit("4567");
        testFourDigitPriceWeightCheckDigit("5678");
        testFourDigitPriceWeightCheckDigit("6789");
        testFourDigitPriceWeightCheckDigit("7890");
        testFourDigitPriceWeightCheckDigit("8901");
        testFourDigitPriceWeightCheckDigit("9012");

        expect(() => fourDigitPriceWeightCheckDigit("l234")).toThrow("Invalid character 'l' at position 1");
        expect(() => fourDigitPriceWeightCheckDigit("123")).toThrow("String for price or weight sum must be exactly 4 characters");
        expect(() => fourDigitPriceWeightCheckDigit("12345")).toThrow("String for price or weight sum must be exactly 4 characters");
    });

    test("Five-digit", () => {
        testFiveDigitPriceWeightCheckDigit("01234");
        testFiveDigitPriceWeightCheckDigit("12345");
        testFiveDigitPriceWeightCheckDigit("23456");
        testFiveDigitPriceWeightCheckDigit("34567");
        testFiveDigitPriceWeightCheckDigit("45678");
        testFiveDigitPriceWeightCheckDigit("56789");
        testFiveDigitPriceWeightCheckDigit("67890");
        testFiveDigitPriceWeightCheckDigit("78901");
        testFiveDigitPriceWeightCheckDigit("89012");
        testFiveDigitPriceWeightCheckDigit("90123");

        expect(() => fiveDigitPriceWeightCheckDigit("l2345")).toThrow("Invalid character 'l' at position 1");
        expect(() => fiveDigitPriceWeightCheckDigit("1234")).toThrow("String for price or weight sum must be exactly 5 characters");
        expect(() => fiveDigitPriceWeightCheckDigit("123456")).toThrow("String for price or weight sum must be exactly 5 characters");
    });
});

describe("Check character pair", () => {
    test("Calculation and validation", () => {
        expect(checkCharacterPair("95212349521234")).toBe("R9");
        expect(checkCharacterPair("9521234ABCDEFabcdef")).toBe("8T");

        expect(checkCharacterPair("!\"%&'()*+,-./0123456789:;<=>")).toBe("TH");
        expect(checkCharacterPair("?ABCDEFGHIJKLMNOPQRSTUVWXYZ_")).toBe("EP");
        expect(checkCharacterPair("abcdefghijklmnopqrstuvwxyz")).toBe("5A");

        expect(hasValidCheckCharacterPair("95212349521234R9")).toBe(true);
        expect(hasValidCheckCharacterPair("9521234ABCDEFabcdef8T")).toBe(true);

        expect(hasValidCheckCharacterPair("!\"%&'()*+,-./0123456789:;<=>TH")).toBe(true);
        expect(hasValidCheckCharacterPair("?ABCDEFGHIJKLMNOPQRSTUVWXYZ_EP")).toBe(true);
        expect(hasValidCheckCharacterPair("abcdefghijklmnopqrstuvwxyz5A")).toBe(true);
        expect(hasValidCheckCharacterPair("abcdefghijklmnopqrstuvwxyz5B")).toBe(false);
        expect(hasValidCheckCharacterPair("abcdefghijklmnopqrstuvwxyz5~")).toBe(false);
    });

    test("Exception", () => {
        expect(() => checkCharacterPair("?ABCDEFGHIJKLMNOPQRSTUVWXYZ_!")).toThrow("Length 29 of string for check character pair must be less than or equal to 28");
        expect(() => checkCharacterPair("abcdefghijklmnopqrstuvwxyz~")).toThrow("Invalid character '~' at position 27");
        expect(() => hasValidCheckCharacterPair("~abcdefghijklmnopqrstuvwxyz")).toThrow("Invalid character '~' at position 1");
    });
});
