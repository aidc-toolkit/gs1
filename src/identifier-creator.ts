import type { IdentifierDescriptor } from "./identifier-descriptor";
import type { IdentifierValidation, IdentifierValidator } from "./identifier-validator";
import type { PrefixProvider } from "./prefix-provider";

/**
 * Identifier creator. Creates an identifier based on its definition in section 3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * Keys are created based on a prefix defined in a prefix provider to which the identifier creator is bound.
 */
export interface IdentifierCreator<TIdentifierDescriptor extends IdentifierDescriptor = IdentifierDescriptor, TIdentifierValidation extends IdentifierValidation = IdentifierValidation> extends IdentifierValidator<TIdentifierDescriptor, TIdentifierValidation> {
    /**
     * Get the prefix provider to which this identifier creator is bound.
     */
    get prefixProvider(): PrefixProvider;

    /**
     * Get the prefix, equivalent to calling {@linkcode PrefixProvider.prefix | prefixProvider.prefix} for a GTIN or
     * {@linkcode PrefixProvider.gs1CompanyPrefix | prefixProvider.gs1CompanyPrefix} for all other identifier types.
     */
    get prefix(): string;

    /**
     * Get the reference length.
     */
    get referenceLength(): number;
}
