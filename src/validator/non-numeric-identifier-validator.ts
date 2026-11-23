import type { ContentCharacterSets } from "../content-character-set.js";
import { CPID_DESCRIPTOR, GIAI_DESCRIPTOR, GINC_DESCRIPTOR, GMN_DESCRIPTOR } from "../descriptor/index.js";
import { type NonNumericIdentifierType, NonNumericIdentifierTypes } from "../non-numeric-identifier-type.js";
import type {
    BaseNonNumericIdentifierValidator,
    NonNumericIdentifierValidation
} from "./base-non-numeric-identifier-validator.js";
import { ConcreteNonNumericIdentifierValidator } from "./concrete-non-numeric-identifier-validator.js";

export type { NonNumericIdentifierValidation };

/**
 * GIAI validator.
 */
export type GIAIValidator = BaseNonNumericIdentifierValidator<typeof NonNumericIdentifierTypes.GIAI, typeof ContentCharacterSets.AI82>;

/**
 * GIAI validator.
 */
export const GIAI_VALIDATOR: GIAIValidator = new ConcreteNonNumericIdentifierValidator(GIAI_DESCRIPTOR);

/**
 * GINC validator.
 */
export type GINCValidator = BaseNonNumericIdentifierValidator<typeof NonNumericIdentifierTypes.GINC, typeof ContentCharacterSets.AI82>;

/**
 * GINC validator.
 */
export const GINC_VALIDATOR: GINCValidator = new ConcreteNonNumericIdentifierValidator(GINC_DESCRIPTOR);

/**
 * CPID validator.
 */
export type CPIDValidator = BaseNonNumericIdentifierValidator<typeof NonNumericIdentifierTypes.CPID, typeof ContentCharacterSets.AI39>;

/**
 * CPID validator.
 */
export const CPID_VALIDATOR: CPIDValidator = new ConcreteNonNumericIdentifierValidator(CPID_DESCRIPTOR);

/**
 * GMN validator.
 */
export type GMNValidator = BaseNonNumericIdentifierValidator<typeof NonNumericIdentifierTypes.GMN, typeof ContentCharacterSets.AI82>;

/**
 * GMN validator.
 */
export const GMN_VALIDATOR: GMNValidator = new ConcreteNonNumericIdentifierValidator(GMN_DESCRIPTOR);

/**
 * Non-numeric identifier validator.
 */
export type NonNumericIdentifierValidator = GIAIValidator | GINCValidator | CPIDValidator | GMNValidator;

/**
 * Non-numeric identifier validator by identifier type.
 */
export type NonNumericIdentifierTypeValidator<TIdentifierType extends NonNumericIdentifierType> =
    TIdentifierType extends typeof NonNumericIdentifierTypes.GIAI ?
        GIAIValidator :
        TIdentifierType extends typeof NonNumericIdentifierTypes.GINC ?
            GINCValidator :
            TIdentifierType extends typeof NonNumericIdentifierTypes.CPID ?
                CPIDValidator :
                TIdentifierType extends typeof NonNumericIdentifierTypes.GMN ?
                    GMNValidator :
                    never;

/**
 * Non-numeric identifier validators indexed by identifier type.
 */
export const NonNumericIdentifierValidators = {
    [NonNumericIdentifierTypes.GIAI]: GIAI_VALIDATOR,
    [NonNumericIdentifierTypes.GINC]: GINC_VALIDATOR,
    [NonNumericIdentifierTypes.CPID]: CPID_VALIDATOR,
    [NonNumericIdentifierTypes.GMN]: GMN_VALIDATOR
} as const;
