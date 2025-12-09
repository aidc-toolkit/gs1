import type { IdentifierCreator } from "./identifier-creator.js";
import type { IdentifierType } from "./identifier-type.js";
import type { IdentifierValidation, IdentifierValidator } from "./identifier-validator.js";
import type { IdentifierTypeValidator } from "./identifier-validators.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * Identifier extension constructor type.
 *
 * @template TConstructorArguments
 * Constructor arguments types.
 *
 * @template TConstructorInstance
 * Constructor instance type.
 */
export type IdentifierExtensionConstructor<
    TConstructorArguments extends unknown[],
    TConstructorInstance
> = abstract new (...args: TConstructorArguments) => TConstructorInstance;

/**
 * Identifier validator constructor type.
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
    TIdentifierValidator extends IdentifierValidator<TIdentifierType, TIdentifierValidation> = IdentifierTypeValidator<TIdentifierType>
> = IdentifierExtensionConstructor<
    TConstructorArguments,
    TIdentifierValidator
>;

/**
 * Identifier creator constructor type, which delegates to an identifier validator constructor.
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
    TIdentifierValidator extends IdentifierValidator<TIdentifierType, TIdentifierValidation>
> = IdentifierExtensionConstructor<
    [prefixProvider: PrefixProvider, prefix: string, checkAllowance: number, ...args: TConstructorArguments],
    TIdentifierValidator & IdentifierCreator<TIdentifierType, TIdentifierValidation>
>;

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
export function MixinAbstractIdentifierCreator<
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
    TIdentifierValidation,
    IdentifierTypeValidator<TIdentifierType>
> {
    /**
     * Abstract numeric identifier creator. Implements common functionality for a numeric identifier creator, mixed in
     * with a matching numeric identifier validator.
     */
    abstract class AbstractIdentifierCreator extends (IdentifierValidatorBase as IdentifierValidatorConstructor<
        TConstructorArguments,
        TIdentifierType,
        TIdentifierValidation,
        IdentifierValidator<TIdentifierType, TIdentifierValidation>
    >) implements IdentifierCreator<TIdentifierType, TIdentifierValidation> {
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Base class was upcast to type with statically known members for mixin, downcast result.
    return AbstractIdentifierCreator as IdentifierExtensionConstructor<
        ConstructorParameters<typeof AbstractIdentifierCreator>,
        IdentifierTypeValidator<TIdentifierType> & AbstractIdentifierCreator
    >;
}
