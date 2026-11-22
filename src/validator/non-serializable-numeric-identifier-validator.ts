import { IdentifierDescriptors } from "../descriptor/identifier-descriptors.js";
import type {
    NonSerializableNumericIdentifierDescriptor
} from "../descriptor/non-serializable-numeric-identifier-descriptor.js";
import type { NonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";

/**
 * Non-serializable numeric identifier validator.
 */
export class NonSerializableNumericIdentifierValidator extends NonGTINNumericIdentifierValidator<NonSerializableNumericIdentifierType> implements NonSerializableNumericIdentifierDescriptor {
    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(identifierType: NonSerializableNumericIdentifierType) {
        super(IdentifierDescriptors[identifierType]);
    }
}
