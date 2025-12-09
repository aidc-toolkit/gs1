import type { CharacterSetCreator, CharacterSetValidation } from "@aidc-toolkit/utility";
import { CONTENT_CHARACTER_SET_CREATORS } from "./content-character-set-creators.js";
import type { ContentCharacterSet } from "./content-character-set.js";
import { IdentifierDescriptors } from "./identifier-descriptors.js";
import type { IdentifierValidation } from "./identifier-validator.js";
import { i18nextGS1 } from "./locale/i18n.js";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";

/**
 * Serializable numeric identifier validator. Validates both serialized and non-serialized forms of numeric identifiers
 * that support serialization.
 */
export class SerializableNumericIdentifierValidator extends NonGTINNumericIdentifierValidator<SerializableNumericIdentifierType> implements SerializableNumericIdentifierDescriptor {
    /**
     * Serial component length.
     */
    readonly #serialComponentLength: number;

    /**
     * Serial component character set.
     */
    readonly #serialComponentCharacterSet: ContentCharacterSet;

    /**
     * Serial component validation parameters.
     */
    readonly #serialComponentValidation: CharacterSetValidation;

    /**
     * Serial component creator.
     */
    readonly #serialComponentCreator: CharacterSetCreator;

    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(identifierType: SerializableNumericIdentifierType) {
        const identifierDescriptor = IdentifierDescriptors[identifierType];

        super(identifierDescriptor);

        this.#serialComponentLength = identifierDescriptor.serialComponentLength;
        this.#serialComponentCharacterSet = identifierDescriptor.serialComponentCharacterSet;

        this.#serialComponentValidation = {
            minimumLength: 1,
            maximumLength: identifierDescriptor.serialComponentLength,
            component: () => i18nextGS1.t("Identifier.serialComponent")
        };

        this.#serialComponentCreator = CONTENT_CHARACTER_SET_CREATORS[identifierDescriptor.serialComponentCharacterSet];
    }

    /**
     * Get the serial component length.
     */
    get serialComponentLength(): number {
        return this.#serialComponentLength;
    }

    /**
     * Get the serial component character set.
     */
    get serialComponentCharacterSet(): ContentCharacterSet {
        return this.#serialComponentCharacterSet;
    }

    /**
     * Get the serial component validation parameters.
     */
    protected get serialComponentValidation(): CharacterSetValidation {
        return this.#serialComponentValidation;
    }

    /**
     * Get the serial component creator.
     */
    get serialComponentCreator(): CharacterSetCreator {
        return this.#serialComponentCreator;
    }

    /**
     * @inheritDoc
     */
    override validate(identifier: string, validation?: IdentifierValidation): void {
        super.validate(identifier.substring(0, this.length), validation);

        if (identifier.length > this.length) {
            this.serialComponentCreator.validate(identifier.substring(this.length), this.#serialComponentValidation);
        }
    }
}
