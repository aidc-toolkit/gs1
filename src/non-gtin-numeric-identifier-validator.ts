import { type IdentifierType, IdentifierTypes } from "./identifier-type";
import {
    AbstractNumericIdentifierValidator,
    type LeaderType,
    LeaderTypes,
    type NumericIdentifierType
} from "./numeric-identifier-validator";
import { PrefixTypes } from "./prefix-type";

/**
 * Non-GTIN numeric identifier type.
 */
export type NonGTINNumericIdentifierType = Exclude<NumericIdentifierType, typeof IdentifierTypes.GTIN>;

/**
 * Non-GTIN numeric identifier validator.
 */
export class NonGTINNumericIdentifierValidator extends AbstractNumericIdentifierValidator {
    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param length
     * Length.
     *
     * @param leaderType
     * Leader type.
     */
    constructor(identifierType: IdentifierType, length: number, leaderType: LeaderType = LeaderTypes.None) {
        super(identifierType, PrefixTypes.GS1CompanyPrefix, length, leaderType);
    }
}

/**
 * GLN validator.
 */
export const GLN_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.GLN, 13);

/**
 * SSCC validator.
 */
export const SSCC_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.SSCC, 18, LeaderTypes.ExtensionDigit);

/**
 * GSRN validator.
 */
export const GSRN_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.GSRN, 18);

/**
 * GSIN validator.
 */
export const GSIN_VALIDATOR = new NonGTINNumericIdentifierValidator(IdentifierTypes.GSIN, 17);
