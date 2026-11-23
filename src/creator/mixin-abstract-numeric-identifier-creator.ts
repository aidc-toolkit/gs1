import type { AbstractConstructor } from "@aidc-toolkit/core";
import { CharacterSetCreator, Exclusions, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { checkDigit, checkDigitSum } from "../check.js";
import type { NumericIdentifierDescriptor } from "../descriptor/index.js";
import { LeaderTypes } from "../leader-type.js";
import type {
    BaseNumericIdentifierValidator,
    NumericIdentifierValidation
} from "../validator/base-numeric-identifier-validator.js";
import type { NumericIdentifierValidator, PrefixProvider } from "../validator/index.js";
import type { BaseNumericIdentifierCreator } from "./base-numeric-identifier-creator.js";
import {
    MixinAbstractIdentifierCreator,
    type MixinIdentifierCreatorConstructor
} from "./mixin-abstract-identifier-creator.js";

/**
 * Numeric identifier creator constructor type, which delegates to a numeric identifier validator constructor.
 */
type NumericIdentifierCreatorConstructor<
    TIdentifierDescriptor extends NumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NumericIdentifierValidator
> = AbstractConstructor<
    [prefixProvider: PrefixProvider, prefix: string, identifierDescriptor: TIdentifierDescriptor],
    BaseNumericIdentifierCreator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["prefixType"],
        TIdentifierValidator["length"],
        TIdentifierValidator["leaderType"]
    >
>;

/**
 * Mixin numeric identifier creator constructor type, which includes the numeric identifier validator type.
 */
export type MixinNumericIdentifierCreatorConstructor<
    TIdentifierDescriptor extends NumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NumericIdentifierValidator,
    TMixinIdentifierValidator extends BaseNumericIdentifierValidator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["prefixType"],
        TIdentifierValidator["length"],
        TIdentifierValidator["leaderType"]
    >
> = AbstractConstructor<
    ConstructorParameters<NumericIdentifierCreatorConstructor<TIdentifierDescriptor, TIdentifierValidator>>,
    InstanceType<NumericIdentifierCreatorConstructor<TIdentifierDescriptor, TIdentifierValidator>> & TMixinIdentifierValidator
>;

/**
 * Mixin implementation of {@linkcode BaseNumericIdentifierCreator} with an appropriate numeric identifier validator
 * base.
 *
 * @param NumericIdentifierValidatorConstructor
 * Numeric identifier validator base.
 *
 * @returns
 * Numeric identifier creator class.
 */
export function MixinAbstractNumericIdentifierCreator<
    TIdentifierDescriptor extends NumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NumericIdentifierValidator,
    TIdentifierValidatorClass extends TIdentifierValidator & AbstractConstructor<
        [identifierDescriptor: TIdentifierDescriptor],
        TIdentifierValidator
    >
>(NumericIdentifierValidatorConstructor: AbstractConstructor<
    [identifierDescriptor: TIdentifierDescriptor],
    TIdentifierValidatorClass
>): MixinNumericIdentifierCreatorConstructor<
    TIdentifierDescriptor,
    TIdentifierValidator,
    TIdentifierValidatorClass
> {
    /**
     * Abstract numeric identifier creator. Implements common functionality for a numeric identifier creator, mixed in
     * with a matching numeric identifier validator.
     */
    abstract class AbstractNumericIdentifierCreator extends (
        // Upcast to type with statically known members.
        MixinAbstractIdentifierCreator(NumericIdentifierValidatorConstructor) as MixinIdentifierCreatorConstructor<
            TIdentifierDescriptor,
            TIdentifierValidator,
            NumericIdentifierValidation,
            BaseNumericIdentifierValidator<
                TIdentifierValidator["identifierType"],
                TIdentifierValidator["prefixType"],
                TIdentifierValidator["length"],
                TIdentifierValidator["leaderType"]
            >
        >
    ) implements BaseNumericIdentifierCreator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["prefixType"],
        TIdentifierValidator["length"],
        TIdentifierValidator["leaderType"]
    > {
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
         * @param identifierDescriptor
         * Identifier descriptor to pass to identifier validator constructor.
         */
        protected constructor(prefixProvider: PrefixProvider, prefix: string, identifierDescriptor: TIdentifierDescriptor) {
            super(prefixProvider, prefix, 1, identifierDescriptor);

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
            const partialIdentifier = this.leaderType === LeaderTypes.ExtensionDigit ? reference.charAt(0) + this.prefix + reference.substring(1) : this.prefix + reference;

            return partialIdentifier + checkDigit(partialIdentifier);
        }

        /**
         * @inheritDoc
         */
        create(value: number | bigint, sparse?: boolean): string;

        /**
         * @inheritDoc
         */
        create(values: Iterable<number | bigint>, sparse?: boolean): Iterable<string>;

        create(valueOrValues: number | bigint | Iterable<number | bigint>, sparse?: boolean): string | Iterable<string> {
            return NUMERIC_CREATOR.create(this.referenceLength, valueOrValues, Exclusions.None, sparse === true ? this.tweak : undefined, reference => this.#buildIdentifier(reference));
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Base class was upcast to type with statically known members for mixin; downcast result.
    return AbstractNumericIdentifierCreator as unknown as MixinNumericIdentifierCreatorConstructor<
        TIdentifierDescriptor,
        TIdentifierValidator,
        TIdentifierValidatorClass
    >;
}
