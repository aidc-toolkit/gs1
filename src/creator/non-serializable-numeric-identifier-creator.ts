import type { NonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import {
    NonSerializableNumericIdentifierValidator
} from "../validator/non-serializable-numeric-identifier-validator.js";
import { MixinAbstractNonGTINNumericIdentifierCreator } from "./mixin-abstract-non-gtin-numeric-identifier-creator.js";

/**
 * Non-serializable numeric identifier creator.
 */
export class NonSerializableNumericIdentifierCreator extends MixinAbstractNonGTINNumericIdentifierCreator<
    NonSerializableNumericIdentifierType
>(NonSerializableNumericIdentifierValidator) {
}
