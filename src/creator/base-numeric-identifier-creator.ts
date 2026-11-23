// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in JSDoc.
import type { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import type { ContentCharacterSets } from "../content-character-set.js";
import type { LeaderType } from "../leader-type.js";
import type { NumericIdentifierType } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type {
    BaseNumericIdentifierValidator,
    NumericIdentifierValidation
} from "../validator/base-numeric-identifier-validator.js";
import type { BaseIdentifierCreator } from "./base-identifier-creator.js";

/**
 * Base numeric identifier creator. Creates one or many numeric identifiers.
 */
export interface BaseNumericIdentifierCreator<
    TIdentifierType extends NumericIdentifierType,
    TPrefixType extends PrefixType,
    TLength extends number,
    TLeaderType extends LeaderType
> extends BaseIdentifierCreator<TIdentifierType, TPrefixType, TLength, typeof ContentCharacterSets.Numeric, NumericIdentifierValidation>, BaseNumericIdentifierValidator<TIdentifierType, TPrefixType, TLength, TLeaderType> {
    /**
     * Capacity (`10**referenceLength`).
     */
    readonly capacity: number;

    /**
     * Tweak for sparse creation.
     */
    tweak: bigint;

    /**
     * Create an identifier or identifiers.
     */
    create: {
        /**
         * Create an identifier with a reference based on a numeric value. The value is converted to a reference of the
         * appropriate length using {@linkcode NUMERIC_CREATOR}.
         *
         * @param value
         * Numeric value.
         *
         * @param sparse
         * True if the value should be mapped to a sparse sequence resistant to discovery.
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
         * True if the values are mapped to a sparse sequence resistant to discovery.
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
