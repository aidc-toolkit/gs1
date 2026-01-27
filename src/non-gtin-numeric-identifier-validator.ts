import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import { NumericIdentifierValidator } from "./numeric-identifier-validator.js";

/**
 * Non-GTIN numeric identifier validator.
 *
 * @template TNonGTINNumericIdentifierType
 * Non-GTIN numeric identifier type type.
 */
export abstract class NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType = NonGTINNumericIdentifierType> extends NumericIdentifierValidator<TNonGTINNumericIdentifierType> implements NonGTINNumericIdentifierDescriptor {
}
