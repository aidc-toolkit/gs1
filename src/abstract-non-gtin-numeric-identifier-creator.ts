import type { TypedConstructor } from "@aidc-toolkit/core";
import {
    MixinAbstractNumericIdentifierCreator,
    type NumericIdentifierCreatorConstructor
} from "./abstract-numeric-identifier-creator.js";
import type { IdentifierTypeValidator, IdentifierValidatorConstructorsEntry } from "./identifier-validators.js";
import type { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import type { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * Non-GTIN numeric identifier creator constructor type, which delegates to a non-GTIN numeric identifier validator
 * constructor.
 *
 * @template TNonGTINNumericIdentifierType
 * Non-GTIN numeric identifier type type.
 *
 * @template TNonGTINNumericIdentifierValidator
 * Non-GTIN numeric identifier validator type.
 */
type NonGTINNumericIdentifierCreatorConstructor<
    TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType,
    TNonGTINNumericIdentifierValidator extends NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType>
> = TypedConstructor<
    [prefixProvider: PrefixProvider, ...args: ConstructorParameters<IdentifierValidatorConstructorsEntry<TNonGTINNumericIdentifierType>>],
    TNonGTINNumericIdentifierValidator & NonGTINNumericIdentifierCreator<TNonGTINNumericIdentifierType>
>;

/**
 * Mixin implementation of {@linkcode NonGTINNumericIdentifierCreator} with an appropriate non-GTIN numeric identifier
 * validator base.
 *
 * @template TNonGTINNumericIdentifierType
 * Non-GTIN numeric identifier type type.
 *
 * @param NonGTINNumericIdentifierValidatorConstructor
 * Non-GTIN numeric identifier validator constructor.
 *
 * @returns
 * Non-GTIN numeric identifier creator class.
 */
export function MixinAbstractNonGTINNumericIdentifierCreator<
    TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType
>(NonGTINNumericIdentifierValidatorConstructor: TypedConstructor<
    ConstructorParameters<IdentifierValidatorConstructorsEntry<TNonGTINNumericIdentifierType>>,
    IdentifierTypeValidator<TNonGTINNumericIdentifierType>
>): NonGTINNumericIdentifierCreatorConstructor<
    TNonGTINNumericIdentifierType,
    IdentifierTypeValidator<TNonGTINNumericIdentifierType>
> {
    /**
     * Abstract non-GTIN numeric identifier creator. Implements common functionality for a non-GTIN numeric identifier
     * creator, mixed in with a matching non-GTIN numeric identifier validator.
     */
    abstract class AbstractNonGTINNumericIdentifierCreator extends (
        MixinAbstractNumericIdentifierCreator(NonGTINNumericIdentifierValidatorConstructor) as NumericIdentifierCreatorConstructor<
            TNonGTINNumericIdentifierType,
            NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType>
        >
    ) implements NonGTINNumericIdentifierCreator<TNonGTINNumericIdentifierType> {
        /**
         * Constructor.
         *
         * @param prefixProvider
         * Prefix provider.
         *
         * @param args
         * Originating constructor arguments.
         */
        constructor(prefixProvider: PrefixProvider, ...args: ConstructorParameters<IdentifierValidatorConstructorsEntry<TNonGTINNumericIdentifierType>>) {
            super(prefixProvider, prefixProvider.gs1CompanyPrefix, ...args);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Base class was upcast to type with statically known members for mixin, downcast result.
    return AbstractNonGTINNumericIdentifierCreator as TypedConstructor<
        ConstructorParameters<typeof AbstractNonGTINNumericIdentifierCreator>,
        IdentifierTypeValidator<TNonGTINNumericIdentifierType> & AbstractNonGTINNumericIdentifierCreator
    >;
}
