import { describe, expect, test } from "vitest";
import { type GTINLevel, GTINLevels, GTINValidator } from "../src/index.js";

interface GTINValidation {
    gtin: string;
    
    errorMessages: Record<GTINLevel, string | null>;
}

const GTIN_VALIDATIONS: GTINValidation[] = [
    // GTIN-13.
    {
        gtin: "9521873000122",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: null,
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // GTIN-13 as GTIN-14.
    {
        gtin: "09521873000122",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // GTIN-12.
    {
        gtin: "614141773985",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: null,
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // GTIN-12 as GTIN-13.
    {
        gtin: "0614141773985",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // GTIN-12 as GTIN-14.
    {
        gtin: "00614141773985",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // Zero-suppressed GTIN-12.
    {
        gtin: "09867539",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: null,
            [GTINLevels.OtherThanRetailConsumer]: "GTIN not supported at other than retail consumer trade item level"
        }
    },

    // GTIN-8.
    {
        gtin: "95216843",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: null,
            [GTINLevels.OtherThanRetailConsumer]: "GTIN not supported at other than retail consumer trade item level"
        }
    },

    // GTIN-8 as GTIN-12.
    {
        gtin: "000095216843",
        errorMessages: {
            [GTINLevels.Any]: "U.P.C. Company Prefix can't start with \"0000\"",
            [GTINLevels.RetailConsumer]: "U.P.C. Company Prefix can't start with \"0000\"",
            [GTINLevels.OtherThanRetailConsumer]: "U.P.C. Company Prefix can't start with \"0000\""
        }
    },

    // GTIN-8 as GTIN-13.
    {
        gtin: "0000095216843",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: "GTIN not supported at other than retail consumer trade item level"
        }
    },

    // GTIN-8 as GTIN-14.
    {
        gtin: "00000095216843",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: "GTIN not supported at other than retail consumer trade item level"
        }
    },

    // GTIN-14 from GTIN-13.
    {
        gtin: "19521873000129",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // GTIN-14 from GTIN-12.
    {
        gtin: "20614141773989",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // GTIN-14 from GTIN-8.
    {
        gtin: "30000095216844",
        errorMessages: {
            [GTINLevels.Any]: null,
            [GTINLevels.RetailConsumer]: "GTIN not supported at retail consumer trade item level",
            [GTINLevels.OtherThanRetailConsumer]: null
        }
    },

    // Invalid character in GTIN-13.
    {
        gtin: "9521873000l22",
        errorMessages: {
            [GTINLevels.Any]: "Invalid character 'l' at position 11",
            [GTINLevels.RetailConsumer]: "Invalid character 'l' at position 11",
            [GTINLevels.OtherThanRetailConsumer]: "Invalid character 'l' at position 11"
        }
    },

    // Invalid character in GTIN-14.
    {
        gtin: "30000O95216844",
        errorMessages: {
            [GTINLevels.Any]: "Invalid character 'O' at position 6",
            [GTINLevels.RetailConsumer]: "Invalid character 'O' at position 6",
            [GTINLevels.OtherThanRetailConsumer]: "Invalid character 'O' at position 6"
        }
    },

    // Invalid length.
    {
        gtin: "95217800031",
        errorMessages: {
            [GTINLevels.Any]: "GTIN must be 13, 12, 8, or 14 digits long",
            [GTINLevels.RetailConsumer]: "GTIN must be 13, 12, 8, or 14 digits long",
            [GTINLevels.OtherThanRetailConsumer]: "GTIN must be 13, 12, 8, or 14 digits long"
        }
    },

    // Invalid check digit.
    {
        gtin: "614141773991",
        errorMessages: {
            [GTINLevels.Any]: "Invalid check digit",
            [GTINLevels.RetailConsumer]: "Invalid check digit",
            [GTINLevels.OtherThanRetailConsumer]: "Invalid check digit"
        }
    },

    // Invalid zero-suppressed GTIN-12.
    {
        gtin: "09800037",
        errorMessages: {
            [GTINLevels.Any]: "Invalid zero-suppressed GTIN-12",
            [GTINLevels.RetailConsumer]: "Invalid zero-suppressed GTIN-12",
            [GTINLevels.OtherThanRetailConsumer]: "Invalid zero-suppressed GTIN-12"
        }
    }
];

describe("GTIN validation and normalization", () => {
    test("Validation", () => {
        for (const gtinValidation of GTIN_VALIDATIONS) {
            const gtin = gtinValidation.gtin;

            for (const gtinLevel of Object.values(GTINLevels)) {
                const expectMessage = `${gtin}:${gtinLevel}`;
                const errorMessage = gtinValidation.errorMessages[gtinLevel];

                if (errorMessage === null) {
                    expect(() => {
                        GTINValidator.validateAny(gtin, gtinLevel);
                    }, expectMessage).not.toThrow(RangeError);
                } else {
                    expect(() => {
                        GTINValidator.validateAny(gtin, gtinLevel);
                    }, expectMessage).toThrow(errorMessage);
                }
            }
        }
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
