import type { LeaderType, LeaderTypes } from "../leader-type.js";
import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import type { PrefixTypes } from "../prefix-type.js";
import type { BaseNonGTINNumericIdentifierValidator } from "../validator/base-non-gtin-numeric-identifier-validator.js";
import type { BaseNumericIdentifierCreator } from "./base-numeric-identifier-creator.js";

/**
 * Base non-GTIN numeric identifier creator. Creates one or many non-GTIN numeric identifiers.
 */
export interface BaseNonGTINNumericIdentifierCreator<
    TIdentifierType extends NonGTINNumericIdentifierType,
    TLeaderType extends Exclude<LeaderType, typeof LeaderTypes.IndicatorDigit>
> extends BaseNumericIdentifierCreator<TIdentifierType, typeof PrefixTypes.GS1CompanyPrefix, number, TLeaderType>, BaseNonGTINNumericIdentifierValidator<TIdentifierType, TLeaderType> {
}
