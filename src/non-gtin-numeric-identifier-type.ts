import type { IdentifierTypes } from "./identifier-type.js";
import type { NumericIdentifierType } from "./numeric-identifier-type.js";

/**
 * Non-GTIN numeric identifier type.
 */
export type NonGTINNumericIdentifierType = Exclude<NumericIdentifierType, typeof IdentifierTypes.GTIN>;
