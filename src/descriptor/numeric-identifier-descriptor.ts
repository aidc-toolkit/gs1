import type { GTINType } from "../gtin-type.js";
import { type NumericIdentifierType, NumericIdentifierTypes } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import { type GTINDescriptor, GTINDescriptors } from "./gtin-descriptor.js";
import {
    type NonGTINNumericIdentifierDescriptor,
    NonGTINNumericIdentifierDescriptors
} from "./non-gtin-numeric-identifier-descriptor.js";

/**
 * Numeric identifier descriptor.
 */
export type NumericIdentifierDescriptor = GTINDescriptor | NonGTINNumericIdentifierDescriptor;

/**
 * Numeric identifier descriptors indexed by identifier type.
 */
export const NumericIdentifierDescriptors = {
    [NumericIdentifierTypes.GTIN]: GTINDescriptors,
    ...NonGTINNumericIdentifierDescriptors
} as const;

/**
 * Numeric identifier descriptor by identifier type and prefix type (GTIN identifier type only).
 */
export type NumericIdentifierTypeDescriptor<
    TIdentifierType extends NumericIdentifierType,
    TPrefixType extends TIdentifierType extends GTINType ?
        PrefixType :
        never = (
            TIdentifierType extends GTINType ?
                PrefixType :
                never
        )
> = TIdentifierType extends GTINType ?
    typeof NumericIdentifierDescriptors[TIdentifierType][TPrefixType] :
    typeof NumericIdentifierDescriptors[Exclude<TIdentifierType, GTINType>];
