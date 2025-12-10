import {
    type CharacterSetValidation,
    mapIterable,
    type TransformerInput,
    type TransformerOutput
} from "@aidc-toolkit/utility";
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
     * Create identifier(s) with reference(s).
     *
     * @template TTransformerInput
     * Transformer input type.
     *
     * @param referenceOrReferences
     * Reference(s).
     *
     * @returns
     * Identifier(s).
     */
    create<TTransformerInput extends TransformerInput<string>>(referenceOrReferences: TTransformerInput): TransformerOutput<TTransformerInput, string> {
        // TODO Refactor type when https://github.com/microsoft/TypeScript/pull/56941 released.
        let result: string | Iterable<string>;

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

        if (typeof referenceOrReferences !== "object") {
            result = validateAndCreate(referenceOrReferences);
        } else {
            result = mapIterable(referenceOrReferences, validateAndCreate);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type determination is handled above.
        return result as TransformerOutput<TTransformerInput, string>;
    }
}
