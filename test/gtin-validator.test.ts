import { describe, expect, test } from "vitest";
import {
    type GTINBaseType,
    GTINLevels,
    GTINTypes,
    GTINValidator,
    IdentifierTypes,
    LeaderTypes,
    type PrefixType,
    PrefixTypes
} from "../src";
import { validateNumericIdentifierValidator } from "./numeric-identifier-validator";

export function validateGTINValidator(validator: GTINValidator, isCreator: boolean, gtinBaseType: GTINBaseType): void {
    let prefixType: PrefixType;

    switch (gtinBaseType) {
        case GTINTypes.GTIN13:
            prefixType = PrefixTypes.GS1CompanyPrefix;
            break;

        case GTINTypes.GTIN12:
            prefixType = PrefixTypes.UPCCompanyPrefix;
            break;

        case GTINTypes.GTIN8:
            prefixType = PrefixTypes.GS18Prefix;
            break;
    }

    validateNumericIdentifierValidator(validator, IdentifierTypes.GTIN, prefixType, gtinBaseType, LeaderTypes.IndicatorDigit);

    expect(validator.gtinType).toBe(gtinBaseType);
}

describe("GTIN validation and normalization", () => {
    test("Validation", () => {
        expect(() => {
            GTINValidator.validateAny("9521873000122", GTINLevels.Any);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("19521873000129", GTINLevels.Any);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("9521873000160", GTINLevels.Any);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("95216843", GTINLevels.Any);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("95217800031", GTINLevels.Any);
        }).toThrow("GTIN must be 13, 12, 8, or 14 digits long");
        expect(() => {
            GTINValidator.validateAny("614141773985", GTINLevels.Any);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("614141773991", GTINLevels.Any);
        }).toThrow("Invalid check digit");
        expect(() => {
            GTINValidator.validateAny("09867539", GTINLevels.Any);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("09800037", GTINLevels.Any);
        }).toThrow("Invalid zero-suppressed GTIN-12");
        expect(() => {
            GTINValidator.validateAny("9521873000122", GTINLevels.RetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("19521873000129", GTINLevels.RetailConsumer);
        }).toThrow("GTIN not supported at retail consumer trade item level");
        expect(() => {
            GTINValidator.validateAny("9521873000160", GTINLevels.RetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("95216843", GTINLevels.RetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("95217800031", GTINLevels.RetailConsumer);
        }).toThrow("GTIN must be 13, 12, 8, or 14 digits long");
        expect(() => {
            GTINValidator.validateAny("614141773985", GTINLevels.RetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("0614141773985", GTINLevels.RetailConsumer);
        }).toThrow("GTIN-13 at retail consumer trade item level can't start with zero");
        expect(() => {
            GTINValidator.validateAny("614141773991", GTINLevels.RetailConsumer);
        }).toThrow("Invalid check digit");
        expect(() => {
            GTINValidator.validateAny("09867539", GTINLevels.RetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("09800037", GTINLevels.RetailConsumer);
        }).toThrow("Invalid zero-suppressed GTIN-12");
        expect(() => {
            GTINValidator.validateAny("9521873000122", GTINLevels.OtherThanRetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("19521873000129", GTINLevels.OtherThanRetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("9521873000160", GTINLevels.OtherThanRetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("95216843", GTINLevels.OtherThanRetailConsumer);
        }).toThrow("GTIN not supported at other than retail consumer trade item level");
        expect(() => {
            GTINValidator.validateAny("95217800031", GTINLevels.OtherThanRetailConsumer);
        }).toThrow("GTIN must be 13, 12, 8, or 14 digits long");
        expect(() => {
            GTINValidator.validateAny("614141773985", GTINLevels.OtherThanRetailConsumer);
        }).not.toThrow(RangeError);
        expect(() => {
            GTINValidator.validateAny("614141773991", GTINLevels.OtherThanRetailConsumer);
        }).toThrow("Invalid check digit");
        expect(() => {
            GTINValidator.validateAny("09867539", GTINLevels.OtherThanRetailConsumer);
        }).toThrow("GTIN not supported at other than retail consumer trade item level");
        expect(() => {
            GTINValidator.validateAny("09800037", GTINLevels.OtherThanRetailConsumer);
        }).toThrow("Invalid zero-suppressed GTIN-12");
    });

    test("Normalization", () => {
        // GTIN-14.
        expect(GTINValidator.normalize("09526543219996")).toBe("9526543219996");
        expect(GTINValidator.normalize("00614141009992")).toBe("614141009992");
        expect(() => GTINValidator.normalize("00000001234505")).toThrow("Invalid zero-suppressed GTIN-12 as GTIN-14");
        expect(GTINValidator.normalize("00000095209999")).toBe("95209999");
        expect(GTINValidator.normalize("49526543219994")).toBe("49526543219994");

        // GTIN-13.
        expect(GTINValidator.normalize("9526543219996")).toBe("9526543219996");
        expect(GTINValidator.normalize("0614141009992")).toBe("614141009992");
        expect(() => GTINValidator.normalize("0000001234505")).toThrow("Invalid zero-suppressed GTIN-12 as GTIN-13");
        expect(GTINValidator.normalize("0000095209999")).toBe("95209999");

        // GTIN-12.
        expect(GTINValidator.normalize("614141009992")).toBe("614141009992");
        expect(GTINValidator.normalize("01234505")).toBe("012000003455");
        expect(() => GTINValidator.normalize("09800037")).toThrow("Invalid zero-suppressed GTIN-12");

        // GTIN-8.
        expect(GTINValidator.normalize("95209999")).toBe("95209999");
    });
});
