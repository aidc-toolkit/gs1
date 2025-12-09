import type { IdentifierExtensionConstructor, IdentifierValidatorConstructor } from "./abstract-identifier-creator.js";
import {
    MixinAbstractNumericIdentifierCreator,
    type NumericIdentifierCreatorConstructor
} from "./abstract-numeric-identifier-creator.js";
import type { IdentifierTypeValidator } from "./identifier-validators.js";
import type { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import type { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import type { NumericIdentifierValidation } from "./numeric-identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * Non-GTIN numeric identifier creator constructor type, which delegates to a non-GTIN numeric identifier validator
 * constructor.
 *
 * @template TNonGTINNumericIdentifierType
 * Non-GTIN numeric identifier type type.
 *
 * @template TNumericIdentifierValidator
 * Non-GTIN numeric identifier validator type.
 */
type NonGTINNumericIdentifierCreatorConstructor<
    TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType,
    TNonGTINNumericIdentifierValidator extends NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType>
> = IdentifierExtensionConstructor<
    [prefixProvider: PrefixProvider, identifierType: TNonGTINNumericIdentifierType],
    TNonGTINNumericIdentifierValidator & NonGTINNumericIdentifierCreator<TNonGTINNumericIdentifierType>
>;

/**
 * Mixin implementation of {@linkcode NonGTINNumericIdentifierCreator} with an appropriate non-GTIN numeric identifier
 * validator base.
 *
 * @template TNonGTINNumericIdentifierType
 * Non-GTIN numeric identifier type type.
 *
 * @param NonGTINNumericIdentifierValidatorBase
 * Non-GTIN numeric identifier validator base.
 *
 * @returns
 * Non-GTIN numeric identifier creator class.
 */
export function MixinAbstractNonGTINNumericIdentifierCreator<
    TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType,
    TNonGTINNumericIdentifierValidatorConstructor extends IdentifierValidatorConstructor<
        [TNonGTINNumericIdentifierType],
        TNonGTINNumericIdentifierType,
        NumericIdentifierValidation
    >
>(NonGTINNumericIdentifierValidatorBase: TNonGTINNumericIdentifierValidatorConstructor): NonGTINNumericIdentifierCreatorConstructor<
    TNonGTINNumericIdentifierType,
    IdentifierTypeValidator<TNonGTINNumericIdentifierType>
> {
    /**
     * Abstract non-GTIN numeric identifier creator. Implements common functionality for a non-GTIN numeric identifier
     * creator, mixed in with a matching non-GTIN numeric identifier validator.
     */
    abstract class AbstractNonGTINNumericIdentifierCreator extends (MixinAbstractNumericIdentifierCreator(NonGTINNumericIdentifierValidatorBase) as NumericIdentifierCreatorConstructor<
        [TNonGTINNumericIdentifierType],
        TNonGTINNumericIdentifierType,
        NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType>
    >) implements NonGTINNumericIdentifierCreator<TNonGTINNumericIdentifierType> {
        /**
         * Constructor. Typically called internally by a prefix manager but may be called by other code with another prefix
         * provider type.
         *
         * @param prefixProvider
         * Prefix provider.
         *
         * @param identifierType
         * Identifier type.
         */
        constructor(prefixProvider: PrefixProvider, identifierType: TNonGTINNumericIdentifierType) {
            super(prefixProvider, prefixProvider.gs1CompanyPrefix, identifierType);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Base class was upcast to type with statically known members for mixin, downcast result.
    return AbstractNonGTINNumericIdentifierCreator as IdentifierExtensionConstructor<
        ConstructorParameters<typeof AbstractNonGTINNumericIdentifierCreator>,
        IdentifierTypeValidator<TNonGTINNumericIdentifierType> & AbstractNonGTINNumericIdentifierCreator
    >;
}
