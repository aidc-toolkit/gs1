import {
    isGTINDescriptor,
    isNonGTINNumericIdentifierDescriptor,
    isNonNumericIdentifierDescriptor,
    isNumericIdentifierDescriptor,
    isSerializableNumericIdentifierDescriptor
} from "./descriptors";
import type { GTINCreator } from "./gtin-creator";
import type { IdentifierCreator } from "./identifier-creator";
import type { IdentifierType, IdentifierTypes } from "./identifier-type";
import type { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type";
import type { NonNumericIdentifierCreator } from "./non-numeric-identifier-creator";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type";
import type { NumericIdentifierCreator } from "./numeric-identifier-creator";
import type { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type";

/**
 * Determine the identifier creator type for an identifier type.
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
