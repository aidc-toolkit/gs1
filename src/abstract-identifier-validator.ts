import { type CharacterSetCreator, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { AI39_CREATOR, AI82_CREATOR } from "./character-set.js";
import { type ContentCharacterSet, ContentCharacterSets } from "./content-character-set.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import type { IdentifierValidation, IdentifierValidator } from "./identifier-validator.js";
import { PrefixTypes } from "./prefix-type.js";
import { PrefixValidator } from "./prefix-validator.js";

/**
 * Abstract identifier validator. Implements common functionality for an identifier validator.
 *
 * @template TIdentifierDescriptor
 * Identifier descriptor type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 */
export abstract class AbstractIdentifierValidator<TIdentifierDescriptor extends IdentifierDescriptor, TIdentifierValidation extends IdentifierValidation> implements IdentifierValidator<TIdentifierDescriptor, TIdentifierValidation> {
    static readonly #CHARACTER_SET_CREATORS: Record<ContentCharacterSet, CharacterSetCreator> = {
        [ContentCharacterSets.Numeric]: NUMERIC_CREATOR,
        [ContentCharacterSets.AI82]: AI82_CREATOR,
        [ContentCharacterSets.AI39]: AI39_CREATOR
    };

    /**
     * Identifier type.
     */
    readonly #identifierType: TIdentifierDescriptor["identifierType"];

    /**
     * Length.
     */
    readonly #length: number;

    /**
     * Reference character set.
     */
    readonly #referenceCharacterSet: TIdentifierDescriptor["referenceCharacterSet"];

    /**
     * Reference creator.
     */
    readonly #referenceCreator: CharacterSetCreator;

    /**
     * Get the character set creator for a character set.
     *
     * @param characterSet
     * Character set.
     *
     * @returns
     * Character set creator.
     */
    protected static creatorFor(characterSet: ContentCharacterSet): CharacterSetCreator {
        return AbstractIdentifierValidator.#CHARACTER_SET_CREATORS[characterSet];
    }

    /**
     * Constructor.
     *
     * @param identifierDescriptor
     * Identifier descriptor.
     */
    protected constructor(identifierDescriptor: IdentifierDescriptor) {
        this.#identifierType = identifierDescriptor.identifierType;
        this.#length = identifierDescriptor.length;
        this.#referenceCharacterSet = identifierDescriptor.referenceCharacterSet;
        this.#referenceCreator = AbstractIdentifierValidator.creatorFor(identifierDescriptor.referenceCharacterSet);
    }

    /**
     * @inheritDoc
     */
    get identifierType(): TIdentifierDescriptor["identifierType"] {
        return this.#identifierType;
    }

    /**
     * @inheritDoc
     */
    get prefixType(): TIdentifierDescriptor["prefixType"] {
        // All identifier types except GTIN support only the GS1 Company Prefix.
        return PrefixTypes.GS1CompanyPrefix;
    }

    /**
     * @inheritDoc
     */
    get length(): number {
        return this.#length;
    }

    /**
     * @inheritDoc
     */
    get referenceCharacterSet(): TIdentifierDescriptor["referenceCharacterSet"] {
        return this.#referenceCharacterSet;
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
     *
     * @param positionOffset
     * Position offset within a larger string.
     */
    protected validatePrefix(partialIdentifier: string, positionOffset?: number): void {
        // Delegate to prefix validator with support for U.P.C. Company Prefix but not GS1-8 Prefix.
        PrefixValidator.validate(this.prefixType, true, false, partialIdentifier, true, this.referenceCharacterSet === ContentCharacterSets.Numeric, positionOffset);
    }

    abstract validate(identifier: string, validation?: TIdentifierValidation): void;
}
