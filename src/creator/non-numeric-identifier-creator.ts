import { type CharacterSetValidation, mapIterable } from "@aidc-toolkit/utility";
import { checkCharacterPair } from "../check.js";
import { IdentifierDescriptors } from "../descriptor/identifier-descriptors.js";
import { i18nextGS1T } from "../locale/i18n.js";
import type { NonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import {
    type NonNumericIdentifierValidation,
    NonNumericIdentifierValidator
} from "../validator/non-numeric-identifier-validator.js";
import { MixinAbstractIdentifierCreator } from "./mixin-abstract-identifier-creator.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * Non-numeric identifier creator.
 */
export class NonNumericIdentifierCreator extends MixinAbstractIdentifierCreator<
    NonNumericIdentifierType,
    NonNumericIdentifierValidation
>(NonNumericIdentifierValidator) {
    /**
     * Reference validation parameters.
     */
    readonly #referenceValidation: CharacterSetValidation;

    /**
     * Constructor.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(prefixProvider: PrefixProvider, identifierType: NonNumericIdentifierType) {
        super(prefixProvider, prefixProvider.gs1CompanyPrefix, 2 * Number(IdentifierDescriptors[identifierType].requiresCheckCharacterPair), identifierType);

        this.#referenceValidation = {
            minimumLength: 1,
            // Maximum reference length has to account for prefix and check character pair.
            maximumLength: this.referenceLength,
            component: () => i18nextGS1T("Identifier.reference")
        };
    }

    /**
     * Reference validation parameters.
     */
    protected get referenceValidation(): CharacterSetValidation {
        return this.#referenceValidation;
    }

    /**
     * Create an identifier with a reference.
     *
     * @param reference
     * Reference.
     *
     * @returns
     * Identifier.
     */
    create(reference: string): string;

    /**
     * Create identifiers with references.
     *
     * @param references
     * References.
     *
     * @returns
     * Identifiers.
     */
    create(references: Iterable<string>): Iterable<string>;

    create(referenceOrReferences: string | Iterable<string>): string | Iterable<string> {
        const referenceCreator = this.referenceCreator;
        const referenceValidation = this.referenceValidation;
        const prefix = this.prefix;
        const requiresCheckCharacterPair = this.requiresCheckCharacterPair;

        /**
         * Validate a reference and create an identifier.
         *
         * @param reference
         * Reference.
         *
         * @returns
         * Identifier.
         */
        function validateAndCreate(reference: string): string {
            referenceCreator.validate(reference, referenceValidation);

            const partialIdentifier = prefix + reference;

            return requiresCheckCharacterPair ? partialIdentifier + checkCharacterPair(partialIdentifier) : partialIdentifier;
        }

        return typeof referenceOrReferences !== "object" ?
            validateAndCreate(referenceOrReferences) :
            mapIterable(referenceOrReferences, validateAndCreate);
    }
}
