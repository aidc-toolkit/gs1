import type { GTINType } from "../gtin-type.js";
import { type NumericIdentifierType, NumericIdentifierTypes } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { NumericIdentifierValidation } from "./base-numeric-identifier-validator.js";
import { type GTINValidator, GTINValidators } from "./gtin-validator.js";
import {
    type NonGTINNumericIdentifierValidator,
    NonGTINNumericIdentifierValidators
} from "./non-gtin-numeric-identifier-validator.js";

export type { NumericIdentifierValidation };

/**
 * Numeric identifier validator.
 */
export type NumericIdentifierValidator = GTINValidator | NonGTINNumericIdentifierValidator;

/**
 * Numeric identifier validators indexed by identifier type.
 */
export const NumericIdentifierValidators = {
    [NumericIdentifierTypes.GTIN]: GTINValidators,
    ...NonGTINNumericIdentifierValidators
} as const;

/**
 * Numeric identifier validator by identifier type and prefix type (GTIN identifier type only).
 */
export type NumericIdentifierTypeValidator<
    TIdentifierType extends NumericIdentifierType,
    TPrefixType extends TIdentifierType extends GTINType ?
        PrefixType :
        never = (
            TIdentifierType extends GTINType ?
                PrefixType :
                never
        )
> = TIdentifierType extends GTINType ?
    typeof NumericIdentifierValidators[TIdentifierType][TPrefixType] :
    typeof NumericIdentifierValidators[Exclude<TIdentifierType, GTINType>];
