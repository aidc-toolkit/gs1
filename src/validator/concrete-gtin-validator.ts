import type { GTINDescriptor } from "../descriptor/index.js";
import { AbstractNumericIdentifierValidator } from "./abstract-numeric-identifier-validator.js";
import type { BaseGTINValidator } from "./base-gtin-validator.js";
import { PrefixValidator } from "./prefix-validator.js";

/**
 * Concrete GTIN validator.
 */
export class ConcreteGTINValidator<
    TIdentifierDescriptor extends GTINDescriptor
> extends AbstractNumericIdentifierValidator<TIdentifierDescriptor> implements BaseGTINValidator<
    TIdentifierDescriptor["prefixType"]
> {
    /**
     * @inheritDoc
     */
    protected override validatePrefix(partialIdentifier: string): void {
        // Delegate to prefix validator requiring exact match for prefix type.
        PrefixValidator.validate(this.prefixType, false, false, partialIdentifier, true, true);
    }
}
