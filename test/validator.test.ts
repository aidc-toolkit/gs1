import { describe, expect, test } from "vitest";
import {
    ContentCharacterSets,
    CPID_VALIDATOR,
    GCN_VALIDATOR,
    GDTI_VALIDATOR,
    GIAI_VALIDATOR,
    GINC_VALIDATOR,
    GLN_VALIDATOR,
    GMN_VALIDATOR,
    GRAI_VALIDATOR,
    GSIN_VALIDATOR,
    GSRN_VALIDATOR,
    GTIN12_VALIDATOR,
    GTIN13_VALIDATOR,
    GTIN8_VALIDATOR,
    GTIN_VALIDATORS,
    GTINTypes,
    IdentifierTypes,
    LeaderTypes,
    PrefixTypes,
    SSCC_VALIDATOR
} from "../src";
import { validateGTINValidator } from "./gtin-validator.test";
import { validateNonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator";
import { validateNonNumericIdentifierValidator } from "./non-numeric-identifier-validator";
import { validateSerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator";

describe("Validators", () => {
    test("GTIN", () => {
        expect(GTIN_VALIDATORS[PrefixTypes.GS1CompanyPrefix]).toBe(GTIN13_VALIDATOR);
        expect(GTIN_VALIDATORS[PrefixTypes.UPCCompanyPrefix]).toBe(GTIN12_VALIDATOR);
        expect(GTIN_VALIDATORS[PrefixTypes.GS18Prefix]).toBe(GTIN8_VALIDATOR);
    });

    test("Structure", () => {
        validateGTINValidator(GTIN13_VALIDATOR, false, GTINTypes.GTIN13);
        validateGTINValidator(GTIN12_VALIDATOR, false, GTINTypes.GTIN12);
        validateGTINValidator(GTIN8_VALIDATOR, false, GTINTypes.GTIN8);
        validateNonGTINNumericIdentifierValidator(GLN_VALIDATOR, false, IdentifierTypes.GLN, 13, LeaderTypes.None);
        validateNonGTINNumericIdentifierValidator(SSCC_VALIDATOR, false, IdentifierTypes.SSCC, 18, LeaderTypes.ExtensionDigit);
        validateSerializableNumericIdentifierValidator(GRAI_VALIDATOR, false, IdentifierTypes.GRAI, 13, LeaderTypes.None, 16, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(GIAI_VALIDATOR, false, IdentifierTypes.GIAI, 30, ContentCharacterSets.AI82, false);
        validateNonGTINNumericIdentifierValidator(GSRN_VALIDATOR, false, IdentifierTypes.GSRN, 18, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(GDTI_VALIDATOR, false, IdentifierTypes.GDTI, 13, LeaderTypes.None, 17, ContentCharacterSets.AI82);
        validateNonNumericIdentifierValidator(GINC_VALIDATOR, false, IdentifierTypes.GINC, 30, ContentCharacterSets.AI82, false);
        validateNonGTINNumericIdentifierValidator(GSIN_VALIDATOR, false, IdentifierTypes.GSIN, 17, LeaderTypes.None);
        validateSerializableNumericIdentifierValidator(GCN_VALIDATOR, false, IdentifierTypes.GCN, 13, LeaderTypes.None, 12, ContentCharacterSets.Numeric);
        validateNonNumericIdentifierValidator(CPID_VALIDATOR, false, IdentifierTypes.CPID, 30, ContentCharacterSets.AI39, false);
        validateNonNumericIdentifierValidator(GMN_VALIDATOR, false, IdentifierTypes.GMN, 25, ContentCharacterSets.AI82, true);
    });
});
