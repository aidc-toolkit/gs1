// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in JSDoc.
import { NUMERIC_CREATOR, type TransformerInput, type TransformerOutput } from "@aidc-toolkit/utility";
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

    /**
     * Create identifier(s) with reference(s) based on numeric value(s). The value(s) is/are converted to references of
     * the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @template TTransformerInput
     * Transformer input type.
     *
     * @param valueOrValues
     * Numeric value(s).
     *
     * @param sparse
     * If true, the value(s) are mapped to a sparse sequence resistant to discovery. Default is false.
     *
     * @returns
     * Identifier(s).
     */
    create: <TTransformerInput extends TransformerInput<number | bigint>>(valueOrValues: TTransformerInput, sparse?: boolean) => TransformerOutput<TTransformerInput, string>;

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
