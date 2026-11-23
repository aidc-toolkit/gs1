import type { GTINType } from "../gtin-type.js";
import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import { type NumericIdentifierType, NumericIdentifierTypes } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { NumericIdentifierValidation } from "./base-numeric-identifier-validator.js";
import { type GTINPrefixTypeValidator, type GTINValidator, GTINValidators } from "./gtin-validator.js";
import {
    type NonGTINNumericIdentifierTypeValidator,
    type NonGTINNumericIdentifierValidator,
    NonGTINNumericIdentifierValidators
} from "./non-gtin-numeric-identifier-validator.js";

export type { NumericIdentifierValidation };

/**
 * Numeric identifier validator.
 */
export type NumericIdentifierValidator = GTINValidator | NonGTINNumericIdentifierValidator;

/**
 * Numeric identifier validator by identifier type.
 */
export type NumericIdentifierTypeValidator<TIdentifierType extends NumericIdentifierType, TPrefixType extends TIdentifierType extends GTINType ? PrefixType : never = never> =
    TIdentifierType extends GTINType ?
        GTINPrefixTypeValidator<TPrefixType> :
        TIdentifierType extends NonGTINNumericIdentifierType ?
            NonGTINNumericIdentifierTypeValidator<TIdentifierType> :
            never;

/**
 * Numeric identifier validators indexed by identifier type.
 */
export const NumericIdentifierValidators = {
    [NumericIdentifierTypes.GTIN]: GTINValidators,
    ...NonGTINNumericIdentifierValidators
} as const;
