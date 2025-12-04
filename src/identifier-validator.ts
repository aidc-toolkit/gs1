import type { CharacterSetCreator, StringValidation, StringValidator } from "@aidc-toolkit/utility";
import type { IdentifierDescriptor } from "./identifier-descriptor";

/**
 * Identifier validation parameters.
 */
export interface IdentifierValidation extends StringValidation {
}

/**
 * Identifier validator. Validates an identifier against its definition in section 3 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}.
 *
 * @template TIdentifierDescriptor
 * Identifier descriptor type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 */
export interface IdentifierValidator<TIdentifierDescriptor extends IdentifierDescriptor = IdentifierDescriptor, TIdentifierValidation extends IdentifierValidation = IdentifierValidation> extends StringValidator<TIdentifierValidation> {
    /**
     * Get the identifier type. Per the GS1 General Specifications, the identifier type determines the remaining
     * properties.
     */
    get identifierType(): TIdentifierDescriptor["identifierType"];

    /**
     * Get the prefix type supported by the identifier type. For all identifier types except the GTIN, this is a GS1
     * Company Prefix. For the GTIN, the prefix type determines the length.
     */
    get prefixType(): TIdentifierDescriptor["prefixType"];

    /**
     * Get the length. For numeric identifier types, the length is fixed; for alphanumeric identifier types, the length
     * is the maximum.
     */
    get length(): number;

    /**
     * Get the reference character set.
     */
    get referenceCharacterSet(): TIdentifierDescriptor["referenceCharacterSet"];

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
