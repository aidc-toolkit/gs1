import {
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "../descriptor/identifier-extension.js";
import type { GTINType } from "../gtin-type.js";
import type { IdentifierType } from "../identifier-type.js";
import type { NonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import type { NumericIdentifierType } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { IdentifierValidation } from "./base-identifier-validator.js";
import type { GTINValidator, GTINValidators } from "./gtin-validator.js";
import type { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import {
    type NonNumericIdentifierTypeValidator,
    type NonNumericIdentifierValidator,
    NonNumericIdentifierValidators
} from "./non-numeric-identifier-validator.js";
import type { NonSerializableNumericIdentifierValidator } from "./non-serializable-numeric-identifier-validator.js";
import {
    type NumericIdentifierTypeValidator,
    type NumericIdentifierValidator,
    NumericIdentifierValidators
} from "./numeric-identifier-validator.js";
import type { SerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator.js";

export type { IdentifierValidation };

/**
 * Identifier validator. Validates an identifier against its definition in section 3 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Implements common functionality for an
 * identifier validator.
 */
export type IdentifierValidator = NumericIdentifierValidator | NonNumericIdentifierValidator;

/**
 * Identifier validator by identifier type.
 */
export type IdentifierTypeValidator<TIdentifierType extends IdentifierType, TPrefixType extends TIdentifierType extends GTINType ? PrefixType : never = never> =
    TIdentifierType extends NumericIdentifierType ?
        NumericIdentifierTypeValidator<TIdentifierType, TPrefixType> :
        TIdentifierType extends NonNumericIdentifierType ?
            NonNumericIdentifierTypeValidator<TIdentifierType> :
            never;

/**
 * Identifier validators indexed by identifier type.
 */
export const IdentifierValidators = {
    ...NumericIdentifierValidators,
    ...NonNumericIdentifierValidators
} as const;

/**
 * Determine if identifier validators or validator is GTIN validators.
 *
 * @param identifierValidatorsOrValidator
 * Identifier validators or validator.
 *
 * @returns
 * True if identifier validators or validator is GTIN validators.
 */
export function isGTINValidators(identifierValidatorsOrValidator: typeof IdentifierValidators[IdentifierType]): identifierValidatorsOrValidator is typeof GTINValidators {
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
