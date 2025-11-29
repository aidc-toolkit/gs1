import { Mixin } from "ts-mixer";
import type { IdentifierType } from "./identifier-type";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator";
import { AbstractNumericIdentifierCreator } from "./numeric-identifier-creator";
import { type LeaderType, LeaderTypes } from "./numeric-identifier-validator";
import type { PrefixProvider } from "./prefix-provider";

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
     *
     * @param length
     * Length.
     *
     * @param leaderType
     * Leader type.
     */
    constructor(prefixProvider: PrefixProvider, identifierType: IdentifierType, length: number, leaderType: LeaderType = LeaderTypes.None) {
        super(identifierType, length, leaderType);

        this.init(prefixProvider, prefixProvider.gs1CompanyPrefix);
    }
}
