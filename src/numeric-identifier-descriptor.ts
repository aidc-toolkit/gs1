import type { ContentCharacterSets } from "./content-character-set";
import type { IdentifierDescriptor } from "./identifier-descriptor";
import type { LeaderType, NumericIdentifierType } from "./numeric-identifier-type";

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
