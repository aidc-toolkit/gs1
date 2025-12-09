import { MixinAbstractNonGTINNumericIdentifierCreator } from "./abstract-non-gtin-numeric-identifier-creator.js";
import type { NonSerializableNumericIdentifierType } from "./non-serializable-numeric-identifier-type.js";
import { NonSerializableNumericIdentifierValidator } from "./non-serializable-numeric-identifier-validator.js";

/**
 * Non-serializable numeric identifier creator.
 */
export class NonSerializableNumericIdentifierCreator extends MixinAbstractNonGTINNumericIdentifierCreator<
    NonSerializableNumericIdentifierType,
    typeof NonSerializableNumericIdentifierValidator
>(NonSerializableNumericIdentifierValidator) {
}
