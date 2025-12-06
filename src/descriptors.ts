import { ContentCharacterSets } from "./content-character-set.js";
import type { GTINDescriptor } from "./gtin-descriptor.js";
import { type GTINBaseType, GTINTypes } from "./gtin-type.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import type { NonNumericIdentifierDescriptor } from "./non-numeric-identifier-descriptor.js";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import { LeaderTypes, type NumericIdentifierType } from "./numeric-identifier-type.js";
import { PrefixTypes } from "./prefix-type.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";

/**
 * GTIN-13 descriptor.
 */
const GTIN13_DESCRIPTOR: GTINDescriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: GTINTypes.GTIN13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN-12 descriptor.
 */
const GTIN12_DESCRIPTOR: GTINDescriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.UPCCompanyPrefix,
    length: GTINTypes.GTIN12,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN-8 descriptor.
 */
const GTIN8_DESCRIPTOR: GTINDescriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.GS18Prefix,
    length: GTINTypes.GTIN8,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN descriptors indexed by prefix type.
 */
const GTIN_DESCRIPTORS: Readonly<Record<GTINBaseType, GTINDescriptor>> = {
    [GTINTypes.GTIN13]: GTIN13_DESCRIPTOR,
    [GTINTypes.GTIN12]: GTIN12_DESCRIPTOR,
    [GTINTypes.GTIN8]: GTIN8_DESCRIPTOR
};

/**
 * GLN descriptor.
 */
const GLN_DESCRIPTOR: NonGTINNumericIdentifierDescriptor = {
    identifierType: IdentifierTypes.GLN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None
};

/**
 * SSCC descriptor.
 */
const SSCC_DESCRIPTOR: NonGTINNumericIdentifierDescriptor = {
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
const GSRN_DESCRIPTOR: NonGTINNumericIdentifierDescriptor = {
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
const GSIN_DESCRIPTOR: NonGTINNumericIdentifierDescriptor = {
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
export type IdentifierTypeDescriptor<TIdentifierType extends IdentifierType> = TIdentifierType extends NonNumericIdentifierType ?
    NonNumericIdentifierDescriptor :
    TIdentifierType extends SerializableNumericIdentifierType ?
        SerializableNumericIdentifierDescriptor :
        TIdentifierType extends NonGTINNumericIdentifierType ?
            NonGTINNumericIdentifierDescriptor :
            TIdentifierType extends typeof IdentifierTypes.GTIN ?
                GTINDescriptor :
                IdentifierDescriptor;

/**
 * Identifier descriptors entry type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierDescriptorsEntry<TIdentifierType extends IdentifierType> = TIdentifierType extends typeof IdentifierTypes.GTIN ?
    Readonly<Record<GTINBaseType, GTINDescriptor>> :
    IdentifierTypeDescriptor<TIdentifierType>;

/**
 * Identifier descriptors record type.
 */
export type IdentifierDescriptorsRecord = {
    [TIdentifierType in IdentifierType]: IdentifierDescriptorsEntry<TIdentifierType>;
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
} as const;

/**
 * Determine if identifier descriptors or descriptor is GTIN descriptors.
 *
 * @param identifierDescriptorsOrDescriptor
 * Identifier descriptors or descriptor.
 *
 * @returns
 * True if GTIN descriptors.
 */
export function isGTINDescriptors(identifierDescriptorsOrDescriptor: IdentifierDescriptorsEntry<IdentifierType>): identifierDescriptorsOrDescriptor is Readonly<Record<GTINBaseType, GTINDescriptor>> {
    return !("identifierType" in identifierDescriptorsOrDescriptor);
}

/**
 * Determine if an array of identifier types includes a given identifier type.
 *
 * @param identifierTypes
 * Identifier types.
 *
 * @param identifierType
 * Identifier type.
 *
 * @returns
 * True if element is included in the array.
 */
function identifierTypesIncludes(identifierTypes: readonly IdentifierType[], identifierType: IdentifierType): boolean {
    return identifierTypes.includes(identifierType);
}

const NUMERIC_IDENTIFIER_TYPES: readonly NumericIdentifierType[] = [IdentifierTypes.GTIN, IdentifierTypes.GLN, IdentifierTypes.SSCC, IdentifierTypes.GRAI, IdentifierTypes.GSRN, IdentifierTypes.GDTI, IdentifierTypes.GSIN, IdentifierTypes.GCN];

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
    return identifierTypesIncludes(NUMERIC_IDENTIFIER_TYPES, identifierDescriptor.identifierType);
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
    return identifierDescriptor.identifierType === IdentifierTypes.GTIN;
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
    return isNumericIdentifierDescriptor(identifierDescriptor) && !isGTINDescriptor(identifierDescriptor);
}

const SERIALIZABLE_NUMERIC_IDENTIFIER_TYPES: readonly SerializableNumericIdentifierType[] = [IdentifierTypes.GRAI, IdentifierTypes.GDTI, IdentifierTypes.GCN];

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
    return identifierTypesIncludes(SERIALIZABLE_NUMERIC_IDENTIFIER_TYPES, identifierDescriptor.identifierType);
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
    return !isNumericIdentifierDescriptor(identifierDescriptor);
}
