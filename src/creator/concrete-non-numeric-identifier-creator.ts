import { type CharacterSetValidation, mapIterable } from "@aidc-toolkit/utility";
import { checkCharacterPair } from "../check.js";
import {
    IdentifierDescriptors,
    type NonNumericIdentifierDescriptor,
    NonNumericIdentifierDescriptors
} from "../descriptor/index.js";
import { i18nextGS1T } from "../locale/i18n.js";
import { ConcreteNonNumericIdentifierValidator } from "../validator/concrete-non-numeric-identifier-validator.js";
import type {
    NonNumericIdentifierValidation,
    NonNumericIdentifierValidator,
    PrefixProvider
} from "../validator/index.js";
import type { BaseNonNumericIdentifierCreator } from "./base-non-numeric-identifier-creator.js";
import { MixinAbstractIdentifierCreator } from "./mixin-abstract-identifier-creator.js";

/**
 * Concrete non-numeric identifier creator.
 */
export class ConcreteNonNumericIdentifierCreator<
    TIdentifierDescriptor extends NonNumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NonNumericIdentifierValidator
// @ts-expect-error -- https://github.com/microsoft/TypeScript/issues/24122
> extends MixinAbstractIdentifierCreator<TIdentifierDescriptor, TIdentifierValidator, NonNumericIdentifierValidation, ConcreteNonNumericIdentifierValidator<TIdentifierDescriptor>>(ConcreteNonNumericIdentifierValidator)
    implements BaseNonNumericIdentifierCreator<TIdentifierValidator["identifierType"], TIdentifierValidator["referenceCharacterSet"]> {
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
    constructor(prefixProvider: PrefixProvider, identifierType: TIdentifierValidator["identifierType"]) {
        super(prefixProvider, prefixProvider.gs1CompanyPrefix, 2 * Number(IdentifierDescriptors[identifierType].requiresCheckCharacterPair), NonNumericIdentifierDescriptors[identifierType]);

        this.#referenceValidation = {
            minimumLength: 1,
            // Maximum reference length has to account for prefix and check character pair.
            maximumLength: this.referenceLength,
            component: () => i18nextGS1T("Identifier.reference")
        };
    }

    /**
     * @inheritDoc
     */
    create(reference: string): string;

    /**
     * @inheritDoc
     */
    create(references: Iterable<string>): Iterable<string>;

    create(referenceOrReferences: string | Iterable<string>): string | Iterable<string> {
        const referenceCreator = this.referenceCreator;
        const referenceValidation = this.#referenceValidation;
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
