import { Sequence } from "@aidc-toolkit/utility";
import { describe, expect, test } from "vitest";
import { PrefixManager, PrefixTypes } from "../src";

describe("Sparse creation", () => {
    const prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234");

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

    const sparseGTINs = Array.from(prefixManager.gtinCreator.create(new Sequence(0, 10), true));
    const straightGTINs = Array.from(prefixManager.gtinCreator.create(new Sequence(0, 10)));

    test("Tweak factor 0", () => {
        expect(sparseGTINs).toStrictEqual(straightGTINs);
    });

    prefixManager.resetTweakFactor();
});
