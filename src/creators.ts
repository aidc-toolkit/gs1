import {
    isGTINDescriptor,
    isNonGTINNumericIdentifierDescriptor,
    isNonNumericIdentifierDescriptor,
    isNumericIdentifierDescriptor,
    isSerializableNumericIdentifierDescriptor
} from "./descriptors.js";
import type { GTINCreator } from "./gtin-creator.js";
import type { IdentifierCreator } from "./identifier-creator.js";
import type { IdentifierType, IdentifierTypes } from "./identifier-type.js";
import type { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import type { NonNumericIdentifierCreator } from "./non-numeric-identifier-creator.js";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type.js";
import type { NumericIdentifierCreator } from "./numeric-identifier-creator.js";
import type { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";

/**
 * Determine the identifier creator type for an identifier type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierTypeCreator<TIdentifierType extends IdentifierType> = TIdentifierType extends NonNumericIdentifierType ?
    NonNumericIdentifierCreator :
    TIdentifierType extends SerializableNumericIdentifierType ?
        SerializableNumericIdentifierCreator :
        TIdentifierType extends NonGTINNumericIdentifierType ?
            NonGTINNumericIdentifierCreator :
            TIdentifierType extends typeof IdentifierTypes.GTIN ?
                GTINCreator :
                IdentifierCreator;

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
    return isNumericIdentifierDescriptor(identifierCreator);
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
    return isGTINDescriptor(identifierCreator);
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
    return isNonGTINNumericIdentifierDescriptor(identifierCreator);
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
    return isSerializableNumericIdentifierDescriptor(identifierCreator);
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
    return isNonNumericIdentifierDescriptor(identifierCreator);
}
