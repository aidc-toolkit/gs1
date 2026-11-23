import type { GTINType } from "../gtin-type.js";
import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import { type NumericIdentifierType, NumericIdentifierTypes } from "../numeric-identifier-type.js";
import type { PrefixType } from "../prefix-type.js";
import { type GTINDescriptor, GTINDescriptors, type GTINPrefixTypeDescriptor } from "./gtin-descriptor.js";
import {
    type NonGTINNumericIdentifierDescriptor,
    NonGTINNumericIdentifierDescriptors,
    type NonGTINNumericIdentifierTypeDescriptor
} from "./non-gtin-numeric-identifier-descriptor.js";

/**
 * Numeric identifier descriptor.
 */
export type NumericIdentifierDescriptor = GTINDescriptor | NonGTINNumericIdentifierDescriptor;

/**
 * Numeric identifier descriptor by identifier type.
 */
export type NumericIdentifierTypeDescriptor<TIdentifierType extends NumericIdentifierType, TPrefixType extends TIdentifierType extends GTINType ? PrefixType : never = never> =
    TIdentifierType extends GTINType ?
        GTINPrefixTypeDescriptor<TPrefixType> :
        TIdentifierType extends NonGTINNumericIdentifierType ?
            NonGTINNumericIdentifierTypeDescriptor<TIdentifierType> :
            never;

/**
 * Numeric identifier descriptors indexed by identifier type.
 */
export const NumericIdentifierDescriptors = {
    [NumericIdentifierTypes.GTIN]: GTINDescriptors,
    ...NonGTINNumericIdentifierDescriptors
} as const;
