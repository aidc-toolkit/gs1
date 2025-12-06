import type { IdentifierType } from "./identifier-type.js";
import type { NumericIdentifierType } from "./numeric-identifier-type.js";

/**
 * Non-numeric identifier type.
 */
export type NonNumericIdentifierType = Exclude<IdentifierType, NumericIdentifierType>;
