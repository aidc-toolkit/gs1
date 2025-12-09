import { pick } from "@aidc-toolkit/core";
import { IdentifierTypes } from "./identifier-type.js";

/**
 * Numeric identifier types.
 */
export const NumericIdentifierTypes = pick(IdentifierTypes,
    IdentifierTypes.GTIN,
    IdentifierTypes.GLN,
    IdentifierTypes.SSCC,
    IdentifierTypes.GRAI,
    IdentifierTypes.GSRN,
    IdentifierTypes.GDTI,
    IdentifierTypes.GSIN,
    IdentifierTypes.GCN
);

/**
 * Numeric identifier type key.
 */
export type NumericIdentifierTypeKey = keyof typeof NumericIdentifierTypes;

/**
 * Numeric identifier type.
 */
export type NumericIdentifierType = typeof NumericIdentifierTypes[NumericIdentifierTypeKey];
