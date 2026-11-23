import { isValueType, pick, readonlyObjectValues } from "@aidc-toolkit/core";
import { NumericIdentifierTypes } from "./numeric-identifier-type.js";

/**
 * GTIN types.
 */
export const GTINTypes = pick(
    NumericIdentifierTypes,
    NumericIdentifierTypes.GTIN
);

/**
 * GTIN type key.
 */
export type GTINTypeKey = keyof typeof GTINTypes;

/**
 * GTIN type.
 */
export type GTINType = typeof GTINTypes[GTINTypeKey];

/**
 * GTIN type values.
 */
export const GTINTypeValues = readonlyObjectValues<GTINType>(GTINTypes);

/**
 * Determine if identifier type is a valid GTIN type.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is a GTIN type.
 */
export function isGTINType(identifierType: string): identifierType is GTINType {
    return isValueType(GTINTypeValues, identifierType);
}
