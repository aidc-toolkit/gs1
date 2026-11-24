import {
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "../descriptor/identifier-extension.js";
import { type GTINType, isGTINType } from "../gtin-type.js";
import type { IdentifierType } from "../identifier-type.js";
import { type PrefixType, PrefixTypes } from "../prefix-type.js";
import type { IdentifierValidation } from "./base-identifier-validator.js";
import type { GTINValidator, GTINValidators } from "./gtin-validator.js";
import type { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import {
    type NonNumericIdentifierValidator,
    NonNumericIdentifierValidators
} from "./non-numeric-identifier-validator.js";
import type { NonSerializableNumericIdentifierValidator } from "./non-serializable-numeric-identifier-validator.js";
import { type NumericIdentifierValidator, NumericIdentifierValidators } from "./numeric-identifier-validator.js";
import type { SerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator.js";

export type { IdentifierValidation };

/**
 * Identifier validator. Validates an identifier against its definition in section 3 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Implements common functionality for an
 * identifier validator.
 */
export type IdentifierValidator = NumericIdentifierValidator | NonNumericIdentifierValidator;

/**
 * Identifier validators indexed by identifier type.
 */
export const IdentifierValidators = {
    ...NumericIdentifierValidators,
    ...NonNumericIdentifierValidators
} as const;

/**
 * Identifier validator by identifier type and prefix type (GTIN identifier type only).
 */
export type IdentifierTypeValidator<
    TIdentifierType extends IdentifierType,
    TPrefixType extends TIdentifierType extends GTINType ?
        PrefixType :
        never = (
            TIdentifierType extends GTINType ?
                typeof PrefixTypes.GS1CompanyPrefix :
                never
        )
> = TIdentifierType extends GTINType ?
    typeof IdentifierValidators[TIdentifierType][TPrefixType] :
    typeof IdentifierValidators[Exclude<TIdentifierType, GTINType>];

/**
 * Get the identifier validator for an identifier type and optional prefix type if identifier type is GTIN. If
 * identifier type is GTIN and no prefix type is provided, the GTIN-13 validator is returned.
 *
 * @param identifierType
 * Identifier type.
 *
 * @param prefixType
 * Prefix type.
 *
 * @returns
 * Identifier validator.
 */
export function getIdentifierValidator<
    TIdentifierType extends IdentifierType,
    TPrefixType extends TIdentifierType extends GTINType ?
        PrefixType :
        never = (
            TIdentifierType extends GTINType ?
                PrefixType :
                never
        )
>(identifierType: TIdentifierType, prefixType?: TPrefixType): IdentifierTypeValidator<TIdentifierType, TPrefixType> & IdentifierValidator {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Types are known to match.
    return (isGTINType(identifierType) ? IdentifierValidators[identifierType][prefixType ?? PrefixTypes.GS1CompanyPrefix] : IdentifierValidators[identifierType]) as IdentifierTypeValidator<TIdentifierType, TPrefixType>;
}

/**
 * Determine if identifier validators or validator is GTIN validators.
 *
 * @param identifierValidatorsOrValidator
 * Identifier validators or validator.
 *
 * @returns
 * True if identifier validators or validator is GTIN validators.
 */
export function isGTINValidators(identifierValidatorsOrValidator: typeof GTINValidators | IdentifierTypeValidator<IdentifierType, PrefixType>): identifierValidatorsOrValidator is typeof GTINValidators {
    return !("identifierType" in identifierValidatorsOrValidator);
}

/**
 * Determine if identifier validator is a numeric identifier validator.
 *
 * @param identifierValidator
 * Identifier validator.
 *
 * @returns
 * True if identifier validator is a numeric identifier validator.
 */
export function isNumericIdentifierValidator(identifierValidator: IdentifierValidator): identifierValidator is NumericIdentifierValidator {
    return isNumericIdentifierExtension(identifierValidator);
}

/**
 * Determine if identifier validator is a GTIN validator.
 *
 * @param identifierValidator
 * Identifier validator.
 *
 * @returns
 * True if identifier validator is a GTIN validator.
 */
export function isGTINValidator(identifierValidator: IdentifierValidator): identifierValidator is GTINValidator {
    return isGTINExtension(identifierValidator);
}

/**
 * Determine if identifier validator is a non-GTIN numeric identifier validator.
 *
 * @param identifierValidator
 * Identifier validator.
 *
 * @returns
 * True if identifier validator is a non-GTIN numeric identifier validator.
 */
export function isNonGTINNumericIdentifierValidator(identifierValidator: IdentifierValidator): identifierValidator is NonGTINNumericIdentifierValidator {
    return isNonGTINNumericIdentifierExtension(identifierValidator);
}

/**
 * Determine if identifier validator is a non-serializable numeric identifier validator.
 *
 * @param identifierValidator
 * Identifier validator.
 *
 * @returns
 * True if identifier validator is a non-serializable numeric identifier validator.
 */
export function isNonSerializableNumericIdentifierValidator(identifierValidator: IdentifierValidator): identifierValidator is NonSerializableNumericIdentifierValidator {
    return isNonSerializableNumericIdentifierExtension(identifierValidator);
}

/**
 * Determine if identifier validator is a serializable numeric identifier validator.
 *
 * @param identifierValidator
 * Identifier validator.
 *
 * @returns
 * True if identifier validator is a serializable numeric identifier validator.
 */
export function isSerializableNumericIdentifierValidator(identifierValidator: IdentifierValidator): identifierValidator is SerializableNumericIdentifierValidator {
    return isSerializableNumericIdentifierExtension(identifierValidator);
}

/**
 * Determine if identifier validator is a non-numeric identifier validator.
 *
 * @param identifierValidator
 * Identifier validator.
 *
 * @returns
 * True if identifier validator is a non-numeric identifier validator.
 */
export function isNonNumericIdentifierValidator(identifierValidator: IdentifierValidator): identifierValidator is NonNumericIdentifierValidator {
    return isNonNumericIdentifierExtension(identifierValidator);
}
