import type { LeaderType, LeaderTypes } from "../leader-type.js";
import type { NonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import type {
    BaseNonSerializableNumericIdentifierValidator
} from "../validator/base-non-serializable-numeric-identifier-validator.js";
import type { BaseNonGTINNumericIdentifierCreator } from "./base-non-gtin-numeric-identifier-creator.js";

/**
 * Base non-serializable numeric identifier creator.
 */
export interface BaseNonSerializableNumericIdentifierCreator<
    TIdentifierType extends NonSerializableNumericIdentifierType,
    TLeaderType extends Exclude<LeaderType, typeof LeaderTypes.IndicatorDigit>
> extends BaseNonGTINNumericIdentifierCreator<TIdentifierType, TLeaderType>, BaseNonSerializableNumericIdentifierValidator<TIdentifierType, TLeaderType> {
}
