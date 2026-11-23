import type {
    BaseNonGTINNumericIdentifierDescriptor
} from "../descriptor/base-non-gtin-numeric-identifier-descriptor.js";
import type { LeaderType, LeaderTypes } from "../leader-type.js";
import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import type { PrefixTypes } from "../prefix-type.js";
import type { BaseNumericIdentifierValidator } from "./base-numeric-identifier-validator.js";

/**
 * Base non-GTIN numeric identifier validator.
 */
export interface BaseNonGTINNumericIdentifierValidator<
    TIdentifierType extends NonGTINNumericIdentifierType,
    TLeaderType extends Exclude<LeaderType, typeof LeaderTypes.IndicatorDigit>
> extends BaseNumericIdentifierValidator<TIdentifierType, typeof PrefixTypes.GS1CompanyPrefix, number, TLeaderType>, BaseNonGTINNumericIdentifierDescriptor<TIdentifierType, TLeaderType> {
}
