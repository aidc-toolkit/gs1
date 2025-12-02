import { type CharacterSetCreator, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { AI39_CREATOR, AI82_CREATOR } from "./character-set";
import type { IdentifierType } from "./identifier-type";
import {
    type ContentCharacterSet,
    ContentCharacterSets,
    type IdentifierValidation,
    type IdentifierValidator
} from "./identifier-validator";
import { type PrefixType, PrefixTypes } from "./prefix-type";
import { PrefixValidator } from "./prefix-validator";

/**
 * Abstract identifier validator. Implements common functionality for an identifier validator.
 */
export abstract class AbstractIdentifierValidator<TIdentifierType extends IdentifierType, TIdentifierValidation extends IdentifierValidation> implements IdentifierValidator<TIdentifierType, TIdentifierValidation> {
    private static readonly CHARACTER_SET_CREATORS: Record<ContentCharacterSet, CharacterSetCreator> = {
        [ContentCharacterSets.Numeric]: NUMERIC_CREATOR,
        [ContentCharacterSets.AI82]: AI82_CREATOR,
        [ContentCharacterSets.AI39]: AI39_CREATOR
    };

    /**
     * Identifier type.
     */
    private readonly _identifierType: TIdentifierType;

    /**
     * Length.
     */
    private readonly _length: number;

    /**
     * Reference character set.
     */
    private readonly _referenceCharacterSet: ContentCharacterSet;

    /**
     * Reference creator.
     */
    private readonly _referenceCreator: CharacterSetCreator;

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
        return AbstractIdentifierValidator.CHARACTER_SET_CREATORS[characterSet];
    }

    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param length
     * Length.
     *
     * @param referenceCharacterSet
     * Reference character set.
     */
    protected constructor(identifierType: TIdentifierType, length: number, referenceCharacterSet: ContentCharacterSet) {
        this._identifierType = identifierType;
        this._length = length;
        this._referenceCharacterSet = referenceCharacterSet;
        this._referenceCreator = AbstractIdentifierValidator.creatorFor(referenceCharacterSet);
    }

    /**
     * @inheritDoc
     */
    get identifierType(): TIdentifierType {
        return this._identifierType;
    }

    /**
     * @inheritDoc
     */
    get prefixType(): PrefixType {
        // All identifier types except GTIN support only the GS1 Company Prefix.
        return PrefixTypes.GS1CompanyPrefix;
    }

    /**
     * @inheritDoc
     */
    get length(): number {
        return this._length;
    }

    /**
     * @inheritDoc
     */
    get referenceCharacterSet(): ContentCharacterSet {
        return this._referenceCharacterSet;
    }

    /**
     * @inheritDoc
     */
    get referenceCreator(): CharacterSetCreator {
        return this._referenceCreator;
    }

    /**
     * Pad an identifier on the left with zero-value character for validation purposes. This is done to align an
     * identifier with a position offset for any error message that may be thrown by the reference validator.
     *
     * @param identifier
     * Identifier.
     *
     * @param positionOffset
     * Position offset within a larger string if any.
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
     * Position offset within a larger string if any.
     */
    protected validatePrefix(partialIdentifier: string, positionOffset?: number): void {
        // Delegate to prefix validator with support for U.P.C. Company Prefix but not GS1-8 Prefix.
        PrefixValidator.validate(this.prefixType, true, false, partialIdentifier, true, this.referenceCharacterSet === ContentCharacterSets.Numeric, positionOffset);
    }

    abstract validate(identifier: string, validation?: TIdentifierValidation): void;
}
