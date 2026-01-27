import {
    type GTINBaseLength,
    GTINLengths,
    type GTINValidator,
    IdentifierTypes,
    LeaderTypes,
    type PrefixType,
    PrefixTypes
} from "../src/index.js";
import { validateNumericIdentifierValidator } from "./numeric-identifier-validator.js";

export function validateGTINValidator(validator: GTINValidator, isCreator: boolean, gtinBaseLength: GTINBaseLength): void {
    let prefixType: PrefixType;

    switch (gtinBaseLength) {
        case GTINLengths.GTIN13:
            prefixType = PrefixTypes.GS1CompanyPrefix;
            break;

        case GTINLengths.GTIN12:
            prefixType = PrefixTypes.UPCCompanyPrefix;
            break;

        case GTINLengths.GTIN8:
            prefixType = PrefixTypes.GS18Prefix;
            break;
    }

    validateNumericIdentifierValidator(validator, IdentifierTypes.GTIN, prefixType, gtinBaseLength, LeaderTypes.IndicatorDigit);
}
