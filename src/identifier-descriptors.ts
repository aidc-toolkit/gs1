import { ContentCharacterSets } from "./content-character-set.js";
import type { GTINDescriptor } from "./gtin-descriptor.js";
import { type GTINBaseLength, GTINBaseLengths } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import {
    type IdentifierTypeExtension,
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "./identifier-extension.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import { LeaderTypes } from "./leader-type.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import type { NonNumericIdentifierDescriptor } from "./non-numeric-identifier-descriptor.js";
import type { NonSerializableNumericIdentifierDescriptor } from "./non-serializable-numeric-identifier-descriptor.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import { PrefixTypes } from "./prefix-type.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";

/**
 * GTIN-13 descriptor.
 */
const GTIN13_DESCRIPTOR: GTINDescriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: GTINBaseLengths.GTIN13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN-12 descriptor.
 */
const GTIN12_DESCRIPTOR: GTINDescriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.UPCCompanyPrefix,
    length: GTINBaseLengths.GTIN12,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN-8 descriptor.
 */
const GTIN8_DESCRIPTOR: GTINDescriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.GS18Prefix,
    length: GTINBaseLengths.GTIN8,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN descriptors indexed by prefix type.
 */
const GTIN_DESCRIPTORS: Readonly<Record<GTINBaseLength, GTINDescriptor>> = {
    [GTINBaseLengths.GTIN13]: GTIN13_DESCRIPTOR,
    [GTINBaseLengths.GTIN12]: GTIN12_DESCRIPTOR,
    [GTINBaseLengths.GTIN8]: GTIN8_DESCRIPTOR
};

/**
 * GLN descriptor.
 */
const GLN_DESCRIPTOR: NonSerializableNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GLN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None
};

/**
 * SSCC descriptor.
 */
const SSCC_DESCRIPTOR: NonSerializableNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.SSCC,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 18,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.ExtensionDigit
};

/**
 * GRAI descriptor.
 */
const GRAI_DESCRIPTOR: SerializableNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GRAI,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None,
    serialComponentLength: 16,
    serialComponentCharacterSet: ContentCharacterSets.AI82
};

/**
 * GIAI descriptor.
 */
const GIAI_DESCRIPTOR: NonNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GIAI,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 30,
    referenceCharacterSet: ContentCharacterSets.AI82,
    requiresCheckCharacterPair: false
};

/**
 * GSRN descriptor.
 */
const GSRN_DESCRIPTOR: NonSerializableNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GSRN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 18,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None
};

/**
 * GDTI descriptor.
 */
const GDTI_DESCRIPTOR: SerializableNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GDTI,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None,
    serialComponentLength: 17,
    serialComponentCharacterSet: ContentCharacterSets.AI82
};

/**
 * GINC descriptor.
 */
const GINC_DESCRIPTOR: NonNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GINC,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 30,
    referenceCharacterSet: ContentCharacterSets.AI82,
    requiresCheckCharacterPair: false
};

/**
 * GSIN descriptor.
 */
const GSIN_DESCRIPTOR: NonSerializableNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GSIN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 17,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None
};

/**
 * GCN descriptor.
 */
const GCN_DESCRIPTOR: SerializableNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GCN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None,
    serialComponentLength: 12,
    serialComponentCharacterSet: ContentCharacterSets.Numeric
};

/**
 * CPID descriptor.
 */
const CPID_DESCRIPTOR: NonNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.CPID,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 30,
    referenceCharacterSet: ContentCharacterSets.AI39,
    requiresCheckCharacterPair: false
};

/**
 * GMN descriptor.
 */
const GMN_DESCRIPTOR: NonNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GMN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 25,
    referenceCharacterSet: ContentCharacterSets.AI82,
    requiresCheckCharacterPair: true
};

/**
 * Identifier descriptor type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierTypeDescriptor<TIdentifierType extends IdentifierType> = IdentifierTypeExtension<
    TIdentifierType,
    IdentifierDescriptor,
    NumericIdentifierDescriptor,
    GTINDescriptor,
    NonGTINNumericIdentifierDescriptor,
    NonSerializableNumericIdentifierDescriptor,
    SerializableNumericIdentifierDescriptor,
    NonNumericIdentifierDescriptor
>;

/**
 * Identifier descriptors entry type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierDescriptorsEntry<TIdentifierType extends IdentifierType> = TIdentifierType extends GTINType ?
    Readonly<Record<GTINBaseLength, GTINDescriptor>> :
    IdentifierTypeDescriptor<TIdentifierType>;

/**
 * Identifier descriptors record type.
 */
export type IdentifierDescriptorsRecord = {
    readonly [TIdentifierType in IdentifierType]: IdentifierDescriptorsEntry<TIdentifierType>;
};

/**
 * Identifier descriptors for all identifier types.
 */
export const IdentifierDescriptors: IdentifierDescriptorsRecord = {
    [IdentifierTypes.GTIN]: GTIN_DESCRIPTORS,
    [IdentifierTypes.GLN]: GLN_DESCRIPTOR,
    [IdentifierTypes.SSCC]: SSCC_DESCRIPTOR,
    [IdentifierTypes.GRAI]: GRAI_DESCRIPTOR,
    [IdentifierTypes.GIAI]: GIAI_DESCRIPTOR,
    [IdentifierTypes.GSRN]: GSRN_DESCRIPTOR,
    [IdentifierTypes.GDTI]: GDTI_DESCRIPTOR,
    [IdentifierTypes.GINC]: GINC_DESCRIPTOR,
    [IdentifierTypes.GSIN]: GSIN_DESCRIPTOR,
    [IdentifierTypes.GCN]: GCN_DESCRIPTOR,
    [IdentifierTypes.CPID]: CPID_DESCRIPTOR,
    [IdentifierTypes.GMN]: GMN_DESCRIPTOR
};

/**
 * Determine if identifier descriptors or descriptor is GTIN descriptors.
 *
 * @param identifierDescriptorsOrDescriptor
 * Identifier descriptors or descriptor.
 *
 * @returns
 * True if GTIN descriptors.
 */
export function isGTINDescriptors(identifierDescriptorsOrDescriptor: IdentifierDescriptorsEntry<IdentifierType>): identifierDescriptorsOrDescriptor is Readonly<Record<GTINBaseLength, GTINDescriptor>> {
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
