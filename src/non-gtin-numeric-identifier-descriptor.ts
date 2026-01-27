import type { LeaderType, LeaderTypes } from "./leader-type.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import type { PrefixTypes } from "./prefix-type.js";

/**
 * Non-GTIN numeric identifier descriptor.
 */
export interface NonGTINNumericIdentifierDescriptor extends NumericIdentifierDescriptor {
    /**
     * @inheritDoc
     */
    readonly identifierType: NonGTINNumericIdentifierType;

    /**
     * @inheritDoc
     */
    readonly prefixType: typeof PrefixTypes.GS1CompanyPrefix;

    /**
     * @inheritDoc
     */
    readonly leaderType: Exclude<LeaderType, typeof LeaderTypes.IndicatorDigit>;
}
