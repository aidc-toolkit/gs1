import type { CharacterSetCreator } from "@aidc-toolkit/utility";
import type { ContentCharacterSet } from "../content-character-set.js";
import type {
    BaseSerializableNumericIdentifierDescriptor
} from "../descriptor/base-serializable-numeric-identifier-descriptor.js";
import type { LeaderTypes } from "../leader-type.js";
import type { SerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import type { IdentifierValidation } from "./base-identifier-validator.js";
import type { BaseNonGTINNumericIdentifierValidator } from "./base-non-gtin-numeric-identifier-validator.js";

/**
 * Serializable numeric identifier split.
 */
export interface SerializableNumericIdentifierSplit {
    /**
     * Base identifier.
     */
    readonly baseIdentifier: string;

    /**
     * Serial component.
     */
    readonly serialComponent: string;
}

/**
 * Base serializable numeric identifier validator. Validates both serialized and non-serialized forms of numeric identifiers
 * that support serialization.
 */
export interface BaseSerializableNumericIdentifierValidator<
    TIdentifierType extends SerializableNumericIdentifierType,
    TSerialComponentCharacterSet extends ContentCharacterSet
> extends BaseNonGTINNumericIdentifierValidator<TIdentifierType, typeof LeaderTypes.None>, BaseSerializableNumericIdentifierDescriptor<TIdentifierType, TSerialComponentCharacterSet> {
    /**
     * Serial component creator.
     */
    readonly serialComponentCreator: CharacterSetCreator;

    /**
     * Split a serializable numeric identifier into its component parts.
     *
     * @param identifier
     * Identifier.
     *
     * @param validation
     * Identifier validation parameters.
     *
     * @returns
     * Base identifier and serial component (possibly empty) as object.
     */
    split: (identifier: string, validation?: IdentifierValidation) => SerializableNumericIdentifierSplit;
}
