import type { ContentCharacterSet } from "../content-character-set.js";
import type { LeaderTypes } from "../leader-type.js";
import type { SerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import type { BaseNonGTINNumericIdentifierDescriptor } from "./base-non-gtin-numeric-identifier-descriptor.js";

/**
 * Base serializable numeric identifier descriptor.
 */
export interface BaseSerializableNumericIdentifierDescriptor<
    TIdentifierType extends SerializableNumericIdentifierType,
    TSerialComponentCharacterSet extends ContentCharacterSet
> extends BaseNonGTINNumericIdentifierDescriptor<TIdentifierType, typeof LeaderTypes.None> {
    /**
     * Serial component length.
     */
    readonly serialComponentLength: number;

    /**
     * Serial component character set.
     */
    readonly serialComponentCharacterSet: TSerialComponentCharacterSet;
}
