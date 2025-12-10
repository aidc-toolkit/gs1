import type { TypedConstructor } from "@aidc-toolkit/core";
import {
    CharacterSetCreator,
    Exclusions,
    NUMERIC_CREATOR,
    type TransformerInput,
    type TransformerOutput
} from "@aidc-toolkit/utility";
import { type IdentifierCreatorConstructor, MixinAbstractIdentifierCreator } from "./abstract-identifier-creator.js";
import { checkDigit, checkDigitSum } from "./check.js";
import type { IdentifierTypeValidator, IdentifierValidatorConstructorsEntry } from "./identifier-validators.js";
import { LeaderTypes } from "./leader-type.js";
import type { NumericIdentifierCreator } from "./numeric-identifier-creator.js";
import type { NumericIdentifierType } from "./numeric-identifier-type.js";
import type { NumericIdentifierValidation, NumericIdentifierValidator } from "./numeric-identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * Numeric identifier creator constructor type, which delegates to a numeric identifier validator constructor.
 *
 * @template TNumericIdentifierType
 * Numeric identifier type type.
 *
 * @template TNumericIdentifierValidator
 * Numeric identifier validator type.
 */
export type NumericIdentifierCreatorConstructor<
    TNumericIdentifierType extends NumericIdentifierType,
    TNumericIdentifierValidator extends NumericIdentifierValidator<TNumericIdentifierType>
> = TypedConstructor<
    [prefixProvider: PrefixProvider, prefix: string, ...args: ConstructorParameters<IdentifierValidatorConstructorsEntry<TNumericIdentifierType>>],
    TNumericIdentifierValidator & NumericIdentifierCreator<TNumericIdentifierType>
>;

/**
 * Mixin implementation of {@linkcode NumericIdentifierCreator} with an appropriate numeric identifier validator base.
 *
 * @template TNumericIdentifierType
 * Numeric identifier type type.
 *
 * @param NumericIdentifierValidatorConstructor
 * Numeric identifier validator base.
 *
 * @returns
 * Numeric identifier creator class.
 */
export function MixinAbstractNumericIdentifierCreator<
    TNumericIdentifierType extends NumericIdentifierType
>(NumericIdentifierValidatorConstructor: TypedConstructor<
    ConstructorParameters<IdentifierValidatorConstructorsEntry<TNumericIdentifierType>>,
    IdentifierTypeValidator<TNumericIdentifierType>
>): NumericIdentifierCreatorConstructor<
    TNumericIdentifierType,
    IdentifierTypeValidator<TNumericIdentifierType>
