import { pick } from "@aidc-toolkit/core";
import { NumericIdentifierTypes } from "./numeric-identifier-type.js";

/**
 * GTIN types.
 */
export const GTINTypes = pick(NumericIdentifierTypes,
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
