import { describe, expect, test } from "vitest";
import {
    type GTINValidator,
    type IdentifierCreator,
    IdentifierTypes,
    type IdentifierValidator,
    IdentifierValidators,
    PrefixManager,
    PrefixTypes
} from "../src/index.js";

describe("Mixins", () => {
    function validate<TIdentifierValidator extends IdentifierValidator, TIdentifierCreator extends TIdentifierValidator & IdentifierCreator>(validator: TIdentifierValidator, creator: TIdentifierCreator): void {
        for (const key of Object.keys(validator)) {
            expect(key in creator, key).toBe(true);
        }
    }

    const prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234");

    test(IdentifierTypes.GTIN, () => {
        validate(IdentifierValidators.GTIN[PrefixTypes.GS1CompanyPrefix] as GTINValidator, prefixManager.gtinCreator);
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
