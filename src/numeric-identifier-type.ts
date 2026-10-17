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

/**
 * Numeric identifier type values.
 */
const NumericIdentifierTypeValues = Object.values<string>(NumericIdentifierTypes);

/**
 * Determine if identifier type is a valid numeric identifier type.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is a valid numeric identifier type.
 */
export function isNumericIdentifierType(identifierType: string): identifierType is NumericIdentifierType {
    return NumericIdentifierTypeValues.includes(identifierType);
}
