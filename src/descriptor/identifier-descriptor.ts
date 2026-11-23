import type { GTINType } from "../gtin-type.js";
import type { IdentifierType } from "../identifier-type.js";
import type { NonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import type { NumericIdentifierType } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { GTINDescriptor, GTINDescriptors } from "./gtin-descriptor.js";
import {
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "./identifier-extension.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import {
    type NonNumericIdentifierDescriptor,
    NonNumericIdentifierDescriptors,
    type NonNumericIdentifierTypeDescriptor
} from "./non-numeric-identifier-descriptor.js";
import type { NonSerializableNumericIdentifierDescriptor } from "./non-serializable-numeric-identifier-descriptor.js";
import {
    type NumericIdentifierDescriptor,
    NumericIdentifierDescriptors,
    type NumericIdentifierTypeDescriptor
} from "./numeric-identifier-descriptor.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";

/**
 * Identifier descriptor. Instantiations of this type are used to parameterize validators and creators.
 */
export type IdentifierDescriptor = NumericIdentifierDescriptor | NonNumericIdentifierDescriptor;

/**
 * Identifier descriptor by identifier type.
 */
export type IdentifierTypeDescriptor<TIdentifierType extends IdentifierType, TPrefixType extends TIdentifierType extends GTINType ? PrefixType : never = never> =
    TIdentifierType extends NumericIdentifierType ?
        NumericIdentifierTypeDescriptor<TIdentifierType, TPrefixType> :
        TIdentifierType extends NonNumericIdentifierType ?
            NonNumericIdentifierTypeDescriptor<TIdentifierType> :
            never;

/**
 * Identifier descriptors indexed by identifier type.
 */
export const IdentifierDescriptors = {
    ...NumericIdentifierDescriptors,
    ...NonNumericIdentifierDescriptors
} as const;

/**
 * Determine if identifier descriptors or descriptor is GTIN descriptors.
 *
 * @param identifierDescriptorsOrDescriptor
 * Identifier descriptors or descriptor.
 *
 * @returns
 * True if identifier descriptors or descriptor is GTIN descriptors.
 */
export function isGTINDescriptors(identifierDescriptorsOrDescriptor: typeof IdentifierDescriptors[IdentifierType]): identifierDescriptorsOrDescriptor is typeof GTINDescriptors {
    return !("identifierType" in identifierDescriptorsOrDescriptor);
}

/**
 * Determine if identifier descriptor is a numeric identifier descriptor.
 *
 * @param identifierDescriptor
 * Identifier descriptor.
 *
 * @returns
 * True if identifier descriptor is a numeric identifier descriptor.
 */
export function isNumericIdentifierDescriptor(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is NumericIdentifierDescriptor {
    return isNumericIdentifierExtension(identifierDescriptor);
}

/**
 * Determine if identifier descriptor is a GTIN descriptor.
 *
 * @param identifierDescriptor
 * Identifier descriptor.
 *
 * @returns
 * True if identifier descriptor is a GTIN descriptor.
 */
export function isGTINDescriptor(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is GTINDescriptor {
    return isGTINExtension(identifierDescriptor);
}

/**
 * Determine if identifier descriptor is a non-GTIN numeric identifier descriptor.
 *
 * @param identifierDescriptor
 * Identifier descriptor.
 *
 * @returns
 * True if identifier descriptor is a non-GTIN numeric identifier descriptor.
 */
export function isNonGTINNumericIdentifierDescriptor(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is NonGTINNumericIdentifierDescriptor {
    return isNonGTINNumericIdentifierExtension(identifierDescriptor);
}

/**
 * Determine if identifier descriptor is a non-serializable numeric identifier descriptor.
 *
 * @param identifierDescriptor
 * Identifier descriptor.
 *
 * @returns
 * True if identifier descriptor is a non-serializable numeric identifier descriptor.
 */
export function isNonSerializableNumericIdentifierDescriptor(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is NonSerializableNumericIdentifierDescriptor {
    return isNonSerializableNumericIdentifierExtension(identifierDescriptor);
}

/**
 * Determine if identifier descriptor is a serializable numeric identifier descriptor.
 *
 * @param identifierDescriptor
 * Identifier descriptor.
 *
 * @returns
 * True if identifier descriptor is a serializable numeric identifier descriptor.
 */
export function isSerializableNumericIdentifierDescriptor(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is SerializableNumericIdentifierDescriptor {
    return isSerializableNumericIdentifierExtension(identifierDescriptor);
}

/**
 * Determine if identifier descriptor is a non-numeric identifier descriptor.
 *
 * @param identifierDescriptor
 * Identifier descriptor.
 *
 * @returns
 * True if identifier descriptor is a non-numeric identifier descriptor.
 */
export function isNonNumericIdentifierDescriptor(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is NonNumericIdentifierDescriptor {
    return isNonNumericIdentifierExtension(identifierDescriptor);
}
