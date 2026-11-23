// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in JSDoc.
import type { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import type { ContentCharacterSet } from "../content-character-set.js";
import type { LeaderTypes } from "../leader-type.js";
import type { SerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import type {
    BaseSerializableNumericIdentifierValidator
} from "../validator/base-serializable-numeric-identifier-validator.js";
import type { BaseNonGTINNumericIdentifierCreator } from "./base-non-gtin-numeric-identifier-creator.js";

/**
 * Base serializable numeric identifier creator.
 */
export interface BaseSerializableNumericIdentifierCreator<
    TIdentifierType extends SerializableNumericIdentifierType,
    TSerialComponentCharacterSet extends ContentCharacterSet
> extends BaseNonGTINNumericIdentifierCreator<TIdentifierType, typeof LeaderTypes.None>, BaseSerializableNumericIdentifierValidator<TIdentifierType, TSerialComponentCharacterSet> {
    /**
     * Create a serialized identifier or serialized identifiers.
     */
    createSerialized: {
        /**
         * Create a serialized identifier with a reference based on a numeric value concatenated with a serial component.
         * The value is converted to a reference of the appropriate length using {@linkcode NUMERIC_CREATOR}.
         *
         * @param value
         * Numeric value of the reference.
         *
         * @param serialComponent
         * Serial component.
         *
         * @param sparse
         * True if the value should be mapped to a sparse sequence resistant to discovery.
         *
         * @returns
         * Serialized identifier.
         */
        (value: number | bigint, serialComponent: string, sparse?: boolean): string;

        /**
         * Create serialized identifiers with a reference based on a numeric value concatenated with serial components. The
         * value is converted to a reference of the appropriate length using {@linkcode NUMERIC_CREATOR}.
         *
         * @param value
         * Numeric value of the reference.
         *
         * @param serialComponents
         * Serial components.
         *
         * @param sparse
         * True if the value should be mapped to a sparse sequence resistant to discovery.
         *
         * @returns
         * Serialized identifiers.
         */
        (value: number | bigint, serialComponents: Iterable<string>, sparse?: boolean): Iterable<string>;
    };

    /**
     * Concatenate a base identifier with a serial component or serial components.
     */
    concatenate: {
        /**
         * Concatenate a base identifier with a serial component.
         *
         * @param baseIdentifier
         * Base identifier.
         *
         * @param serialComponent
         * Serial component.
         *
         * @returns
         * Serialized identifier.
         */
        (baseIdentifier: string, serialComponent: string): string;

        /**
         * Concatenate a base identifier with serial components.
         *
         * @param baseIdentifier
         * Base identifier.
         *
         * @param serialComponents
         * Serial components.
         *
         * @returns
         * Serialized identifiers.
         */
        (baseIdentifier: string, serialComponents: Iterable<string>): Iterable<string>;
    };
}
