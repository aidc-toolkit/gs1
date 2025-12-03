import type { ContentCharacterSet, ContentCharacterSets } from "./content-character-set";
import type { IdentifierDescriptor } from "./identifier-descriptor";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type";
import type { PrefixTypes } from "./prefix-type";

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
