import type { ContentCharacterSets } from "./content-character-set.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import type { LeaderType, NumericIdentifierType } from "./numeric-identifier-type.js";

/**
 * Numeric identifier descriptor.
 */
export interface NumericIdentifierDescriptor extends IdentifierDescriptor {
    /**
     * @inheritDoc
     */
    readonly identifierType: NumericIdentifierType;

    /**
     * @inheritDoc
     */
    readonly referenceCharacterSet: typeof ContentCharacterSets.Numeric;

    /**
     * Leader type.
     */
    readonly leaderType: LeaderType;
}
