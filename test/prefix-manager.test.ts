import { describe, expect, test } from "vitest";
import { PrefixManager, PrefixTypes } from "../src/index.js";
import { validateIdentifierCreators } from "./identifier-creator.js";

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
        expect(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234")).toBe(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234"));

        expect(PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "614141")).toBe(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "0614141"));

        expect(PrefixManager.get(PrefixTypes.GS18Prefix, "952")).toBe(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "00000952"));
    });

    test("GS1 Company Prefix 9521234", () => {
        prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234");

        expect(prefixManager.prefixType).toBe(PrefixTypes.GS1CompanyPrefix);
        expect(prefixManager.prefix).toBe("9521234");
        expect(prefixManager.gs1CompanyPrefix).toBe(prefixManager.prefix);
        expect(prefixManager.upcCompanyPrefix).toBeUndefined();
        expect(prefixManager.gs18Prefix).toBeUndefined();

        validateGTINStartsWithPrefix(13);
        validateNonGTINStartsWithGS1CompanyPrefix();

        validateIdentifierCreators(prefixManager);
    });

    test("U.P.C. Company Prefix 614141", () => {
        prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "0614141");

        expect(prefixManager.prefixType).toBe(PrefixTypes.UPCCompanyPrefix);
        expect(prefixManager.prefix).toBe("614141");
        expect(prefixManager.gs1CompanyPrefix).toBe("0" + prefixManager.prefix);
        expect(prefixManager.upcCompanyPrefix).toBe(prefixManager.prefix);
        expect(prefixManager.gs18Prefix).toBeUndefined();

        validateGTINStartsWithPrefix(12);
        validateNonGTINStartsWithGS1CompanyPrefix();

        validateIdentifierCreators(prefixManager);
    });

    test("GS1-8 Prefix 952", () => {
        prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "00000952");

        expect(prefixManager.prefixType).toBe(PrefixTypes.GS18Prefix);
        expect(prefixManager.prefix).toBe("952");
        expect(prefixManager.gs1CompanyPrefix).toBe("00000" + prefixManager.prefix);
        expect(prefixManager.upcCompanyPrefix).toBeUndefined();
        expect(prefixManager.gs18Prefix).toBe(prefixManager.prefix);

        validateGTINStartsWithPrefix(8);

        validateIdentifierCreators(prefixManager);
    });

    test("Prefix validation", () => {
        expect(() => PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952")).toThrow("Length 3 of GS1 Company Prefix must be greater than or equal to 4");
        expect(() => PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9520")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123456789")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234567890")).toThrow("Length 13 of GS1 Company Prefix must be less than or equal to 12");

        expect(() => PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123A56789")).toThrow("Invalid character 'A' at position 7 of GS1 Company Prefix");

        expect(() => PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "6141")).toThrow("Length 4 of U.P.C. Company Prefix must be greater than or equal to 5");
        expect(() => PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "61414")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "61414112345")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "614141123456")).toThrow("Length 12 of U.P.C. Company Prefix must be less than or equal to 11");
        expect(() => PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "000614")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "000061")).toThrow("U.P.C. Company Prefix can't start with \"0000\"");

        expect(() => PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "00000952")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "000000952")).toThrow("GS1 Company Prefix can't start with \"000000\"");

        expect(() => PrefixManager.get(PrefixTypes.GS18Prefix, "952")).not.toThrow(RangeError);
        expect(() => PrefixManager.get(PrefixTypes.GS18Prefix, "0952")).toThrow("GS1-8 Prefix can't start with \"0\"");
    });
});
