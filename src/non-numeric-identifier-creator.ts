import {
    type CharacterSetValidation,
    mapIterable,
    type TransformerInput,
    type TransformerOutput
} from "@aidc-toolkit/utility";
import { Mixin } from "ts-mixer";
import { checkCharacterPair } from "./check.js";
import { AbstractIdentifierCreator } from "./identifier-creator.js";
import type { IdentifierType } from "./identifier-type.js";
import type { ContentCharacterSet } from "./identifier-validator.js";
import { i18nextGS1 } from "./locale/i18n.js";
import { NonNumericIdentifierValidator } from "./non-numeric-identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider";

/**
 * Non-numeric identifier creator.
 */
export class NonNumericIdentifierCreator extends Mixin(NonNumericIdentifierValidator, AbstractIdentifierCreator) {
    /**
     * Reference validation parameters.
     */
    private readonly _referenceValidation: CharacterSetValidation;

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
     * @param referenceCharacterSet
     * Reference character set.
     *
     * @param requiresCheckCharacterPair
     * True if the identifier requires a check character pair.
     */
    constructor(prefixProvider: PrefixProvider, identifierType: IdentifierType, length: number, referenceCharacterSet: ContentCharacterSet, requiresCheckCharacterPair = false) {
        super(identifierType, length, referenceCharacterSet, requiresCheckCharacterPair);

        this.init(prefixProvider, prefixProvider.gs1CompanyPrefix, 2 * Number(requiresCheckCharacterPair));

        this._referenceValidation = {
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
        return this._referenceValidation;
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
