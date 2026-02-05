import { type CharacterSetValidation, mapIterable } from "@aidc-toolkit/utility";
import { MixinAbstractIdentifierCreator } from "./abstract-identifier-creator.js";
import { checkCharacterPair } from "./check.js";
import { IdentifierDescriptors } from "./identifier-descriptors.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type.js";
import {
    type NonNumericIdentifierValidation,
    NonNumericIdentifierValidator
} from "./non-numeric-identifier-validator.js";
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
            component: () => i18nextGS1.t("Identifier.reference")
        };
    }

    /**
     * Get the reference validation parameters.
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

    // eslint-disable-next-line jsdoc/require-jsdoc -- Implementation of overloaded signatures.
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
