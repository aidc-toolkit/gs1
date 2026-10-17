import { exclude } from "@aidc-toolkit/core";
import { NonGTINNumericIdentifierTypes } from "./non-gtin-numeric-identifier-type.js";
import { NonSerializableNumericIdentifierTypes } from "./non-serializable-numeric-identifier-type.js";

/**
 * Serializable numeric identifier types.
 */
export const SerializableNumericIdentifierTypes = exclude(NonGTINNumericIdentifierTypes, NonSerializableNumericIdentifierTypes);

/**
 * Serializable numeric identifier type key.
 */
export type SerializableNumericIdentifierTypeKey = keyof typeof SerializableNumericIdentifierTypes;

/**
 * Serializable numeric identifier type.
 */
export type SerializableNumericIdentifierType = typeof SerializableNumericIdentifierTypes[SerializableNumericIdentifierTypeKey];

/**
 * Serializable numeric identifier type values.
 */
const SerializableNumericIdentifierTypeValues = Object.values<string>(SerializableNumericIdentifierTypes);

/**
 * Determine if identifier type is a valid serializable numeric identifier type.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is a valid serializable numeric identifier type.
 */
export function isSerializableNumericIdentifierType(identifierType: string): identifierType is SerializableNumericIdentifierType {
    return SerializableNumericIdentifierTypeValues.includes(identifierType);
}
