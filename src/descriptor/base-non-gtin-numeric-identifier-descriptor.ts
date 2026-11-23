import type { LeaderType, LeaderTypes } from "../leader-type.js";
import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import type { PrefixTypes } from "../prefix-type.js";
import type { BaseNumericIdentifierDescriptor } from "./base-numeric-identifier-descriptor.js";

/**
 * Base non-GTIN numeric identifier descriptor.
 */
export interface BaseNonGTINNumericIdentifierDescriptor<
    TIdentifierType extends NonGTINNumericIdentifierType,
    TLeaderType extends Exclude<LeaderType, typeof LeaderTypes.IndicatorDigit>
> extends BaseNumericIdentifierDescriptor<TIdentifierType, typeof PrefixTypes.GS1CompanyPrefix, number, TLeaderType> {
}
