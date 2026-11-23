import {
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "../descriptor/identifier-extension.js";
import type { GTINCreator } from "./gtin-creator.js";
import type { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";
import type { NonNumericIdentifierCreator, NonNumericIdentifierCreators } from "./non-numeric-identifier-creator.js";
import type { NonSerializableNumericIdentifierCreator } from "./non-serializable-numeric-identifier-creator.js";
import type { NumericIdentifierCreator, NumericIdentifierCreators } from "./numeric-identifier-creator.js";
import type { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator.js";

/**
 * Base identifier creator. Creates an identifier based on its definition in section 3 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}.
 *
 * Keys are created based on a prefix defined in a prefix provider to which the identifier creator is bound.
 */
export type IdentifierCreator = NumericIdentifierCreator | NonNumericIdentifierCreator;

/**
 * Identifier creators indexed by identifier type.
 */
export type IdentifierCreators = NumericIdentifierCreators & NonNumericIdentifierCreators;

/**
 * Determine if identifier creator is a numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a numeric identifier creator.
 */
export function isNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NumericIdentifierCreator {
    return isNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a GTIN creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a GTIN creator.
 */
export function isGTINCreator(identifierCreator: IdentifierCreator): identifierCreator is GTINCreator {
    return isGTINExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a non-GTIN numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a non-GTIN numeric identifier creator.
 */
export function isNonGTINNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NonGTINNumericIdentifierCreator {
    return isNonGTINNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a non-serializable numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a non-serializable numeric identifier creator.
 */
export function isNonSerializableNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NonSerializableNumericIdentifierCreator {
    return isNonSerializableNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a serializable numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a serializable numeric identifier creator.
 */
export function isSerializableNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is SerializableNumericIdentifierCreator {
    return isSerializableNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a non-numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a non-numeric identifier creator.
 */
export function isNonNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NonNumericIdentifierCreator {
    return isNonNumericIdentifierExtension(identifierCreator);
}
