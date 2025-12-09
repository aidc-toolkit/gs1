import { exclude } from "@aidc-toolkit/core";
import { GTINTypes } from "./gtin-type.js";
import { NumericIdentifierTypes } from "./numeric-identifier-type.js";

/**
 * Non-GTIN numeric identifier types.
 */
export const NonGTINNumericIdentifierTypes = exclude(NumericIdentifierTypes, GTINTypes);

/**
 * Non-GTIN numeric identifier type key.
 */
export type NonGTINNumericIdentifierTypeKey = keyof typeof NonGTINNumericIdentifierTypes;

/**
 * Non-GTIN numeric identifier type.
 */
export type NonGTINNumericIdentifierType = typeof NonGTINNumericIdentifierTypes[NonGTINNumericIdentifierTypeKey];
