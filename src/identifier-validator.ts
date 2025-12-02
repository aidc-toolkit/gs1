import type { CharacterSetCreator, StringValidation, StringValidator } from "@aidc-toolkit/utility";
import type { IdentifierType } from "./identifier-type";
import type { PrefixType } from "./prefix-type";

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
}

/**
 * Identifier validator. Validates an identifier against its definition in section 3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 */
export interface IdentifierValidator<TIdentifierType extends IdentifierType = IdentifierType, TIdentifierValidation extends IdentifierValidation = IdentifierValidation> extends StringValidator<TIdentifierValidation> {
    /**
     * Get the identifier type. Per the GS1 General Specifications, the identifier type determines the remaining
     * properties.
     */
    get identifierType(): TIdentifierType;

    /**
     * Get the prefix type supported by the identifier type. For all identifier types except the GTIN, this is a GS1
     * Company Prefix. For the GTIN, the prefix type determines the length.
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
