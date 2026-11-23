import type {
    BaseNonSerializableNumericIdentifierDescriptor
} from "../descriptor/base-non-serializable-numeric-identifier-descriptor.js";
import type { LeaderType, LeaderTypes } from "../leader-type.js";
import type { NonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import type { BaseNonGTINNumericIdentifierValidator } from "./base-non-gtin-numeric-identifier-validator.js";

/**
 * Base non-serializable numeric identifier validator.
 */
export interface BaseNonSerializableNumericIdentifierValidator<
    TIdentifierType extends NonSerializableNumericIdentifierType,
    TLeaderType extends Exclude<LeaderType, typeof LeaderTypes.IndicatorDigit>
> extends BaseNonGTINNumericIdentifierValidator<TIdentifierType, TLeaderType>, BaseNonSerializableNumericIdentifierDescriptor<TIdentifierType, TLeaderType> {
}
