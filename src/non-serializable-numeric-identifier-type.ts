import { pick } from "@aidc-toolkit/core";
import { NonGTINNumericIdentifierTypes } from "./non-gtin-numeric-identifier-type.js";

/**
 * Non-serializable numeric identifier types.
 */
export const NonSerializableNumericIdentifierTypes = pick(NonGTINNumericIdentifierTypes,
    NonGTINNumericIdentifierTypes.GLN,
    NonGTINNumericIdentifierTypes.SSCC,
    NonGTINNumericIdentifierTypes.GSRN,
    NonGTINNumericIdentifierTypes.GSIN
);

/**
 * Non-serializable numeric identifier type key.
 */
export type NonSerializableNumericIdentifierTypeKey = keyof typeof NonSerializableNumericIdentifierTypes;

/**
 * Non-serializable numeric identifier type.
 */
export type NonSerializableNumericIdentifierType = typeof NonSerializableNumericIdentifierTypes[NonSerializableNumericIdentifierTypeKey];

/**
 * Non-serializable numeric identifier type values.
 */
const NonSerializableNumericIdentifierTypeValues = Object.values<string>(NonSerializableNumericIdentifierTypes);

/**
 * Determine if identifier type is a valid non-serializable numeric identifier type.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if identifier type is a valid non-serializable numeric identifier type.
 */
export function isNonSerializableNumericIdentifierType(identifierType: string): identifierType is NonSerializableNumericIdentifierType {
    return NonSerializableNumericIdentifierTypeValues.includes(identifierType);
}
