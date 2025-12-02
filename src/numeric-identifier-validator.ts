import type { IdentifierTypes } from "./identifier-type";
import type { IdentifierValidation, IdentifierValidator } from "./identifier-validator";

/**
 * Numeric identifier type.
 */
export type NumericIdentifierType =
    typeof IdentifierTypes.GTIN |
    typeof IdentifierTypes.GLN |
    typeof IdentifierTypes.SSCC |
    typeof IdentifierTypes.GRAI |
    typeof IdentifierTypes.GSRN |
    typeof IdentifierTypes.GDTI |
    typeof IdentifierTypes.GSIN |
    typeof IdentifierTypes.GCN;

/**
 * Non-GTIN numeric identifier type.
 */
export type NonGTINNumericIdentifierType = Exclude<NumericIdentifierType, typeof IdentifierTypes.GTIN>;

/**
 * Leader type.
 */
export const LeaderTypes = {
    /**
     * No leader.
     */
    None: "None",

    /**
     * Indicator digit (GTIN only).
     */
    IndicatorDigit: "Indicator digit",

    /**
     * Extension digit (SSCC only).
     */
    ExtensionDigit: "Extension digit"
};

/**
 * Leader type.
 */
export type LeaderType = typeof LeaderTypes[keyof typeof LeaderTypes];

/**
 * Numeric identifier validation parameters.
 */
export interface NumericIdentifierValidation extends IdentifierValidation {
    /**
     * Position offset within a larger string. Some numeric identifier types have the prefix offset by one.
     */
    positionOffset?: number | undefined;
}

/**
 * Numeric identifier validator.
 */
export interface NumericIdentifierValidator<TNumericIdentifierType extends NumericIdentifierType = NumericIdentifierType> extends IdentifierValidator<TNumericIdentifierType, NumericIdentifierValidation> {
    /**
     * Get the leader type.
     */
    get leaderType(): LeaderType;
}
