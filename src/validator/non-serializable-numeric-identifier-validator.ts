import { GLN_DESCRIPTOR, GSIN_DESCRIPTOR, GSRN_DESCRIPTOR, SSCC_DESCRIPTOR } from "../descriptor/index.js";
import type { LeaderTypes } from "../leader-type.js";
import {
    type NonSerializableNumericIdentifierType,
    NonSerializableNumericIdentifierTypes
} from "../non-serializable-numeric-identifier-type.js";
import type {
    BaseNonSerializableNumericIdentifierValidator
} from "./base-non-serializable-numeric-identifier-validator.js";
import {
    ConcreteNonSerializableNumericIdentifierValidator
} from "./concrete-non-serializable-numeric-identifier-validator.js";

/**
 * GLN validator.
 */
export type GLNValidator = BaseNonSerializableNumericIdentifierValidator<typeof NonSerializableNumericIdentifierTypes.GLN, typeof LeaderTypes.None>;

/**
 * GLN validator.
 */
export const GLN_VALIDATOR: GLNValidator = new ConcreteNonSerializableNumericIdentifierValidator(GLN_DESCRIPTOR);

/**
 * SSCC validator.
 */
export type SSCCValidator = BaseNonSerializableNumericIdentifierValidator<typeof NonSerializableNumericIdentifierTypes.SSCC, typeof LeaderTypes.ExtensionDigit>;

/**
 * SSCC validator.
 */
export const SSCC_VALIDATOR: SSCCValidator = new ConcreteNonSerializableNumericIdentifierValidator(SSCC_DESCRIPTOR);

/**
 * GSRN validator.
 */
export type GSRNValidator = BaseNonSerializableNumericIdentifierValidator<typeof NonSerializableNumericIdentifierTypes.GSRN, typeof LeaderTypes.None>;

/**
 * GSRN validator.
 */
export const GSRN_VALIDATOR: GSRNValidator = new ConcreteNonSerializableNumericIdentifierValidator(GSRN_DESCRIPTOR);

/**
 * GSIN validator.
 */
export type GSINValidator = BaseNonSerializableNumericIdentifierValidator<typeof NonSerializableNumericIdentifierTypes.GSIN, typeof LeaderTypes.None>;

/**
 * GSIN validator.
 */
export const GSIN_VALIDATOR: GSINValidator = new ConcreteNonSerializableNumericIdentifierValidator(GSIN_DESCRIPTOR);

/**
 * Non-serializable numeric identifier validator.
 */
export type NonSerializableNumericIdentifierValidator = GLNValidator | SSCCValidator | GSRNValidator | GSINValidator;

/**
 * Non-serializable numeric identifier validator by identifier type.
 */
export type NonSerializableNumericIdentifierTypeValidator<TIdentifierType extends NonSerializableNumericIdentifierType> =
    TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.GLN ?
        GLNValidator :
        TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.SSCC ?
            SSCCValidator :
            TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.GSRN ?
                GSRNValidator :
                TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.GSIN ?
                    GSINValidator :
                    never;

/**
 * Non-serializable numeric identifier validators indexed by identifier type.
 */
export const NonSerializableNumericIdentifierValidators = {
    [NonSerializableNumericIdentifierTypes.GLN]: GLN_VALIDATOR,
    [NonSerializableNumericIdentifierTypes.SSCC]: SSCC_VALIDATOR,
    [NonSerializableNumericIdentifierTypes.GSRN]: GSRN_VALIDATOR,
    [NonSerializableNumericIdentifierTypes.GSIN]: GSIN_VALIDATOR
} as const;
