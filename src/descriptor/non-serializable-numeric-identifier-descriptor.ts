import { ContentCharacterSets } from "../content-character-set.js";
import { LeaderTypes } from "../leader-type.js";
import {
    type NonSerializableNumericIdentifierType,
    NonSerializableNumericIdentifierTypes
} from "../non-serializable-numeric-identifier-type.js";
import { PrefixTypes } from "../prefix-type.js";
import type {
    BaseNonSerializableNumericIdentifierDescriptor
} from "./base-non-serializable-numeric-identifier-descriptor.js";

/**
 * GLN descriptor.
 */
export type GLNDescriptor = BaseNonSerializableNumericIdentifierDescriptor<typeof NonSerializableNumericIdentifierTypes.GLN, typeof LeaderTypes.None>;

/**
 * GLN descriptor.
 */
export const GLN_DESCRIPTOR: GLNDescriptor = {
    identifierType: NonSerializableNumericIdentifierTypes.GLN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None
};

/**
 * SSCC descriptor.
 */
export type SSCCDescriptor = BaseNonSerializableNumericIdentifierDescriptor<typeof NonSerializableNumericIdentifierTypes.SSCC, typeof LeaderTypes.ExtensionDigit>;

/**
 * SSCC descriptor.
 */
export const SSCC_DESCRIPTOR: SSCCDescriptor = {
    identifierType: NonSerializableNumericIdentifierTypes.SSCC,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 18,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.ExtensionDigit
};

/**
 * GSRN descriptor.
 */
export type GSRNDescriptor = BaseNonSerializableNumericIdentifierDescriptor<typeof NonSerializableNumericIdentifierTypes.GSRN, typeof LeaderTypes.None>;

/**
 * GSRN descriptor.
 */
export const GSRN_DESCRIPTOR: GSRNDescriptor = {
    identifierType: NonSerializableNumericIdentifierTypes.GSRN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 18,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None
};

/**
 * GSIN descriptor.
 */
export type GSINDescriptor = BaseNonSerializableNumericIdentifierDescriptor<typeof NonSerializableNumericIdentifierTypes.GSIN, typeof LeaderTypes.None>;

/**
 * GSIN descriptor.
 */
export const GSIN_DESCRIPTOR: GSINDescriptor = {
    identifierType: NonSerializableNumericIdentifierTypes.GSIN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 17,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.None
};

/**
 * Non-serializable numeric identifier descriptor.
 */
export type NonSerializableNumericIdentifierDescriptor = GLNDescriptor | SSCCDescriptor | GSRNDescriptor | GSINDescriptor;

/**
 * Non-serializable numeric identifier descriptor by identifier type.
 */
export type NonSerializableNumericIdentifierTypeDescriptor<TIdentifierType extends NonSerializableNumericIdentifierType> =
    TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.GLN ?
        GLNDescriptor :
        TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.SSCC ?
            SSCCDescriptor :
            TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.GSRN ?
                GSRNDescriptor :
                TIdentifierType extends typeof NonSerializableNumericIdentifierTypes.GSIN ?
                    GSINDescriptor :
                    never;

/**
 * Non-serializable numeric identifier descriptors indexed by identifier type.
 */
export const NonSerializableNumericIdentifierDescriptors = {
    [NonSerializableNumericIdentifierTypes.GLN]: GLN_DESCRIPTOR,
    [NonSerializableNumericIdentifierTypes.SSCC]: SSCC_DESCRIPTOR,
    [NonSerializableNumericIdentifierTypes.GSRN]: GSRN_DESCRIPTOR,
    [NonSerializableNumericIdentifierTypes.GSIN]: GSIN_DESCRIPTOR
} as const;
