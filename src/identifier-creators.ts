import type { GTINCreator } from "./gtin-creator.js";
import type { IdentifierCreator } from "./identifier-creator.js";
import {
    type IdentifierTypeExtension,
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "./identifier-extension.js";
import type { IdentifierType } from "./identifier-type.js";
import type { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";
import type { NonNumericIdentifierCreator } from "./non-numeric-identifier-creator.js";
import type { NonSerializableNumericIdentifierCreator } from "./non-serializable-numeric-identifier-creator.js";
import type { NumericIdentifierCreator } from "./numeric-identifier-creator.js";
import type { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator.js";

/**
 * Identifier creator type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierTypeCreator<TIdentifierType extends IdentifierType> = IdentifierTypeExtension<
    TIdentifierType,
    IdentifierCreator,
    NumericIdentifierCreator,
    GTINCreator,
    NonGTINNumericIdentifierCreator,
    NonSerializableNumericIdentifierCreator,
    SerializableNumericIdentifierCreator,
    NonNumericIdentifierCreator
>;

/**
 * Identifier creators entry type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierCreatorsEntry<TIdentifierType extends IdentifierType> = IdentifierTypeCreator<TIdentifierType>;

/**
 * Identifier creators record type.
 */
export type IdentifierCreatorsRecord = {
    [TIdentifierType in IdentifierType]: IdentifierCreatorsEntry<TIdentifierType>;
};

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
