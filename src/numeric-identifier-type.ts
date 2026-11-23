import { isValueType, pick, readonlyObjectValues } from "@aidc-toolkit/core";
import { IdentifierTypes } from "./identifier-type.js";

/**
 * Numeric identifier types.
 */
export const NumericIdentifierTypes = pick(
    IdentifierTypes,
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
export const NumericIdentifierTypeValues = readonlyObjectValues<NumericIdentifierType>(NumericIdentifierTypes);

/**
 * Determine if identifier type is a valid numeric identifier type.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is a numeric identifier type.
 */
export function isNumericIdentifierType(identifierType: string): identifierType is NumericIdentifierType {
    return isValueType(NumericIdentifierTypeValues, identifierType);
}
