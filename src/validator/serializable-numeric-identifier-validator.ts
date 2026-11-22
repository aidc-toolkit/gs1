import type { CharacterSetCreator, CharacterSetValidation } from "@aidc-toolkit/utility";
import { CONTENT_CHARACTER_SET_CREATORS } from "../content-character-set-creators.js";
import type { ContentCharacterSet } from "../content-character-set.js";
import { IdentifierDescriptors } from "../descriptor/identifier-descriptors.js";
import type {
    SerializableNumericIdentifierDescriptor
} from "../descriptor/serializable-numeric-identifier-descriptor.js";
import { i18nextGS1T } from "../locale/i18n.js";
import type { SerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import type { IdentifierValidation } from "./identifier-validator.js";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";

/**
 * Serializable numeric identifier split.
 */
export interface SerializableNumericIdentifierSplit {
    /**
     * Base identifier.
     */
    baseIdentifier: string;

    /**
     * Serial component.
     */
    serialComponent: string;
}

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
            component: () => i18nextGS1T("Identifier.serialComponent")
        };

        this.#serialComponentCreator = CONTENT_CHARACTER_SET_CREATORS[identifierDescriptor.serialComponentCharacterSet];
    }

    /**
     * Serial component length.
     */
    get serialComponentLength(): number {
        return this.#serialComponentLength;
    }

    /**
     * Serial component character set.
     */
    get serialComponentCharacterSet(): ContentCharacterSet {
        return this.#serialComponentCharacterSet;
    }

    /**
     * Serial component validation parameters.
     */
    protected get serialComponentValidation(): CharacterSetValidation {
        return this.#serialComponentValidation;
    }

    /**
     * Serial component creator.
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

    /**
     * Split a serializable numeric identifier into its component parts.
     *
     * @param identifier
     * Identifier.
     *
     * @param validation
     * Identifier validation parameters.
     *
     * @returns
     * Base identifier and serial component (possibly empty) as object.
     */
    split(identifier: string, validation?: IdentifierValidation): SerializableNumericIdentifierSplit {
        this.validate(identifier, validation);

        return {
            baseIdentifier: identifier.substring(0, this.length),
            serialComponent: identifier.substring(this.length)
        };
    }
}
