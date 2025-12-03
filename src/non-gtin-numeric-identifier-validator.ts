import { AbstractNumericIdentifierValidator } from "./abstract-numeric-identifier-validator";
import { IdentifierDescriptors } from "./descriptors";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type";

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
        super(IdentifierDescriptors.get(identifierType));
    }
}
