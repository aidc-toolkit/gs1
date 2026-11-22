import type { ContentCharacterSets } from "../content-character-set.js";
import type { LeaderType } from "../leader-type.js";
import type { NumericIdentifierType } from "../numeric-identifier-type.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";

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
