import type { ContentCharacterSets } from "../content-character-set.js";
import type { LeaderType } from "../leader-type.js";
import type { NumericIdentifierType } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { BaseIdentifierDescriptor } from "./base-identifier-descriptor.js";

/**
 * Base numeric identifier descriptor.
 */
export interface BaseNumericIdentifierDescriptor<
    TIdentifierType extends NumericIdentifierType,
    TPrefixType extends PrefixType,
    TLength extends number,
    TLeaderType extends LeaderType
> extends BaseIdentifierDescriptor<TIdentifierType, TPrefixType, TLength, typeof ContentCharacterSets.Numeric> {
    /**
     * Leader type.
     */
    readonly leaderType: TLeaderType;
}