> {
    /**
     * Abstract numeric identifier creator. Implements common functionality for a numeric identifier creator, mixed in
     * with a matching numeric identifier validator.
     */
    abstract class AbstractNumericIdentifierCreator extends (
        MixinAbstractIdentifierCreator(NumericIdentifierValidatorConstructor) as IdentifierCreatorConstructor<
            TNumericIdentifierType,
            NumericIdentifierValidation,
            NumericIdentifierValidator<TNumericIdentifierType>
        >
    ) implements NumericIdentifierCreator<TNumericIdentifierType> {
        /**
         * Capacity.
         */
        readonly #capacity: number;

        /**
         * Tweak for sparse creation.
         */
        #tweak = 0n;

        /**
         * Constructor.
         *
         * @param prefixProvider
         * Prefix provider.
         *
         * @param prefix
         * Prefix within prefix provider to use to calculate reference length.
         *
         * @param args
         * Originating constructor arguments.
         */
        constructor(prefixProvider: PrefixProvider, prefix: string, ...args: ConstructorParameters<IdentifierValidatorConstructorsEntry<TNumericIdentifierType>>) {
            super(prefixProvider, prefix, 1, ...args);

            // Capacity is always in number range.
            this.#capacity = Number(CharacterSetCreator.powerOf10(this.referenceLength));
        }

        /**
         * @inheritDoc
         */
        get capacity(): number {
            return this.#capacity;
        }

        /**
         * @inheritDoc
         */
        get tweak(): bigint {
            return this.#tweak;
        }

        /**
         * @inheritDoc
         */
        set tweak(value: bigint) {
            this.#tweak = value;
        }

        /**
         * Build an identifier from a reference by merging it with the prefix and adding the check digit.
         *
         * @param reference
         * Identifier reference.
         *
         * @returns
         * Identifier.
         */
        #buildIdentifier(reference: string): string {
            const partialIdentifier = this.leaderType === LeaderTypes.ExtensionDigit ? reference.substring(0, 1) + this.prefix + reference.substring(1) : this.prefix + reference;

            return partialIdentifier + checkDigit(partialIdentifier);
        }

        /**
         * @inheritDoc
         */
        create<TTransformerInput extends TransformerInput<number | bigint>>(valueOrValues: TTransformerInput, sparse = false): TransformerOutput<TTransformerInput, string> {
            return NUMERIC_CREATOR.create(this.referenceLength, valueOrValues, Exclusions.None, sparse ? this.tweak : undefined, reference => this.#buildIdentifier(reference));
        }

        /**
         * Create all identifiers from a partial identifier. Call is recursive until remaining reference
         * length is 0.
         *
         * @param partialIdentifier
         * Partial identifier. Initial value is `this.prefix`.
         *
         * @param remainingReferenceLength
         * Remaining reference length. Initial value is `this.referenceLength`.
         *
         * @param extensionWeight
         * If this value is not zero, the identifier has an extension digit, this call is setting it, and this value is
         * applied to the calculation of the check digit.
         *
         * @param weight
         * If the extension weight is zero, this value is applied to the calculation of the check digit.
         *
         * @param partialCheckDigitSum
         * Partial check digit sum for the partial identifier.
         *
         * @yields
         * Identifier.
         */
        static * createAllPartial(partialIdentifier: string, remainingReferenceLength: number, extensionWeight: number, weight: number, partialCheckDigitSum: number): Generator<string> {
            if (remainingReferenceLength === 0) {
                // Finalize check digit calculation and append.
                yield partialIdentifier + NUMERIC_CREATOR.character(9 - (partialCheckDigitSum + 9) % 10);
            } else {
                const nextRemainingReferenceLength = remainingReferenceLength - 1;

                let nextPartialCheckDigitSum = partialCheckDigitSum;

                if (extensionWeight !== 0) {
                    // Apply every digit to the extension digit.
                    for (const c of NUMERIC_CREATOR.characterSet) {
                        yield * AbstractNumericIdentifierCreator.createAllPartial(c + partialIdentifier, nextRemainingReferenceLength, 0, weight, nextPartialCheckDigitSum);

                        nextPartialCheckDigitSum += extensionWeight;
                    }
                } else {
                    const nextWeight = 4 - weight;

                    // Apply every digit to the current character in the identifier.
                    for (const c of NUMERIC_CREATOR.characterSet) {
                        yield * AbstractNumericIdentifierCreator.createAllPartial(partialIdentifier + c, nextRemainingReferenceLength, 0, nextWeight, nextPartialCheckDigitSum);

                        nextPartialCheckDigitSum += weight;
                    }
                }
            }
        }

        /**
         * @inheritDoc
         */
        createAll(): Iterable<string> {
            const hasExtensionDigit = this.leaderType === LeaderTypes.ExtensionDigit;
            const prefix = this.prefix;
            const length = this.length;
            const referenceLength = this.referenceLength;

            // Start weight is for reference excluding extension digit, which has its weight calculated separately.
            const startWeight = 3 - 2 * ((referenceLength + 1 - Number(hasExtensionDigit)) % 2);

            // Returning separate Iterable object makes iteration repeatable.
            return {
                [Symbol.iterator]() {
                    return AbstractNumericIdentifierCreator.createAllPartial(prefix, referenceLength, hasExtensionDigit ? 3 - 2 * length % 2 : 0, startWeight, checkDigitSum(startWeight === 3, prefix));
                }
            };
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Base class was upcast to type with statically known members for mixin, downcast result.
    return AbstractNumericIdentifierCreator as TypedConstructor<
        ConstructorParameters<typeof AbstractNumericIdentifierCreator>,
        unknown
    > as TypedConstructor<
        ConstructorParameters<typeof AbstractNumericIdentifierCreator>,
        IdentifierTypeValidator<TNumericIdentifierType> & AbstractNumericIdentifierCreator
    >;
}
