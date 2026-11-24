import { type GTINType, isGTINType } from "../gtin-type.js";
import type { IdentifierType } from "../identifier-type.js";
import { type PrefixType, PrefixTypes } from "../prefix-type.js";
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
    NonNumericIdentifierDescriptors
} from "./non-numeric-identifier-descriptor.js";
import type { NonSerializableNumericIdentifierDescriptor } from "./non-serializable-numeric-identifier-descriptor.js";
import { type NumericIdentifierDescriptor, NumericIdentifierDescriptors } from "./numeric-identifier-descriptor.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";

/**
 * Identifier descriptor. Instantiations of this type are used to parameterize validators and creators.
 */
export type IdentifierDescriptor = NumericIdentifierDescriptor | NonNumericIdentifierDescriptor;

/**
 * Identifier descriptors indexed by identifier type.
 */
export const IdentifierDescriptors = {
    ...NumericIdentifierDescriptors,
    ...NonNumericIdentifierDescriptors
} as const;

/**
 * Identifier descriptor by identifier type and prefix type (GTIN identifier type only).
 */
export type IdentifierTypeDescriptor<
    TIdentifierType extends IdentifierType,
    TPrefixType extends TIdentifierType extends GTINType ?
        PrefixType :
        never = (
            TIdentifierType extends GTINType ?
                PrefixType :
                never
        )
> = TIdentifierType extends GTINType ?
    typeof IdentifierDescriptors[TIdentifierType][TPrefixType] :
    typeof IdentifierDescriptors[Exclude<TIdentifierType, GTINType>];

/**
 * Get the identifier descriptor for an identifier type and optional prefix type if identifier type is GTIN. If
 * identifier type is GTIN and no prefix type is provided, the GTIN-13 descriptor is returned.
 *
 * @param identifierType
 * Identifier type.
 *
 * @param prefixType
 * Prefix type.
 *
 * @returns
 * Identifier descriptor.
 */
export function getIdentifierDescriptor<
    TIdentifierType extends IdentifierType,
    TPrefixType extends TIdentifierType extends GTINType ?
        PrefixType :
        never = (
            TIdentifierType extends GTINType ?
                PrefixType :
                never
        )
>(identifierType: TIdentifierType, prefixType?: TPrefixType): IdentifierTypeDescriptor<TIdentifierType, TPrefixType> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Types are known to match.
    return (isGTINType(identifierType) ? IdentifierDescriptors[identifierType][prefixType ?? PrefixTypes.GS1CompanyPrefix] : IdentifierDescriptors[identifierType]) as IdentifierTypeDescriptor<TIdentifierType, TPrefixType>;
}

/**
 * Determine if identifier descriptors or descriptor is GTIN descriptors.
 *
 * @param identifierDescriptorsOrDescriptor
 * Identifier descriptors or descriptor.
 *
 * @returns
 * True if identifier descriptors or descriptor is GTIN descriptors.
 */
export function isGTINDescriptors(identifierDescriptorsOrDescriptor: typeof GTINDescriptors | IdentifierTypeDescriptor<IdentifierType, PrefixType>): identifierDescriptorsOrDescriptor is typeof GTINDescriptors {
    return Array.isArray(identifierDescriptorsOrDescriptor);
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
