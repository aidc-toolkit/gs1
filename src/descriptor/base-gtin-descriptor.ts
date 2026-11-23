import type { GTINBaseLength } from "../gtin-length.js";
import type { GTINType } from "../gtin-type.js";
import type { LeaderTypes } from "../leader-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { BaseNumericIdentifierDescriptor } from "./base-numeric-identifier-descriptor.js";

/**
 * Base GTIN descriptor.
 */
export interface BaseGTINDescriptor<
    TPrefixType extends PrefixType
> extends BaseNumericIdentifierDescriptor<GTINType, TPrefixType, GTINBaseLength, typeof LeaderTypes.IndicatorDigit> {
}
