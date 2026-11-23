import type { CharacterSetCreator, CharacterSetValidation } from "@aidc-toolkit/utility";
import { ContentCharacterSetCreators } from "../content-character-set-creators.js";
import type { SerializableNumericIdentifierDescriptor } from "../descriptor/index.js";
import { i18nextGS1T } from "../locale/i18n.js";
import { AbstractNonGTINNumericIdentifierValidator } from "./abstract-non-gtin-numeric-identifier-validator.js";
import type { IdentifierValidation } from "./base-identifier-validator.js";
import type {
    BaseSerializableNumericIdentifierValidator,
    SerializableNumericIdentifierSplit
} from "./base-serializable-numeric-identifier-validator.js";

/**
 * Concrete serializable numeric identifier validator.
 */
export class ConcreteSerializableNumericIdentifierValidator<
    TIdentifierDescriptor extends SerializableNumericIdentifierDescriptor
> extends AbstractNonGTINNumericIdentifierValidator<TIdentifierDescriptor> implements BaseSerializableNumericIdentifierValidator<
    TIdentifierDescriptor["identifierType"],
    TIdentifierDescriptor["serialComponentCharacterSet"]
> {
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
     * @param identifierDescriptor
     * Identifier descriptor.
     */
    constructor(identifierDescriptor: TIdentifierDescriptor) {
        super(identifierDescriptor);
        
        this.#serialComponentValidation = {
            minimumLength: 1,
            maximumLength: identifierDescriptor.serialComponentLength,
            component: () => i18nextGS1T("Identifier.serialComponent")
        };

        this.#serialComponentCreator = ContentCharacterSetCreators[identifierDescriptor.serialComponentCharacterSet];
    }

    /**
     * Serial component length.
     */
    get serialComponentLength(): number {
        return this.identifierDescriptor.serialComponentLength;
    }

    /**
     * Serial component character set.
     */
    get serialComponentCharacterSet(): TIdentifierDescriptor["serialComponentCharacterSet"] {
        return this.identifierDescriptor.serialComponentCharacterSet;
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
