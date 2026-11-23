import type { BaseGTINDescriptor } from "../descriptor/base-gtin-descriptor.js";
import type { GTINBaseLength } from "../gtin-length.js";
import type { GTINType } from "../gtin-type.js";
import type { LeaderTypes } from "../leader-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { BaseNumericIdentifierValidator } from "./base-numeric-identifier-validator.js";

/**
 * Base GTIN validator.
 */
export interface BaseGTINValidator<
    TPrefixType extends PrefixType
> extends BaseNumericIdentifierValidator<GTINType, TPrefixType, GTINBaseLength, typeof LeaderTypes.IndicatorDigit>, BaseGTINDescriptor<TPrefixType> {
}
