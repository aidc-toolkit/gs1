import type { IdentifierType } from "./identifier-type";
import type { NumericIdentifierType } from "./numeric-identifier-type";

/**
 * Non-numeric identifier type.
 */
export type NonNumericIdentifierType = Exclude<IdentifierType, NumericIdentifierType>;
