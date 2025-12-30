import type { CharacterSetCreator, StringValidation, StringValidator } from "@aidc-toolkit/utility";
import { CONTENT_CHARACTER_SET_CREATORS } from "./content-character-set-creators.js";
import { ContentCharacterSets } from "./content-character-set.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import type { IdentifierTypeDescriptor } from "./identifier-descriptors.js";
import type { IdentifierType } from "./identifier-type.js";
import { PrefixTypes } from "./prefix-type.js";
import { PrefixValidator } from "./prefix-validator.js";

/**
 * Identifier validation parameters.
 */
export interface IdentifierValidation extends StringValidation {
}

/**
 * Identifier validator. Validates an identifier against its definition in section 3 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Implements common functionality for an
 * identifier validator.
 *
 * @template TIdentifierType
 * Identifier type type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 */
export abstract class IdentifierValidator<TIdentifierType extends IdentifierType = IdentifierType, TIdentifierValidation extends IdentifierValidation = IdentifierValidation> implements IdentifierDescriptor, StringValidator<TIdentifierValidation> {
    /**
     * Identifier type.
     */
    readonly #identifierType: IdentifierTypeDescriptor<TIdentifierType>["identifierType"];

    /**
     * Length.
     */
    readonly #length: IdentifierTypeDescriptor<TIdentifierType>["length"];

    /**
     * Reference character set.
     */
    readonly #referenceCharacterSet: IdentifierTypeDescriptor<TIdentifierType>["referenceCharacterSet"];

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
    protected constructor(identifierDescriptor: IdentifierTypeDescriptor<TIdentifierType>) {
        this.#identifierType = identifierDescriptor.identifierType;
        this.#length = identifierDescriptor.length;
        this.#referenceCharacterSet = identifierDescriptor.referenceCharacterSet;
        this.#referenceCreator = CONTENT_CHARACTER_SET_CREATORS[identifierDescriptor.referenceCharacterSet];
    }

    /**
     * Get the identifier type. Per the GS1 General Specifications, the identifier type determines the remaining
     * properties.
     */
    get identifierType(): IdentifierTypeDescriptor<TIdentifierType>["identifierType"] {
        return this.#identifierType;
    }

    /**
     * Get the prefix type supported by the identifier type. For all identifier types except the GTIN, this is a GS1
     * Company Prefix. For the GTIN, the prefix type determines the length.
     */
    get prefixType(): IdentifierTypeDescriptor<TIdentifierType>["prefixType"] {
        // All identifier types except GTIN support only the GS1 Company Prefix.
        return PrefixTypes.GS1CompanyPrefix;
    }

    /**
     * Get the length. For numeric identifier types, the length is fixed; for alphanumeric identifier types, the length
     * is the maximum.
     */
    get length(): IdentifierTypeDescriptor<TIdentifierType>["length"] {
        return this.#length;
    }

    /**
     * Get the reference character set.
     */
    get referenceCharacterSet(): IdentifierTypeDescriptor<TIdentifierType>["referenceCharacterSet"] {
        return this.#referenceCharacterSet;
    }

    /**
     * Get the reference creator.
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
     * Validate an identifier and throw an error if validation fails.
     *
     * @param identifier
     * Identifier.
     *
     * @param validation
     * Identifier validation parameters.
     */
    abstract validate(identifier: string, validation?: TIdentifierValidation): void;
}
