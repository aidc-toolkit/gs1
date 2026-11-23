import type { ContentCharacterSets } from "../content-character-set.js";
import type { BaseNumericIdentifierDescriptor } from "../descriptor/base-numeric-identifier-descriptor.js";
import type { LeaderType } from "../leader-type.js";
import type { NumericIdentifierType } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { BaseIdentifierValidator, IdentifierValidation } from "./base-identifier-validator.js";

/**
 * Numeric identifier validation parameters.
 */
export interface NumericIdentifierValidation extends IdentifierValidation {
    /**
     * Position offset within a larger string. Some numeric identifier types have the prefix offset by one.
     */
    positionOffset?: number | undefined;
}

/**
 * Base numeric identifier validator.
 */
export interface BaseNumericIdentifierValidator<
    TIdentifierType extends NumericIdentifierType,
    TPrefixType extends PrefixType,
    TLength extends number,
    TLeaderType extends LeaderType
> extends BaseIdentifierValidator<TIdentifierType, TPrefixType, TLength, typeof ContentCharacterSets.Numeric, NumericIdentifierValidation>, BaseNumericIdentifierDescriptor<TIdentifierType, TPrefixType, TLength, TLeaderType> {
}
