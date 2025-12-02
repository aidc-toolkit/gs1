import { AbstractNumericIdentifierValidator } from "./abstract-numeric-identifier-validator";
import { IdentifierTypes } from "./identifier-type";
import {
    type LeaderType,
    LeaderTypes,
    type NonGTINNumericIdentifierType
} from "./numeric-identifier-validator";

/**
 * Non-GTIN numeric identifier validator.
 */
export class NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType = NonGTINNumericIdentifierType> extends AbstractNumericIdentifierValidator<TNonGTINNumericIdentifierType> {
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
    constructor(identifierType: TNonGTINNumericIdentifierType, length: number, leaderType: LeaderType = LeaderTypes.None) {
        super(identifierType, length, leaderType);
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
