import type { IdentifierTypes } from "./identifier-type";

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
} as const;

/**
 * Leader type key.
 */
export type LeaderTypeKey = keyof typeof LeaderTypes;

/**
 * Leader type.
 */
export type LeaderType = typeof LeaderTypes[LeaderTypeKey];
