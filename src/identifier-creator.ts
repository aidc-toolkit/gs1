import type { IdentifierType } from "./identifier-type.js";
import type { IdentifierValidation, IdentifierValidator } from "./identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * Identifier creator. Creates an identifier based on its definition in section 3 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}.
 *
 * Keys are created based on a prefix defined in a prefix provider to which the identifier creator is bound.
 *
 * @template TIdentifierType
 * Identifier type type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 */
export interface IdentifierCreator<TIdentifierType extends IdentifierType = IdentifierType, TIdentifierValidation extends IdentifierValidation = IdentifierValidation> extends IdentifierValidator<TIdentifierType, TIdentifierValidation> {
    /**
     * Prefix provider to which this identifier creator is bound.
     */
    get prefixProvider(): PrefixProvider;

    /**
     * Prefix, equivalent to accessing {@linkcode PrefixProvider.prefix | prefixProvider.prefix} for a GTIN or
     * {@linkcode PrefixProvider.gs1CompanyPrefix | prefixProvider.gs1CompanyPrefix} for all other identifier types.
     */
    get prefix(): string;

    /**
     * Reference length.
     */
    get referenceLength(): number;
}
