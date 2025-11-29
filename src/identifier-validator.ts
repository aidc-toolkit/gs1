import {
    type CharacterSetCreator,
    NUMERIC_CREATOR,
    type StringValidation,
    type StringValidator
} from "@aidc-toolkit/utility";
import { AI39_CREATOR, AI82_CREATOR } from "./character-set";
import type { IdentifierType } from "./identifier-type";
import type { PrefixType } from "./prefix-type";
import { PrefixValidator } from "./prefix-validator";

/**
 * Character sets supported by the reference portion of an identifier or the serial component of a numeric identifier.
 */
export const ContentCharacterSets = {
    /**
     * Numeric.
     */
    Numeric: "Numeric",

    /**
     * GS1 AI encodable character set 82.
     */
    AI82: "AI82",

    /**
     * GS1 AI encodable character set 39.
     */
    AI39: "AI39"
} as const;

/**
 * Content character set.
 */
export type ContentCharacterSet = typeof ContentCharacterSets[keyof typeof ContentCharacterSets];

/**
 * Identifier validation parameters.
 */
export interface IdentifierValidation extends StringValidation {
    /**
     * Position offset within a larger string. Strings are sometimes composed of multiple substrings; this parameter
     * ensures that the error notes the proper position in the string.
     */
    positionOffset?: number | undefined;
}

/**
 * Identifier validator. Validates an identifier against its definition in section 3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 */
export interface IdentifierValidator<TIdentifierValidation extends IdentifierValidation = IdentifierValidation> extends StringValidator<TIdentifierValidation> {
    /**
     * Get the identifier type. Per the GS1 General Specifications, the identifier type determines the remaining
     * properties.
     */
    get identifierType(): IdentifierType;

    /**
     * Get the prefix type supported by the identifier type. For all identifier types except the GTIN, this is
     * {@linkcode PrefixTypes.GS1CompanyPrefix}. For the GTIN, the prefix type determines the length.
     */
    get prefixType(): PrefixType;

    /**
     * Get the length. For numeric identifier types, the length is fixed; for alphanumeric identifier types, the length
     * is the maximum.
     */
    get length(): number;

    /**
     * Get the reference character set.
     */
    get referenceCharacterSet(): ContentCharacterSet;

    /**
     * Get the reference creator.
     */
    get referenceCreator(): CharacterSetCreator;

    /**
     * Validate an identifier and throw an error if validation fails.
     *
     * @param identifier
     * Identifier.
     *
     * @param validation
     * Identifier validation parameters.
     */
    validate: (identifier: string, validation?: TIdentifierValidation) => void;
}

/**
 * Abstract identifier validator. Implements common functionality for an identifier validator.
 */
export abstract class AbstractIdentifierValidator<TIdentifierValidation extends IdentifierValidation = IdentifierValidation> implements IdentifierValidator<TIdentifierValidation> {
    private static readonly CHARACTER_SET_CREATORS: Record<ContentCharacterSet, CharacterSetCreator> = {
        [ContentCharacterSets.Numeric]: NUMERIC_CREATOR,
        [ContentCharacterSets.AI82]: AI82_CREATOR,
        [ContentCharacterSets.AI39]: AI39_CREATOR
    };

    /**
     * Identifier type.
     */
    private readonly _identifierType: IdentifierType;

    /**
     * Prefix type.
     */
    private readonly _prefixType: PrefixType;

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
     * @param prefixType
     * Prefix type.
     *
     * @param length
     * Length.
     *
     * @param referenceCharacterSet
     * Reference character set.
     */
    protected constructor(identifierType: IdentifierType, prefixType: PrefixType, length: number, referenceCharacterSet: ContentCharacterSet) {
        this._identifierType = identifierType;
        this._prefixType = prefixType;
        this._length = length;
        this._referenceCharacterSet = referenceCharacterSet;
        this._referenceCreator = AbstractIdentifierValidator.creatorFor(referenceCharacterSet);
    }

    /**
     * @inheritDoc
     */
    get identifierType(): IdentifierType {
        return this._identifierType;
    }

    /**
     * @inheritDoc
     */
    get prefixType(): PrefixType {
        return this._prefixType;
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
     * @param validation
     * Identifier validation parameters.
     *
     * @returns
     * Padded identifier.
     */
    protected padIdentifier(identifier: string, validation: IdentifierValidation | undefined): string {
        // Identifier is returned as is if position offset is undefined.
        return validation?.positionOffset === undefined ? identifier : this.referenceCreator.character(0).repeat(validation.positionOffset).concat(identifier);
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
