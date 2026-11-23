import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import type { NonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import type { SerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import {
    type NonSerializableNumericIdentifierDescriptor,
    NonSerializableNumericIdentifierDescriptors,
    type NonSerializableNumericIdentifierTypeDescriptor
} from "./non-serializable-numeric-identifier-descriptor.js";
import {
    type SerializableNumericIdentifierDescriptor,
    SerializableNumericIdentifierDescriptors,
    type SerializableNumericIdentifierTypeDescriptor
} from "./serializable-numeric-identifier-descriptor.js";

/**
 * Non-GTIN numeric identifier descriptor.
 */
export type NonGTINNumericIdentifierDescriptor = NonSerializableNumericIdentifierDescriptor | SerializableNumericIdentifierDescriptor;

/**
 * Non-GTIN numeric identifier descriptor by identifier type.
 */
export type NonGTINNumericIdentifierTypeDescriptor<TIdentifierType extends NonGTINNumericIdentifierType> =
    TIdentifierType extends NonSerializableNumericIdentifierType ?
        NonSerializableNumericIdentifierTypeDescriptor<TIdentifierType> :
        TIdentifierType extends SerializableNumericIdentifierType ?
            SerializableNumericIdentifierTypeDescriptor<TIdentifierType> :
            never;

/**
 * Non-GTIN numeric identifier descriptors indexed by identifier type.
 */
export const NonGTINNumericIdentifierDescriptors = {
    ...NonSerializableNumericIdentifierDescriptors,
    ...SerializableNumericIdentifierDescriptors
} as const;
