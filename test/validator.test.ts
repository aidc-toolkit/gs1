import { describe, expect, test } from "vitest";
import {
    ContentCharacterSets,
    type GTINBaseType,
    GTINTypes,
    type GTINValidator,
    type IdentifierType,
    IdentifierTypes,
    type IdentifierValidator,
    IdentifierValidators,
    isGTINValidator,
    isGTINValidators,
    isNonGTINNumericIdentifierValidator,
    isNonNumericIdentifierValidator,
    isNumericIdentifierValidator,
    isSerializableNumericIdentifierValidator,
    LeaderTypes
} from "../src";
import { validateGTINValidator } from "./gtin-validator.test";
import { validateNonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator";
import { validateNonNumericIdentifierValidator } from "./non-numeric-identifier-validator";
import { validateSerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator";

describe("Validators", () => {
    function validateMapping(identifierType: IdentifierType, expectedIdentifierValidatorsOrValidator: Readonly<Record<GTINBaseType, GTINValidator>> | IdentifierValidator, ...isIdentifierValidatorTypes: Array<(validator: IdentifierValidator) => boolean>): void {
        test(identifierType, () => {
            const validatorsOrValidator = IdentifierValidators.get(identifierType);

            expect(validatorsOrValidator).toBe(expectedIdentifierValidatorsOrValidator);

            if (isGTINValidators(validatorsOrValidator)) {
                for (const validator of Object.values(validatorsOrValidator)) {
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
        validateMapping(IdentifierTypes.GLN, IdentifierValidators.GLN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator);
        validateMapping(IdentifierTypes.SSCC, IdentifierValidators.SSCC, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GRAI, IdentifierValidators.GRAI, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GIAI, IdentifierValidators.GIAI, isNonNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GSRN, IdentifierValidators.GSRN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GDTI, IdentifierValidators.GDTI, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GINC, IdentifierValidators.GINC, isNonNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GSIN, IdentifierValidators.GSIN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GCN, IdentifierValidators.GCN, isNumericIdentifierValidator, isNonGTINNumericIdentifierValidator, isSerializableNumericIdentifierValidator);
        validateMapping(IdentifierTypes.CPID, IdentifierValidators.CPID, isNonNumericIdentifierValidator);
        validateMapping(IdentifierTypes.GMN, IdentifierValidators.GMN, isNonNumericIdentifierValidator);
    });

    test("Structure", () => {
        validateGTINValidator(IdentifierValidators.GTIN[GTINTypes.GTIN13], false, GTINTypes.GTIN13);
        validateGTINValidator(IdentifierValidators.GTIN[GTINTypes.GTIN12], false, GTINTypes.GTIN12);
        validateGTINValidator(IdentifierValidators.GTIN[GTINTypes.GTIN8], false, GTINTypes.GTIN8);
        validateNonGTINNumericIdentifierValidator(IdentifierValidators.GLN, false, IdentifierTypes.GLN, 13, LeaderTypes.None);
        validateNonGTINNumericIdentifierValidator(IdentifierValidators.SSCC, false, IdentifierTypes.SSCC, 18, LeaderTypes.ExtensionDigit);
        validateSerializableNumericIdentifierValidator(IdentifierValidators.GRAI, false, IdentifierTypes.GRAI, 13, LeaderTypes.None, 16, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(IdentifierValidators.GIAI, false, IdentifierTypes.GIAI, 30, ContentCharacterSets.AI82, false);
        validateNonGTINNumericIdentifierValidator(IdentifierValidators.GSRN, false, IdentifierTypes.GSRN, 18, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(IdentifierValidators.GDTI, false, IdentifierTypes.GDTI, 13, LeaderTypes.None, 17, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(IdentifierValidators.GINC, false, IdentifierTypes.GINC, 30, ContentCharacterSets.AI82, false);
        validateNonGTINNumericIdentifierValidator(IdentifierValidators.GSIN, false, IdentifierTypes.GSIN, 17, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(IdentifierValidators.GCN, false, IdentifierTypes.GCN, 13, LeaderTypes.None, 12, ContentCharacterSets.Numeric);
        validateNonNumericIdentifierValidator(IdentifierValidators.CPID, false, IdentifierTypes.CPID, 30, ContentCharacterSets.AI39, false);
        validateNonNumericIdentifierValidator(IdentifierValidators.GMN, false, IdentifierTypes.GMN, 25, ContentCharacterSets.AI82, true);
    });
});
