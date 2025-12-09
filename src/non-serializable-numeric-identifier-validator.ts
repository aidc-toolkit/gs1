import { IdentifierDescriptors } from "./identifier-descriptors.js";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import type { NonSerializableNumericIdentifierDescriptor } from "./non-serializable-numeric-identifier-descriptor.js";
import type { NonSerializableNumericIdentifierType } from "./non-serializable-numeric-identifier-type.js";

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
