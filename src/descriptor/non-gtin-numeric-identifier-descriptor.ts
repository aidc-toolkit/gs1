import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import {
    type NonSerializableNumericIdentifierDescriptor,
    NonSerializableNumericIdentifierDescriptors
} from "./non-serializable-numeric-identifier-descriptor.js";
import {
    type SerializableNumericIdentifierDescriptor,
    SerializableNumericIdentifierDescriptors
} from "./serializable-numeric-identifier-descriptor.js";

/**
 * Non-GTIN numeric identifier descriptor.
 */
export type NonGTINNumericIdentifierDescriptor = NonSerializableNumericIdentifierDescriptor | SerializableNumericIdentifierDescriptor;

/**
 * Non-GTIN numeric identifier descriptors indexed by identifier type.
 */
export const NonGTINNumericIdentifierDescriptors = {
    ...NonSerializableNumericIdentifierDescriptors,
    ...SerializableNumericIdentifierDescriptors
} as const;

/**
 * Non-GTIN numeric identifier descriptor by identifier type.
 */
export type NonGTINNumericIdentifierTypeDescriptor<TIdentifierType extends NonGTINNumericIdentifierType> =
    typeof NonGTINNumericIdentifierDescriptors[TIdentifierType];
