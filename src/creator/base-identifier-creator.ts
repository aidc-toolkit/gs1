import type { ContentCharacterSet } from "../content-character-set.js";
import type { IdentifierType } from "../identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { BaseIdentifierValidator, IdentifierValidation } from "../validator/base-identifier-validator.js";
import type { PrefixProvider } from "../validator/index.js";

/**
 * Base identifier creator.
 */
export interface BaseIdentifierCreator<
    TIdentifierType extends IdentifierType,
    TPrefixType extends PrefixType,
    TLength extends number,
    TReferenceCharacterSet extends ContentCharacterSet,
    TIdentifierValidation extends IdentifierValidation
> extends BaseIdentifierValidator<TIdentifierType, TPrefixType, TLength, TReferenceCharacterSet, TIdentifierValidation> {
    /**
     * Prefix provider to which this identifier creator is bound.
     */
    readonly prefixProvider: PrefixProvider;

    /**
     * Prefix, equivalent to accessing {@linkcode PrefixProvider.prefix | prefixProvider.prefix} for a GTIN or
     * {@linkcode PrefixProvider.gs1CompanyPrefix | prefixProvider.gs1CompanyPrefix} for all other identifier types.
     */
    readonly prefix: string;

    /**
     * Reference length.
     */
    readonly referenceLength: number;
}
