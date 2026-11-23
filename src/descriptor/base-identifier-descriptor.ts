import type { ContentCharacterSet } from "../content-character-set.js";
import type { IdentifierType } from "../identifier-type.js";
import type { PrefixType } from "../prefix-type.js";

/**
 * Base identifier descriptor.
 */
export interface BaseIdentifierDescriptor<
    TIdentifierType extends IdentifierType,
    TPrefixType extends PrefixType,
    TLength extends number,
    TReferenceCharacterSet extends ContentCharacterSet
> {
    /**
     * Identifier type. Per the GS1 General Specifications, the identifier type determines the remaining properties.
     */
    readonly identifierType: TIdentifierType;

    /**
     * Prefix type supported by the identifier type. For all identifier types except the GTIN, this is a GS1 Company
     * Prefix. For the GTIN, the prefix type determines the length.
     */
    readonly prefixType: TPrefixType;

    /**
     * Length. For numeric identifier types, the length is fixed; for non-numeric identifier types, the length is the
     * maximum.
     */
    readonly length: TLength;

    /**
     * Reference character set.
     */
    readonly referenceCharacterSet: TReferenceCharacterSet;
}
