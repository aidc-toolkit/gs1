import { describe, expect, test } from "vitest";
import { hasValidCheckDigit, isValidPriceOrWeightCheckDigit, type RCNReference } from "../src/index.js";
import { VariableMeasure } from "../src/index.js";

describe("Variable measure RCN", () => {
    test("RCN-12", () => {
        const rcn1 = VariableMeasure.createRCN("2IIIIIVPPPPC", 12345, 4321);

        expect(rcn1.length).toBe(12);
        expect(rcn1.charAt(0)).toBe("2");
        expect(rcn1.substring(1, 6)).toBe("12345");
        expect(rcn1.substring(7, 11)).toBe("4321");
        expect(isValidPriceOrWeightCheckDigit(rcn1.substring(7, 11), rcn1.charAt(6))).toBe(true);
        expect(hasValidCheckDigit(rcn1)).toBe(true);
        expect(() => {
            VariableMeasure.parseRCN("2IIIIIVPPPPC", rcn1);
        }).not.toThrow(RangeError);
        expect(VariableMeasure.parseRCN("2IIIIIVPPPPC", rcn1)).toEqual({
            itemReference: 12345,
            priceOrWeight: 4321
        } satisfies RCNReference);

        const rcn2 = VariableMeasure.createRCN("2IIIIPPPPPVC", 1234, 54321);

        expect(rcn2.length).toBe(12);
        expect(rcn2.charAt(0)).toBe("2");
        expect(rcn2.substring(1, 5)).toBe("1234");
        expect(rcn2.substring(5, 10)).toBe("54321");
        expect(isValidPriceOrWeightCheckDigit(rcn2.substring(5, 10), rcn2.charAt(10))).toBe(true);
        expect(hasValidCheckDigit(rcn2)).toBe(true);
        expect(() => {
            VariableMeasure.parseRCN("2IIIIPPPPPVC", rcn2);
        }).not.toThrow(RangeError);
        expect(VariableMeasure.parseRCN("2IIIIPPPPPVC", rcn2)).toEqual({
            itemReference: 1234,
            priceOrWeight: 54321
        } satisfies RCNReference);

        const rcn3 = VariableMeasure.createRCN("2PPPPPIIIIIC", 12345, 54321);

        expect(rcn3.length).toBe(12);
        expect(rcn3.charAt(0)).toBe("2");
        expect(rcn3.substring(1, 6)).toBe("54321");
        expect(rcn3.substring(6, 11)).toBe("12345");
        expect(hasValidCheckDigit(rcn3)).toBe(true);
        expect(() => {
            VariableMeasure.parseRCN("2PPPPPIIIIIC", rcn3);
        }).not.toThrow(RangeError);
        expect(VariableMeasure.parseRCN("2PPPPPIIIIIC", rcn3)).toEqual({
            itemReference: 12345,
            priceOrWeight: 54321
        } satisfies RCNReference);

        expect(() => VariableMeasure.createRCN("3PPPPPIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("20PPPPPIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPPPPIIIIII", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPPPPIIIIKC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPPPPIIPIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPIPPIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPPPPIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPPPPIIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPPPPPPPPPC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2IIIIIIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");

        expect(() => {
            VariableMeasure.parseRCN("3PPPPPIIIIIC", "2543211234540");
        }).toThrow("RCN length must match format length");
        expect(() => {
            VariableMeasure.parseRCN("3PPPPPIIIIIC", "25432112345");
        }).toThrow("RCN length must match format length");
        expect(() => {
            VariableMeasure.parseRCN("3PPPPPIIIIIC", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("20PPPPPIIIIC", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2PPPPPIIIIII", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2PPPPPIIIIKC", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2PPPPPIIPIIC", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2PPIPPIIIIIC", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2PPPPPIIIIC", "25432112345");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2PPPPPIIIIIIC", "2543211234540");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2PPPPPPPPPPC", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("2IIIIIIIIIIC", "254321123454");
        }).toThrow("Invalid variable measure RCN format");
    });

    test("RCN-13", () => {
        const rcn1 = VariableMeasure.createRCN("24IIIIIVPPPPC", 12345, 4321);

        expect(rcn1.length).toBe(13);
        expect(rcn1.substring(0, 2)).toBe("24");
        expect(rcn1.substring(2, 7)).toBe("12345");
        expect(rcn1.substring(8, 12)).toBe("4321");
        expect(isValidPriceOrWeightCheckDigit(rcn1.substring(8, 12), rcn1.charAt(7))).toBe(true);
        expect(hasValidCheckDigit(rcn1)).toBe(true);
        expect(() => {
            VariableMeasure.parseRCN("24IIIIIVPPPPC", rcn1);
        }).not.toThrow(RangeError);
        expect(VariableMeasure.parseRCN("24IIIIIVPPPPC", rcn1)).toEqual({
            itemReference: 12345,
            priceOrWeight: 4321
        } satisfies RCNReference);

        const rcn2 = VariableMeasure.createRCN("21IIIIPPPPPVC", 1234, 54321);

        expect(rcn2.length).toBe(13);
        expect(rcn2.substring(0, 2)).toBe("21");
        expect(rcn2.substring(2, 6)).toBe("1234");
        expect(rcn2.substring(6, 11)).toBe("54321");
        expect(isValidPriceOrWeightCheckDigit(rcn2.substring(6, 11), rcn2.charAt(11))).toBe(true);
        expect(hasValidCheckDigit(rcn2)).toBe(true);
        expect(() => {
            VariableMeasure.parseRCN("21IIIIPPPPPVC", rcn2);
        }).not.toThrow(RangeError);
        expect(VariableMeasure.parseRCN("21IIIIPPPPPVC", rcn2)).toEqual({
            itemReference: 1234,
            priceOrWeight: 54321
        } satisfies RCNReference);

        const rcn3 = VariableMeasure.createRCN("27PPPPPIIIIIC", 12345, 54321);

        expect(rcn3.length).toBe(13);
        expect(rcn3.substring(0, 2)).toBe("27");
        expect(rcn3.substring(2, 7)).toBe("54321");
        expect(rcn3.substring(7, 12)).toBe("12345");
        expect(hasValidCheckDigit(rcn3)).toBe(true);
        expect(() => {
            VariableMeasure.parseRCN("27PPPPPIIIIIC", rcn3);
        }).not.toThrow(RangeError);
        expect(VariableMeasure.parseRCN("27PPPPPIIIIIC", rcn3)).toEqual({
            itemReference: 12345,
            priceOrWeight: 54321
        } satisfies RCNReference);

        expect(() => VariableMeasure.createRCN("30PPPPPIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("2PPPPPPIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("20PPPPPIIIIII", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("21PPPPPIIIIKC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("22PPPPPIIPIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("23PPIPPIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("24PPPPPIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("25PPPPPIIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("26PPPPPPPPPPC", 12345, 54321)).toThrow("Invalid variable measure RCN format");
        expect(() => VariableMeasure.createRCN("27IIIIIIIIIIC", 12345, 54321)).toThrow("Invalid variable measure RCN format");

        expect(() => {
            VariableMeasure.parseRCN("30PPPPPIIIIIC", "27543211234570");
        }).toThrow("RCN length must match format length");
        expect(() => {
            VariableMeasure.parseRCN("30PPPPPIIIIIC", "275432112345");
        }).toThrow("RCN length must match format length");
        expect(() => {
            VariableMeasure.parseRCN("30PPPPPIIIIIC", "2754321123457");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("20PPPPPIIIIII", "2754321123457");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("21PPPPPIIIIKC", "2754321123457");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("22PPPPPIIPIIC", "2754321123457");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("23PPIPPIIIIIC", "2754321123457");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("24PPPPPIIIIC", "275432112345");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("25PPPPPIIIIIIC", "27543211234570");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("26PPPPPPPPPPC", "2754321123457");
        }).toThrow("Invalid variable measure RCN format");
        expect(() => {
            VariableMeasure.parseRCN("27IIIIIIIIIIC", "2754321123457");
        }).toThrow("Invalid variable measure RCN format");
    });
});
