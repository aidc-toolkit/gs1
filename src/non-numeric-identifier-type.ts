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
