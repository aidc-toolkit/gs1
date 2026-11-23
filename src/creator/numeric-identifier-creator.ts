import type { GTINCreator, GTINCreators } from "./gtin-creator.js";
import type {
    NonGTINNumericIdentifierCreator,
    NonGTINNumericIdentifierCreators
} from "./non-gtin-numeric-identifier-creator.js";

/**
 * Numeric identifier creator.
 */
export type NumericIdentifierCreator = GTINCreator | NonGTINNumericIdentifierCreator;

/**
 * Numeric identifier creators indexed by identifier type.
 */
export type NumericIdentifierCreators = GTINCreators & NonGTINNumericIdentifierCreators;
