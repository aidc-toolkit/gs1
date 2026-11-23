import type { NonSerializableNumericIdentifierDescriptor } from "../descriptor/index.js";
import { AbstractNonGTINNumericIdentifierValidator } from "./abstract-non-gtin-numeric-identifier-validator.js";
import type {
    BaseNonSerializableNumericIdentifierValidator
} from "./base-non-serializable-numeric-identifier-validator.js";

/**
 * Concrete non-serializable numeric identifier validator.
 */
export class ConcreteNonSerializableNumericIdentifierValidator<
    TIdentifierDescriptor extends NonSerializableNumericIdentifierDescriptor
> extends AbstractNonGTINNumericIdentifierValidator<TIdentifierDescriptor> implements BaseNonSerializableNumericIdentifierValidator<
    TIdentifierDescriptor["identifierType"],
    TIdentifierDescriptor["leaderType"]
> {
}
