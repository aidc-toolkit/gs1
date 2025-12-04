import {
    CharacterSetCreator,
    Exclusions,
    NUMERIC_CREATOR,
    type TransformerInput,
    type TransformerOutput
} from "@aidc-toolkit/utility";
import { AbstractIdentifierCreator } from "./abstract-identifier-creator";
import { checkDigit, checkDigitSum } from "./check";
import type { NumericIdentifierCreator } from "./numeric-identifier-creator";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor";
import { type LeaderType, LeaderTypes } from "./numeric-identifier-type";
import type { NumericIdentifierValidation } from "./numeric-identifier-validator";
import type { PrefixProvider } from "./prefix-provider";

/**
 * Abstract numeric identifier creator. Implements common functionality for a numeric identifier creator.
 *
 * @template TNumericIdentifierDescriptor
 * Numeric identifier descriptor type.
 */
export abstract class AbstractNumericIdentifierCreator<TNumericIdentifierDescriptor extends NumericIdentifierDescriptor> extends AbstractIdentifierCreator<TNumericIdentifierDescriptor, NumericIdentifierValidation> implements NumericIdentifierCreator<TNumericIdentifierDescriptor> {
    /**
     * Capacity.
     */
    private _capacity!: number;

    /**
     * Tweak for sparse creation.
     */
    private _tweak = 0n;

    /**
     * Initialize the prefix provider. This method is in lieu of a constructor due to the mixin architecture.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param prefix
     * Prefix within prefix manager to use to calculate reference length.
     */
    protected override init(prefixProvider: PrefixProvider, prefix: string): void {
        super.init(prefixProvider, prefix, 1);

        // Capacity is always in number range.
        this._capacity = Number(CharacterSetCreator.powerOf10(this.referenceLength));
    }

    /**
     * Get the leader type.
     */
    abstract get leaderType(): LeaderType;

    /**
     * @inheritDoc
     */
    get capacity(): number {
        return this._capacity;
    }

    /**
     * @inheritDoc
     */
    get tweak(): bigint {
        return this._tweak;
    }

    /**
     * @inheritDoc
     */
    set tweak(value: bigint) {
        this._tweak = value;
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
    private buildIdentifier(reference: string): string {
        const partialIdentifier = this.leaderType === LeaderTypes.ExtensionDigit ? reference.substring(0, 1) + this.prefix + reference.substring(1) : this.prefix + reference;

        return partialIdentifier + checkDigit(partialIdentifier);
    }

    /**
     * @inheritDoc
     */
    create<TTransformerInput extends TransformerInput<number | bigint>>(valueOrValues: TTransformerInput, sparse = false): TransformerOutput<TTransformerInput, string> {
        return NUMERIC_CREATOR.create(this.referenceLength, valueOrValues, Exclusions.None, sparse ? this.tweak : undefined, reference => this.buildIdentifier(reference));
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
    private static * createAllPartial(partialIdentifier: string, remainingReferenceLength: number, extensionWeight: number, weight: number, partialCheckDigitSum: number): Generator<string> {
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
