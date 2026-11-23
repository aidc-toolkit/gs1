import type { ContentCharacterSet, ContentCharacterSets } from "../content-character-set.js";
import type { NonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import type { PrefixTypes } from "../prefix-type.js";
import type { BaseIdentifierDescriptor } from "./base-identifier-descriptor.js";

/**
 * Base non-numeric identifier descriptor.
 */
export interface BaseNonNumericIdentifierDescriptor<
    TIdentifierType extends NonNumericIdentifierType,
    TReferenceCharacterSet extends Exclude<ContentCharacterSet, typeof ContentCharacterSets.Numeric>
> extends BaseIdentifierDescriptor<TIdentifierType, typeof PrefixTypes.GS1CompanyPrefix, number, TReferenceCharacterSet> {
    /**
     * True if identifier requires a check character pair.
     */
    readonly requiresCheckCharacterPair: boolean;
}
