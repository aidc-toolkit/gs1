import type { IdentifierTypes } from "./identifier-type";
import type { NumericIdentifierType } from "./numeric-identifier-type";

/**
 * Non-GTIN numeric identifier type.
 */
export type NonGTINNumericIdentifierType = Exclude<NumericIdentifierType, typeof IdentifierTypes.GTIN>;
