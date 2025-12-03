import { Mixin } from "ts-mixer";
import { AbstractNumericIdentifierCreator } from "./abstract-numeric-identifier-creator";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator";
import type { PrefixProvider } from "./prefix-provider";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type";

/**
 * Non-GTIN numeric identifier creator.
 */
export class NonGTINNumericIdentifierCreator extends Mixin(NonGTINNumericIdentifierValidator, AbstractNumericIdentifierCreator) {
    /**
     * Constructor. Typically called internally by a prefix manager but may be called by other code with another prefix
     * provider type.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(prefixProvider: PrefixProvider, identifierType: Exclude<NonGTINNumericIdentifierType, SerializableNumericIdentifierType>) {
        super(identifierType);

        this.init(prefixProvider, prefixProvider.gs1CompanyPrefix);
    }
}
