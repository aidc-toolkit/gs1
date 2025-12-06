import type { CharacterSetCreator, CharacterSetValidation } from "@aidc-toolkit/utility";
import { AbstractNumericIdentifierValidator } from "./abstract-numeric-identifier-validator.js";
import type { ContentCharacterSet } from "./content-character-set.js";
import { IdentifierDescriptors } from "./descriptors.js";
import type { IdentifierValidation } from "./identifier-validator.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";

/**
 * Serializable numeric identifier validator. Validates both serialized and non-serialized forms of numeric identifiers
 * that support serialization.
 */
export class SerializableNumericIdentifierValidator extends AbstractNumericIdentifierValidator<SerializableNumericIdentifierDescriptor> {
    /**
     * Serial component length.
     */
    private readonly _serialComponentLength: number;

    /**
     * Serial component character set.
     */
    private readonly _serialComponentCharacterSet: ContentCharacterSet;

    /**
     * Serial component validation parameters.
     */
    private readonly _serialComponentValidation: CharacterSetValidation;

    /**
     * Serial component creator.
     */
    private readonly _serialComponentCreator: CharacterSetCreator;

    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(identifierType: SerializableNumericIdentifierType) {
        const identifierDescriptor = IdentifierDescriptors[identifierType];

        super(identifierDescriptor);

        this._serialComponentLength = identifierDescriptor.serialComponentLength;
        this._serialComponentCharacterSet = identifierDescriptor.serialComponentCharacterSet;

        this._serialComponentValidation = {
            minimumLength: 1,
            maximumLength: identifierDescriptor.serialComponentLength,
            component: () => i18nextGS1.t("Identifier.serialComponent")
        };

        this._serialComponentCreator = SerializableNumericIdentifierValidator.creatorFor(identifierDescriptor.serialComponentCharacterSet);
    }

    /**
     * Get the serial component length.
     */
    get serialComponentLength(): number {
        return this._serialComponentLength;
    }

    /**
     * Get the serial component character set.
     */
    get serialComponentCharacterSet(): ContentCharacterSet {
        return this._serialComponentCharacterSet;
    }

    /**
     * Get the serial component validation parameters.
     */
    protected get serialComponentValidation(): CharacterSetValidation {
        return this._serialComponentValidation;
    }

    /**
     * Get the serial component creator.
     */
    get serialComponentCreator(): CharacterSetCreator {
        return this._serialComponentCreator;
    }

    /**
     * @inheritDoc
     */
    override validate(identifier: string, validation?: IdentifierValidation): void {
        super.validate(identifier.substring(0, this.length), validation);

        if (identifier.length > this.length) {
            this.serialComponentCreator.validate(identifier.substring(this.length), this._serialComponentValidation);
        }
    }
}
