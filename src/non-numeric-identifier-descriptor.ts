import type { ContentCharacterSet, ContentCharacterSets } from "./content-character-set.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type.js";
import type { PrefixTypes } from "./prefix-type.js";

/**
 * Non-numeric identifier descriptor.
 */
export interface NonNumericIdentifierDescriptor extends IdentifierDescriptor {
    /**
     * @inheritDoc
     */
    readonly identifierType: NonNumericIdentifierType;

    /**
     * @inheritDoc
     */
    readonly prefixType: typeof PrefixTypes.GS1CompanyPrefix;

    /**
     * @inheritDoc
     */
    readonly referenceCharacterSet: Exclude<ContentCharacterSet, typeof ContentCharacterSets.Numeric>;

    /**
     * True if identifier requires a check character pair.
     */
    readonly requiresCheckCharacterPair: boolean;
}
