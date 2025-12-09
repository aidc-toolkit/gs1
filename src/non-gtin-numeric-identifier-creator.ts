import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import type { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import type { NumericIdentifierCreator } from "./numeric-identifier-creator.js";

/**
 * Non-GTIN numeric identifier creator. Creates one or many non-GTIN numeric identifiers.
 *
 * @template TNonGTINNumericIdentifierType
 * Non-GTIN numeric identifier type type.
 */
export interface NonGTINNumericIdentifierCreator<TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType = NonGTINNumericIdentifierType> extends NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType>, NumericIdentifierCreator<TNonGTINNumericIdentifierType> {
}
