import type { AbstractConstructor } from "@aidc-toolkit/core";
import type { IdentifierDescriptor } from "../descriptor/index.js";
import type { BaseIdentifierValidator, IdentifierValidation } from "../validator/base-identifier-validator.js";
import type { IdentifierValidator, PrefixProvider } from "../validator/index.js";
import type { BaseIdentifierCreator } from "./base-identifier-creator.js";

/**
 * Identifier creator constructor type, which delegates to an identifier validator constructor.
 */
type IdentifierCreatorConstructor<
    TIdentifierDescriptor extends IdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & IdentifierValidator,
    TIdentifierValidation extends IdentifierValidation
> = AbstractConstructor<
    [prefixProvider: PrefixProvider, prefix: string, checkAllowance: number, identifierDescriptor: TIdentifierDescriptor],
    BaseIdentifierCreator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["prefixType"],
        TIdentifierValidator["length"],
        TIdentifierValidator["referenceCharacterSet"],
        TIdentifierValidation
    >
>;

/**
 * Mixin identifier creator constructor type, which includes the identifier validator type.
 */
export type MixinIdentifierCreatorConstructor<
    TIdentifierDescriptor extends IdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & IdentifierValidator,
    TIdentifierValidation extends IdentifierValidation,
    TMixinIdentifierValidator extends BaseIdentifierValidator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["prefixType"],
        TIdentifierValidator["length"],
        TIdentifierValidator["referenceCharacterSet"],
        TIdentifierValidation
    >
> = AbstractConstructor<
    ConstructorParameters<IdentifierCreatorConstructor<TIdentifierDescriptor, TIdentifierValidator, TIdentifierValidation>>,
    InstanceType<IdentifierCreatorConstructor<TIdentifierDescriptor, TIdentifierValidator, TIdentifierValidation>> & TMixinIdentifierValidator
>;

/**
 * Mixin implementation of {@linkcode BaseIdentifierCreator} with an appropriate identifier validator base.
 *
 * @param IdentifierValidatorConstructor
 * Identifier validator constructor.
 *
 * @returns
 * Identifier creator class.
 */
export function MixinAbstractIdentifierCreator<
    TIdentifierDescriptor extends IdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & IdentifierValidator,
    TIdentifierValidation extends IdentifierValidation,
    TIdentifierValidatorClass extends TIdentifierValidator & AbstractConstructor<
        [identifierDescriptor: TIdentifierDescriptor],
        TIdentifierValidator
    >
>(IdentifierValidatorConstructor: AbstractConstructor<
    [identifierDescriptor: TIdentifierDescriptor],
    TIdentifierValidatorClass
>): MixinIdentifierCreatorConstructor<
    TIdentifierDescriptor,
    TIdentifierValidator,
    TIdentifierValidation,
    TIdentifierValidatorClass
> {
    /**
     * Abstract numeric identifier creator. Implements common functionality for a numeric identifier creator, mixed in
     * with a matching numeric identifier validator.
     */
    abstract class AbstractIdentifierCreator extends (
        // Upcast to type with statically known members.
        IdentifierValidatorConstructor as AbstractConstructor<
            [identifierDescriptor: TIdentifierDescriptor],
            BaseIdentifierValidator<
                TIdentifierValidator["identifierType"],
                TIdentifierValidator["prefixType"],
                TIdentifierValidator["length"],
                TIdentifierValidator["referenceCharacterSet"],
                TIdentifierValidation
            >
        >
    ) implements BaseIdentifierCreator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["prefixType"],
        TIdentifierValidator["length"],
        TIdentifierValidator["referenceCharacterSet"],
        TIdentifierValidation
    > {
        /**
         * Prefix provider.
         */
        readonly #prefixProvider: PrefixProvider;

        /**
         * Reference length.
         */
        readonly #referenceLength: number;

        /**
         * Constructor.
         *
         * @param prefixProvider
         * Prefix provider.
         *
         * @param prefix
         * Prefix within prefix provider to use to calculate reference length.
         *
         * @param checkAllowance
         * Number of characters to allow for check digit or check character pair.
         *
         * @param identifierDescriptor
         * Identifier descriptor to pass to identifier validator constructor.
         */
        protected constructor(prefixProvider: PrefixProvider, prefix: string, checkAllowance: number, identifierDescriptor: TIdentifierDescriptor) {
            super(identifierDescriptor);

            this.#prefixProvider = prefixProvider;

            // Reference length allows for prefix and optionally check digit or check character pair.
            this.#referenceLength = this.length - prefix.length - checkAllowance;
        }

        /**
         * @inheritDoc
         */
        get prefixProvider(): PrefixProvider {
            return this.#prefixProvider;
        }

        /**
         * @inheritDoc
         */
        get prefix(): string {
            return this.prefixProvider.gs1CompanyPrefix;
        }

        /**
         * @inheritDoc
         */
        get referenceLength(): number {
            return this.#referenceLength;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Base class was upcast to type with statically known members for mixin; downcast result.
    return AbstractIdentifierCreator as unknown as MixinIdentifierCreatorConstructor<
        TIdentifierDescriptor,
        TIdentifierValidator,
        TIdentifierValidation,
        TIdentifierValidatorClass
    >;
}
