// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in JSDoc.
import { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import type { IdentifierCreator } from "./identifier-creator.js";
import type { NumericIdentifierType } from "./numeric-identifier-type.js";
import type { NumericIdentifierValidation, NumericIdentifierValidator } from "./numeric-identifier-validator.js";

/**
 * Numeric identifier creator. Creates one or many numeric identifiers.
 *
 * @template TNumericIdentifierType
 * Numeric identifier type type.
 */
export interface NumericIdentifierCreator<TNumericIdentifierType extends NumericIdentifierType = NumericIdentifierType> extends NumericIdentifierValidator<TNumericIdentifierType>, IdentifierCreator<TNumericIdentifierType, NumericIdentifierValidation> {
    /**
     * Get the capacity (`10**referenceLength`).
     */
    get capacity(): number;

    /**
     * Get the tweak for sparse creation.
     */
    get tweak(): bigint;

    /**
     * Set the tweak for sparse creation.
     */
    set tweak(value: bigint);

    create: {
        /**
         * Create an identifier with a reference based on a numeric value. The value is converted to a reference of the
         * appropriate length using {@linkcode NUMERIC_CREATOR}.
         *
         * @param value
         * Numeric value.
         *
         * @param sparse
         * If true, the value is mapped to a sparse sequence resistant to discovery.
         *
         * @returns
         * Identifier.
         */
        (value: number | bigint, sparse?: boolean): string;

        /**
         * Create identifiers with references based on numeric values. The values are converted to references of the
         * appropriate length using {@linkcode NUMERIC_CREATOR}.
         *
         * @param values
         * Numeric values.
         *
         * @param sparse
         * If true, the values are mapped to a sparse sequence resistant to discovery.
         *
         * @returns
         * Identifiers.
         */
        (values: Iterable<number | bigint>, sparse?: boolean): Iterable<string>;
    };

    /**
     * Create all identifiers for the prefix from `0` to `capacity - 1`.
     *
     * The implementation creates the strings only as needed using an internal generator function. Although the result
     * is equivalent to calling `creator.create(new Sequence(0, creator.capacity))`, this method is significantly
     * faster.
     *
     * @returns
     * All identifiers for the prefix.
     */
    createAll: () => Iterable<string>;
}
