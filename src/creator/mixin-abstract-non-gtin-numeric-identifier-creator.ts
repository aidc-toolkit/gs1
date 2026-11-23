import type { AbstractConstructor } from "@aidc-toolkit/core";
import type { NonGTINNumericIdentifierDescriptor } from "../descriptor/index.js";
import type { BaseNonGTINNumericIdentifierValidator } from "../validator/base-non-gtin-numeric-identifier-validator.js";
import type { NonGTINNumericIdentifierValidator, PrefixProvider } from "../validator/index.js";
import type { BaseNonGTINNumericIdentifierCreator } from "./base-non-gtin-numeric-identifier-creator.js";
import {
    MixinAbstractNumericIdentifierCreator,
    type MixinNumericIdentifierCreatorConstructor
} from "./mixin-abstract-numeric-identifier-creator.js";

/**
 * Non-GTIN numeric identifier creator constructor type, which delegates to a non-GTIN numeric identifier validator
 * constructor.
 */
type NonGTINNumericIdentifierCreatorConstructor<
    TIdentifierDescriptor extends NonGTINNumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NonGTINNumericIdentifierValidator
> = AbstractConstructor<
    [prefixProvider: PrefixProvider, identifierDescriptor: TIdentifierDescriptor],
    BaseNonGTINNumericIdentifierCreator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["leaderType"]
    >
>;

/**
 * Mixin non-GTIN numeric identifier creator constructor type, which includes the non-GTIN numeric identifier validator
 * type.
 */
export type MixinNonGTINNumericIdentifierCreatorConstructor<
    TIdentifierDescriptor extends NonGTINNumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NonGTINNumericIdentifierValidator,
    TMixinIdentifierValidator extends BaseNonGTINNumericIdentifierValidator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["leaderType"]
    >
> = AbstractConstructor<
    ConstructorParameters<NonGTINNumericIdentifierCreatorConstructor<TIdentifierDescriptor, TIdentifierValidator>>,
    InstanceType<NonGTINNumericIdentifierCreatorConstructor<TIdentifierDescriptor, TIdentifierValidator>> & TMixinIdentifierValidator
>;

/**
 * Mixin implementation of {@linkcode BaseNonGTINNumericIdentifierCreator} with an appropriate non-GTIN numeric
 * identifier validator base.
 *
 * @param NonGTINNumericIdentifierValidatorConstructor
 * Non-GTIN numeric identifier validator constructor.
 *
 * @returns
 * Non-GTIN numeric identifier creator class.
 */
export function MixinAbstractNonGTINNumericIdentifierCreator<
    TIdentifierDescriptor extends NonGTINNumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NonGTINNumericIdentifierValidator,
    TIdentifierValidatorClass extends TIdentifierValidator & AbstractConstructor<
        [identifierDescriptor: TIdentifierDescriptor],
        TIdentifierValidator
    >
>(NonGTINNumericIdentifierValidatorConstructor: AbstractConstructor<
    [identifierDescriptor: TIdentifierDescriptor],
    TIdentifierValidatorClass
>): MixinNonGTINNumericIdentifierCreatorConstructor<
    TIdentifierDescriptor,
    TIdentifierValidator,
    TIdentifierValidatorClass
> {
    /**
     * Abstract non-GTIN numeric identifier creator. Implements common functionality for a non-GTIN numeric identifier
     * creator, mixed in with a matching non-GTIN numeric identifier validator.
     */
    abstract class AbstractNonGTINNumericIdentifierCreator extends (
        // Upcast to type with statically known members.
        MixinAbstractNumericIdentifierCreator(NonGTINNumericIdentifierValidatorConstructor) as MixinNumericIdentifierCreatorConstructor<
            TIdentifierDescriptor,
            TIdentifierValidator,
            BaseNonGTINNumericIdentifierValidator<
                TIdentifierValidator["identifierType"],
                TIdentifierValidator["leaderType"]
            >
        >
    ) implements BaseNonGTINNumericIdentifierCreator<
        TIdentifierValidator["identifierType"],
        TIdentifierValidator["leaderType"]
    > {
        /**
         * Constructor.
         *
         * @param prefixProvider
         * Prefix provider.
         *
         * @param identifierDescriptor
         * Identifier descriptor to pass to identifier validator constructor.
         */
        protected constructor(prefixProvider: PrefixProvider, identifierDescriptor: TIdentifierDescriptor) {
            super(prefixProvider, prefixProvider.gs1CompanyPrefix, identifierDescriptor);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Base class was upcast to type with statically known members for mixin; downcast result.
    return AbstractNonGTINNumericIdentifierCreator as unknown as MixinNonGTINNumericIdentifierCreatorConstructor<
        TIdentifierDescriptor,
        TIdentifierValidator,
        TIdentifierValidatorClass
    >;
}
