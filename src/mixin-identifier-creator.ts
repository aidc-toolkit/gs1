import type { IdentifierTypeDescriptor } from "./descriptors.js";
import type { IdentifierCreator } from "./identifier-creator.js";
import type { IdentifierType } from "./identifier-type.js";
import type { IdentifierValidation, IdentifierValidator } from "./identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider.js";
import type { IdentifierTypeValidator } from "./validators.js";

/**
 * Identifier validator constructor type. Constructor must take a single parameter.
 *
 * @template TConstructorArguments
 * Constructor arguments types.
 *
 * @template TIdentifierType
 * Identifier type type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 *
 * @template TIdentifierValidator
 * Identifier validator type.
 */
export type IdentifierValidatorConstructor<
    TConstructorArguments extends unknown[],
    TIdentifierType extends IdentifierType,
    TIdentifierValidation extends IdentifierValidation,
    TIdentifierValidator extends IdentifierValidator<IdentifierTypeDescriptor<TIdentifierType>, TIdentifierValidation> = IdentifierTypeValidator<TIdentifierType>
> = new (...args: TConstructorArguments) => TIdentifierValidator;

/**
 * Identifier creator constructor type, which delegates to an identifier validator constructor. Identifier validator
 * constructor must take a single parameter.
 *
 * @template TConstructorArguments
 * Constructor arguments types.
 *
 * @template TIdentifierType
 * Identifier type type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 *
 * @template TIdentifierValidator
 * Identifier validator type.
 */
export type IdentifierCreatorConstructor<
    TConstructorArguments extends unknown[],
    TIdentifierType extends IdentifierType,
    TIdentifierValidation extends IdentifierValidation,
    TIdentifierValidator extends IdentifierValidator<IdentifierTypeDescriptor<TIdentifierType>, TIdentifierValidation> = IdentifierTypeValidator<TIdentifierType>
> = new (prefixProvider: PrefixProvider, prefix: string, checkAllowance: number, ...args: TConstructorArguments) =>
    TIdentifierValidator & IdentifierCreator<IdentifierTypeDescriptor<TIdentifierType>, TIdentifierValidation>;

/**
 * Mixin implementation of {@linkcode IdentifierCreator} with an appropriate identifier validator base.
 *
 * @template TConstructorArguments
 * Constructor arguments types.
 *
 * @template TIdentifierType
 * Identifier type type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 *
 * @param IdentifierValidatorBase
 * Identifier validator base.
 *
 * @returns
 * Identifier creator class.
 */
export function MixinIdentifierCreator<
    TConstructorArguments extends unknown[],
    TIdentifierType extends IdentifierType,
    TIdentifierValidation extends IdentifierValidation,
    TIdentifierValidatorConstructor extends IdentifierValidatorConstructor<
        TConstructorArguments,
        TIdentifierType,
        TIdentifierValidation
    >
>(IdentifierValidatorBase: TIdentifierValidatorConstructor): IdentifierCreatorConstructor<
    TConstructorArguments,
    TIdentifierType,
    TIdentifierValidation
> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Upcast constructor to type with statically known members for mixin then downcast result.
    return class IdentifierCreatorMixin extends (IdentifierValidatorBase as IdentifierValidatorConstructor<
        TConstructorArguments,
        TIdentifierType,
        TIdentifierValidation,
        IdentifierValidator<IdentifierTypeDescriptor<TIdentifierType>, TIdentifierValidation>
    >) implements IdentifierCreator<IdentifierTypeDescriptor<TIdentifierType>, TIdentifierValidation> {
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
         * @param args
         * Originating constructor arguments.
         */
        constructor(prefixProvider: PrefixProvider, prefix: string, checkAllowance: number, ...args: TConstructorArguments) {
            super(...args);

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
    } as unknown as ReturnType<typeof MixinIdentifierCreator<TConstructorArguments, TIdentifierType, TIdentifierValidation, TIdentifierValidatorConstructor>>;
}
