import { describe, expect, test } from "vitest";
import {
    ContentCharacterSets,
    type GTINBaseLength,
    GTINLengths,
    type GTINValidator,
    type IdentifierType,
    IdentifierTypes,
    type IdentifierValidator,
    IdentifierValidators,
    isGTINValidator,
    isGTINValidators,
    isNonGTINNumericIdentifierValidator,
    isNonNumericIdentifierValidator,
    isNonSerializableNumericIdentifierValidator,
    isNumericIdentifierValidator,
    isSerializableNumericIdentifierValidator,
    LeaderTypes
} from "../src/index.js";
import { validateGTINValidator } from "./gtin-validator.js";
import { validateNonNumericIdentifierValidator } from "./non-numeric-identifier-validator.js";
import { validateNonSerializableNumericIdentifierValidator } from "./non-serializable-numeric-identifier-validator.js";
import { validateSerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator.js";

describe("Validators", () => {
    function validateMapping(identifierType: IdentifierType, expectedIdentifierValidatorsOrValidator: Readonly<Record<GTINBaseLength, GTINValidator>> | IdentifierValidator, ...isIdentifierValidatorTypes: Array<(validator: IdentifierValidator) => boolean>): void {
        test(identifierType, () => {
            const validatorsOrValidator = IdentifierValidators[identifierType];

            expect(validatorsOrValidator).toBe(expectedIdentifierValidatorsOrValidator);

            if (isGTINValidators(validatorsOrValidator)) {
                for (const prefixType of PrefixTypeValues) {
                    const validator = validatorsOrValidator[prefixType];

                    for (const isIdentifierValidatorType of isIdentifierValidatorTypes) {
                        expect(isIdentifierValidatorType(validator)).toBe(true);
                    }
                }
            } else {
                for (const isIdentifierValidatorType of isIdentifierValidatorTypes) {
                    expect(isIdentifierValidatorType(validatorsOrValidator)).toBe(true);
                }
            }
        });
    }

    describe("Mapping", () => {
        validateMapping(IdentifierTypes.GTIN, IdentifierValidators.GTIN, isNumericIdentifierValidator, isGTINValidator);
        validateMapping(IdentifierTypes.GLN, IdentifierValidators.GLN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isNonSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.SSCC, IdentifierValidators.SSCC, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isNonSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GRAI, IdentifierValidators.GRAI, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GIAI, IdentifierValidators.GIAI, isNonNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GSRN, IdentifierValidators.GSRN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isNonSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GDTI, IdentifierValidators.GDTI, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GINC, IdentifierValidators.GINC, isNonNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GSIN, IdentifierValidators.GSIN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isNonSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GCN, IdentifierValidators.GCN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.CPID, IdentifierValidators.CPID, isNonNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GMN, IdentifierValidators.GMN, isNonNumericIdentifierValidator);
    });

    test("Structure", () => {
        validateGTINValidator(IdentifierValidators.GTIN[GTINLengths.GTIN13], GTINLengths.GTIN13);
        validateGTINValidator(IdentifierValidators.GTIN[GTINLengths.GTIN12], GTINLengths.GTIN12);
        validateGTINValidator(IdentifierValidators.GTIN[GTINLengths.GTIN8], GTINLengths.GTIN8);
        validateNonSerializableNumericIdentifierValidator(IdentifierValidators.GLN, IdentifierTypes.GLN, 13, LeaderTypes.None);
        validateNonSerializableNumericIdentifierValidator(IdentifierValidators.SSCC, IdentifierTypes.SSCC, 18, LeaderTypes.ExtensionDigit);
        validateSerializableNumericIdentifierValidator(IdentifierValidators.GRAI, false, IdentifierTypes.GRAI, 13, LeaderTypes.None, 16, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(IdentifierValidators.GIAI, false, IdentifierTypes.GIAI, 30, ContentCharacterSets.AI82, false);
        validateNonSerializableNumericIdentifierValidator(IdentifierValidators.GSRN, IdentifierTypes.GSRN, 18, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(IdentifierValidators.GDTI, false, IdentifierTypes.GDTI, 13, LeaderTypes.None, 17, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(IdentifierValidators.GINC, false, IdentifierTypes.GINC, 30, ContentCharacterSets.AI82, false);
        validateNonSerializableNumericIdentifierValidator(IdentifierValidators.GSIN, IdentifierTypes.GSIN, 17, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(IdentifierValidators.GCN, false, IdentifierTypes.GCN, 13, LeaderTypes.None, 12, ContentCharacterSets.Numeric);
        validateNonNumericIdentifierValidator(IdentifierValidators.CPID, false, IdentifierTypes.CPID, 30, ContentCharacterSets.AI39, false);
        validateNonNumericIdentifierValidator(IdentifierValidators.GMN, false, IdentifierTypes.GMN, 25, ContentCharacterSets.AI82, true);
    });
});
