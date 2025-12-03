import {
    isGTINDescriptor,
    isGTINDescriptors,
    isNonGTINNumericIdentifierDescriptor,
    isNonNumericIdentifierDescriptor,
    isNumericIdentifierDescriptor,
    isSerializableNumericIdentifierDescriptor
} from "./descriptors";
import type { GTINBaseType } from "./gtin-type";
import { GTIN_VALIDATORS, type GTINValidator } from "./gtin-validator";
import { type IdentifierType, IdentifierTypes } from "./identifier-type";
import type { IdentifierValidator } from "./identifier-validator";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type";
import { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type";
import { NonNumericIdentifierValidator } from "./non-numeric-identifier-validator";
import type { NumericIdentifierValidator } from "./numeric-identifier-validator";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type";
import { SerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator";

/**
 * GLN validator.
 */
const GLN_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.GLN);

/**
 * SSCC validator.
 */
const SSCC_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.SSCC);

/**
 * GRAI validator.
 */
const GRAI_VALIDATOR = new SerializableNumericIdentifierValidator(IdentifierTypes.GRAI);

/**
 * GIAI validator.
 */
const GIAI_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.GIAI);

/**
 * GSRN validator.
 */
const GSRN_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.GSRN);

/**
 * GDTI validator.
 */
const GDTI_VALIDATOR = new SerializableNumericIdentifierValidator(IdentifierTypes.GDTI);

/**
 * GINC validator.
 */
const GINC_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.GINC);

/**
 * GSIN validator.
 */
const GSIN_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.GSIN);

/**
 * GCN validator.
 */
const GCN_VALIDATOR = new SerializableNumericIdentifierValidator(IdentifierTypes.GCN);

/**
 * CPID validator.
 */
const CPID_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.CPID);

/**
 * GMN validator.
 */
const GMN_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.GMN);

/**
 * Identifier validator type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierTypeValidator<TIdentifierType extends IdentifierType> = TIdentifierType extends NonNumericIdentifierType ?
    NonNumericIdentifierValidator :
    TIdentifierType extends SerializableNumericIdentifierType ?
        SerializableNumericIdentifierValidator :
        TIdentifierType extends NonGTINNumericIdentifierType ?
            NonGTINNumericIdentifierValidator :
            TIdentifierType extends typeof IdentifierTypes.GTIN ?
                GTINValidator :
                IdentifierValidator;

/**
 * Identifier validators entry type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierValidatorsEntry<TIdentifierType extends IdentifierType> = TIdentifierType extends typeof IdentifierTypes.GTIN ?
    Readonly<Record<GTINBaseType, GTINValidator>> :
    IdentifierTypeValidator<TIdentifierType>;

/**
 * Identifier validators record type.
 */
export type IdentifierValidatorsRecord = {
    [TIdentifierType in IdentifierType]: IdentifierValidatorsEntry<TIdentifierType>;
};

/**
 * Identifier validators for all identifier types.
 */
export const IdentifierValidators: IdentifierValidatorsRecord = {
    [IdentifierTypes.GTIN]: GTIN_VALIDATORS,
    [IdentifierTypes.GLN]: GLN_VALIDATOR,
    [IdentifierTypes.SSCC]: SSCC_VALIDATOR,
    [IdentifierTypes.GRAI]: GRAI_VALIDATOR,
    [IdentifierTypes.GIAI]: GIAI_VALIDATOR,
    [IdentifierTypes.GSRN]: GSRN_VALIDATOR,
    [IdentifierTypes.GDTI]: GDTI_VALIDATOR,
    [IdentifierTypes.GINC]: GINC_VALIDATOR,
    [IdentifierTypes.GSIN]: GSIN_VALIDATOR,
    [IdentifierTypes.GCN]: GCN_VALIDATOR,
    [IdentifierTypes.CPID]: CPID_VALIDATOR,
    [IdentifierTypes.GMN]: GMN_VALIDATOR
} as const;

/**
 * Determine if identifier validators or validator is GTIN validators.
 *
 * @param identifierValidatorsOrValidator
 * Identifier validators or validator.
 *
 * @returns
 * True if GTIN validators.
 */
export function isGTINValidators(identifierValidatorsOrValidator: IdentifierValidatorsEntry<IdentifierType>): identifierValidatorsOrValidator is Readonly<Record<GTINBaseType, GTINValidator>> {
    return isGTINDescriptors(identifierValidatorsOrValidator);
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
    return isNumericIdentifierDescriptor(identifierValidator);
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
    return isGTINDescriptor(identifierValidator);
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
    return isNonGTINNumericIdentifierDescriptor(identifierValidator);
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
    return isSerializableNumericIdentifierDescriptor(identifierValidator);
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
    return isNonNumericIdentifierDescriptor(identifierValidator);
}
