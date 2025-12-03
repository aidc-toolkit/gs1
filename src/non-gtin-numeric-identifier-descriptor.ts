import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor";
import type { LeaderType, LeaderTypes } from "./numeric-identifier-type";
import type { PrefixTypes } from "./prefix-type";

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
