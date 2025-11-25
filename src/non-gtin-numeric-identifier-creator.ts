import { Mixin } from "ts-mixer";
import type { IdentifierType } from "./identifier-type.js";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import { AbstractNumericIdentifierCreator } from "./numeric-identifier-creator.js";
import { type LeaderType, LeaderTypes } from "./numeric-identifier-validator.js";
import type { PrefixManager } from "./prefix-manager.js";

/**
 * Non-GTIN numeric identifier creator.
 */
export class NonGTINNumericIdentifierCreator extends Mixin(NonGTINNumericIdentifierValidator, AbstractNumericIdentifierCreator) {
    /**
     * Constructor. Called internally by {@link PrefixManager} non-GTIN numeric identifier creator getters;
     * should not be called by other code.
     *
     * @param prefixManager
     * Prefix manager.
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
    constructor(prefixManager: PrefixManager, identifierType: IdentifierType, length: number, leaderType: LeaderType = LeaderTypes.None) {
        super(identifierType, length, leaderType);

        this.init(prefixManager, prefixManager.gs1CompanyPrefix);
    }
}
