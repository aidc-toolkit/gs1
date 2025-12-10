import { describe, expect, test } from "vitest";
import {
    GTINBaseLengths,
    type IdentifierCreator,
    IdentifierTypes,
    IdentifierValidators,
    PrefixManager,
    PrefixTypes
} from "../src/index.js";

describe("Mixins", () => {
    function validate<TValidator extends object, TCreator extends TValidator & IdentifierCreator>(validator: TValidator, creator: TCreator): void {
        for (const key of Object.keys(validator)) {
            expect(key in creator, key).toBe(true);
        }
    }

    const prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234");

    test(IdentifierTypes.GTIN, () => {
        validate(IdentifierValidators.GTIN[GTINBaseLengths.GTIN13], prefixManager.gtinCreator);
    });

    test("Non-serialized numeric", () => {
        validate(IdentifierValidators.GLN, prefixManager.glnCreator);
    });

    test("Serialized numeric", () => {
        validate(IdentifierValidators.GRAI, prefixManager.graiCreator);
    });

    test("Non-numeric", () => {
        validate(IdentifierValidators.GIAI, prefixManager.giaiCreator);
    });
});
