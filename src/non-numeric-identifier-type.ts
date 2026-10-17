import { exclude } from "@aidc-toolkit/core";
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
const NonNumericIdentifierTypeValues = Object.values<string>(NonNumericIdentifierTypes);

/**
 * Determine if identifier type is a valid non-numeric identifier type.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is a valid non-numeric identifier type.
 */
export function isNonNumericIdentifierType(identifierType: string): identifierType is NonNumericIdentifierType {
    return NonNumericIdentifierTypeValues.includes(identifierType);
}
