import { ContentCharacterSets } from "../content-character-set.js";
import { LeaderTypes } from "../leader-type.js";
import { PrefixTypes } from "../prefix-type.js";
import {
    type SerializableNumericIdentifierType,
    SerializableNumericIdentifierTypes
} from "../serializable-numeric-identifier-type.js";
import type { BaseSerializableNumericIdentifierDescriptor } from "./base-serializable-numeric-identifier-descriptor.js";

/**
 * GRAI descriptor.
 */
export type GRAIDescriptor = BaseSerializableNumericIdentifierDescriptor<typeof SerializableNumericIdentifierTypes.GRAI, typeof ContentCharacterSets.AI82>;

/**
 * GRAI descriptor.
 */
export const GRAI_DESCRIPTOR: GRAIDescriptor = {
    identifierType: SerializableNumericIdentifierTypes.GRAI,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None,
    serialComponentLength: 16,
    serialComponentCharacterSet: ContentCharacterSets.AI82
};

/**
 * GDTI descriptor.
 */
export type GDTIDescriptor = BaseSerializableNumericIdentifierDescriptor<typeof SerializableNumericIdentifierTypes.GDTI, typeof ContentCharacterSets.AI82>;

/**
 * GDTI descriptor.
 */
export const GDTI_DESCRIPTOR: GDTIDescriptor = {
    identifierType: SerializableNumericIdentifierTypes.GDTI,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None,
    serialComponentLength: 17,
    serialComponentCharacterSet: ContentCharacterSets.AI82
};

/**
 * GCN descriptor.
 */
export type GCNDescriptor = BaseSerializableNumericIdentifierDescriptor<typeof SerializableNumericIdentifierTypes.GCN, typeof ContentCharacterSets.Numeric>;

/**
 * GCN descriptor.
 */
export const GCN_DESCRIPTOR: GCNDescriptor = {
    identifierType: SerializableNumericIdentifierTypes.GCN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None,
    serialComponentLength: 12,
    serialComponentCharacterSet: ContentCharacterSets.Numeric
};

/**
 * Serializable numeric identifier descriptor.
 */
export type SerializableNumericIdentifierDescriptor = GRAIDescriptor | GDTIDescriptor | GCNDescriptor;

/**
 * Serializable numeric identifier descriptor by identifier type.
 */
export type SerializableNumericIdentifierTypeDescriptor<TIdentifierType extends SerializableNumericIdentifierType> =
    TIdentifierType extends typeof SerializableNumericIdentifierTypes.GRAI ?
        GRAIDescriptor :
        TIdentifierType extends typeof SerializableNumericIdentifierTypes.GDTI ?
            GDTIDescriptor :
            TIdentifierType extends typeof SerializableNumericIdentifierTypes.GCN ?
                GCNDescriptor :
                never;

/**
 * Serializable numeric identifier descriptors indexed by identifier type.
 */
export const SerializableNumericIdentifierDescriptors = {
    [SerializableNumericIdentifierTypes.GRAI]: GRAI_DESCRIPTOR,
    [SerializableNumericIdentifierTypes.GDTI]: GDTI_DESCRIPTOR,
    [SerializableNumericIdentifierTypes.GCN]: GCN_DESCRIPTOR
} as const;
