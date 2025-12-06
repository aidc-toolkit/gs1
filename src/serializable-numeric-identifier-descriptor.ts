import type { ContentCharacterSet } from "./content-character-set.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import type { LeaderTypes } from "./numeric-identifier-type.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";

/**
 * Serializable numeric identifier descriptor.
 */
export interface SerializableNumericIdentifierDescriptor extends NonGTINNumericIdentifierDescriptor {
    /**
     * @inheritDoc
     */
    readonly identifierType: SerializableNumericIdentifierType;

    /**
     * @inheritDoc
     */
    readonly leaderType: typeof LeaderTypes.None;

    /**
     * Serial component length.
     */
    readonly serialComponentLength: number;

    /**
     * Serial component character set.
     */
    readonly serialComponentCharacterSet: ContentCharacterSet;
}
