import type { GTINBaseLength } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import { GTIN_VALIDATORS, type GTINValidator } from "./gtin-validator.js";
import { isGTINDescriptors } from "./identifier-descriptors.js";
import {
    type IdentifierTypeExtension,
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "./identifier-extension.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import type { IdentifierValidator } from "./identifier-validator.js";
import type { NonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import { NonNumericIdentifierValidator } from "./non-numeric-identifier-validator.js";
import { NonSerializableNumericIdentifierValidator } from "./non-serializable-numeric-identifier-validator.js";
import type { NumericIdentifierValidator } from "./numeric-identifier-validator.js";
import { SerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator.js";

/**
 * GLN validator.
 */
const GLN_VALIDATOR = new NonSerializableNumericIdentifierValidator(IdentifierTypes.GLN);

/**
 * SSCC validator.
 */
const SSCC_VALIDATOR = new NonSerializableNumericIdentifierValidator(IdentifierTypes.SSCC);

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
const GSRN_VALIDATOR = new NonSerializableNumericIdentifierValidator(IdentifierTypes.GSRN);

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
const GSIN_VALIDATOR = new NonSerializableNumericIdentifierValidator(IdentifierTypes.GSIN);

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
export type IdentifierTypeValidator<TIdentifierType extends IdentifierType> = IdentifierTypeExtension<
    TIdentifierType,
    IdentifierValidator,
    NumericIdentifierValidator,
    GTINValidator,
    NonGTINNumericIdentifierValidator,
    NonSerializableNumericIdentifierValidator,
    SerializableNumericIdentifierValidator,
    NonNumericIdentifierValidator
>;

/**
 * Identifier validators entry type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierValidatorsEntry<TIdentifierType extends IdentifierType> = TIdentifierType extends GTINType ?
    Readonly<Record<GTINBaseLength, GTINValidator>> :
    IdentifierTypeValidator<TIdentifierType>;

/**
 * Identifier validators record type.
 */
export type IdentifierValidatorsRecord = {
    readonly [TIdentifierType in IdentifierType]: IdentifierValidatorsEntry<TIdentifierType>;
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
};

/**
 * Determine if identifier validators or validator is GTIN validators.
 *
 * @param identifierValidatorsOrValidator
 * Identifier validators or validator.
 *
 * @returns
 * True if GTIN validators.
 */
export function isGTINValidators(identifierValidatorsOrValidator: IdentifierValidatorsEntry<IdentifierType>): identifierValidatorsOrValidator is Readonly<Record<GTINBaseLength, GTINValidator>> {
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
