import type { LeaderType, LeaderTypes } from "../leader-type.js";
import type { NonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import type { BaseNonGTINNumericIdentifierDescriptor } from "./base-non-gtin-numeric-identifier-descriptor.js";

/**
 * Base non-serializable numeric identifier descriptor.
 */
export interface BaseNonSerializableNumericIdentifierDescriptor<
    TIdentifierType extends NonSerializableNumericIdentifierType,
    TLeaderType extends Exclude<LeaderType, typeof LeaderTypes.IndicatorDigit>
> extends BaseNonGTINNumericIdentifierDescriptor<TIdentifierType, TLeaderType> {
}
