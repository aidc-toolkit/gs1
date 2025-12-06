import { AbstractNumericIdentifierValidator } from "./abstract-numeric-identifier-validator.js";
import { IdentifierDescriptors } from "./descriptors.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";

/**
 * Non-GTIN numeric identifier validator.
 */
export class NonGTINNumericIdentifierValidator extends AbstractNumericIdentifierValidator<NonGTINNumericIdentifierDescriptor> {
    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(identifierType: Exclude<NonGTINNumericIdentifierType, SerializableNumericIdentifierType>) {
        super(IdentifierDescriptors[identifierType]);
    }
}
