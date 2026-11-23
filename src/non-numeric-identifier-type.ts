import { exclude, isValueType, readonlyObjectValues } from "@aidc-toolkit/core";
import { IdentifierTypes } from "./identifier-type.js";
import { NumericIdentifierTypes } from "./numeric-identifier-type.js";

/**
 * Non-numeric identifier types.
 */
export const NonNumericIdentifierTypes = exclude(IdentifierTypes, NumericIdentifierTypes);

/**
 * Non-numeric identifier type key.
 */
export type NonNumericIdentifierTypeKey = keyof typeof NonNumericIdentifierTypes;

/**
 * Non-numeric identifier type.
 */
export type NonNumericIdentifierType = typeof NonNumericIdentifierTypes[NonNumericIdentifierTypeKey];

/**
 * Non-numeric identifier type values.
 */
export const NonNumericIdentifierTypeValues = readonlyObjectValues<NonNumericIdentifierType>(NonNumericIdentifierTypes);

/**
 * Determine if identifier type is a valid non-numeric identifier type.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is a non-numeric identifier type.
 */
export function isNonNumericIdentifierType(identifierType: string): identifierType is NonNumericIdentifierType {
    return isValueType(NonNumericIdentifierTypeValues, identifierType);
}
