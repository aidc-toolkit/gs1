import type { CharacterSetCreator } from "@aidc-toolkit/utility";
import { ContentCharacterSetCreators } from "../content-character-set-creators.js";
import { ContentCharacterSets } from "../content-character-set.js";
import type { IdentifierDescriptor } from "../descriptor/index.js";
import type { BaseIdentifierValidator, IdentifierValidation } from "./base-identifier-validator.js";
import { PrefixValidator } from "./prefix-validator.js";

/**
 * Abstract identifier validator.
 */
export abstract class AbstractIdentifierValidator<
    TIdentifierDescriptor extends IdentifierDescriptor,
    TIdentifierValidation extends IdentifierValidation
> implements BaseIdentifierValidator<
    TIdentifierDescriptor["identifierType"],
    TIdentifierDescriptor["prefixType"],
    TIdentifierDescriptor["length"],
    TIdentifierDescriptor["referenceCharacterSet"],
    TIdentifierValidation
> {
    /**
     * Identifier descriptor.
     */
    readonly #identifierDescriptor: TIdentifierDescriptor;

    /**
     * Reference creator.
     */
    readonly #referenceCreator: CharacterSetCreator;

    /**
     * Constructor.
     *
     * @param identifierDescriptor
     * Identifier descriptor.
     */
    constructor(identifierDescriptor: TIdentifierDescriptor) {
        this.#identifierDescriptor = identifierDescriptor;
        this.#referenceCreator = ContentCharacterSetCreators[identifierDescriptor.referenceCharacterSet];
    }

    /**
     * Identifier descriptor.
     */
    get identifierDescriptor(): TIdentifierDescriptor {
        return this.#identifierDescriptor;
    }

    /**
     * @inheritDoc
     */
    get identifierType(): TIdentifierDescriptor["identifierType"] {
        return this.identifierDescriptor.identifierType;
    }

    /**
     * @inheritDoc
     */
    get prefixType(): TIdentifierDescriptor["prefixType"] {
        return this.identifierDescriptor.prefixType;
    }

    /**
     * @inheritDoc
     */
    get length(): TIdentifierDescriptor["length"] {
        return this.identifierDescriptor.length;
    }

    /**
     * @inheritDoc
     */
    get referenceCharacterSet(): TIdentifierDescriptor["referenceCharacterSet"] {
        return this.identifierDescriptor.referenceCharacterSet;
    }

    /**
     * @inheritDoc
     */
    get referenceCreator(): CharacterSetCreator {
        return this.#referenceCreator;
    }

    /**
     * Pad an identifier on the left with zero-value character for validation purposes. This is done to align an
     * identifier with a position offset for any error message that may be thrown by the reference validator.
     *
     * @param identifier
     * Identifier.
     *
     * @param positionOffset
     * Position offset within a larger string.
     *
     * @returns
     * Padded identifier.
     */
    protected padIdentifier(identifier: string, positionOffset?: number): string {
        // Identifier is returned as is if position offset is undefined.
        return positionOffset === undefined ? identifier : this.referenceCreator.character(0).repeat(positionOffset).concat(identifier);
    }

    /**
     * Validate the prefix within an identifier.
     *
     * @param partialIdentifier
     * Partial identifier.
     */
    protected validatePrefix(partialIdentifier: string): void {
        // Delegate to prefix validator with support for U.P.C. Company Prefix but not GS1-8 Prefix.
        PrefixValidator.validate(this.prefixType, true, false, partialIdentifier, true, this.referenceCharacterSet === ContentCharacterSets.Numeric);
    }

    /**
     * @inheritDoc
     */
    abstract validate(identifier: string, validation?: TIdentifierValidation): void;
}
