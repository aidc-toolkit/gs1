import { ContentCharacterSets } from "../content-character-set.js";
import { type NonNumericIdentifierType, NonNumericIdentifierTypes } from "../non-numeric-identifier-type.js";
import { PrefixTypes } from "../prefix-type.js";
import type { BaseNonNumericIdentifierDescriptor } from "./base-non-numeric-identifier-descriptor.js";

/**
 * GIAI descriptor.
 */
export type GIAIDescriptor = BaseNonNumericIdentifierDescriptor<typeof NonNumericIdentifierTypes.GIAI, typeof ContentCharacterSets.AI82>;

/**
 * GIAI descriptor.
 */
export const GIAI_DESCRIPTOR: GIAIDescriptor = {
    identifierType: NonNumericIdentifierTypes.GIAI,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 30,
    referenceCharacterSet: ContentCharacterSets.AI82,
    requiresCheckCharacterPair: false
};

/**
 * GINC descriptor.
 */
export type GINCDescriptor = BaseNonNumericIdentifierDescriptor<typeof NonNumericIdentifierTypes.GINC, typeof ContentCharacterSets.AI82>;

/**
 * GINC descriptor.
 */
export const GINC_DESCRIPTOR: GINCDescriptor = {
    identifierType: NonNumericIdentifierTypes.GINC,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 30,
    referenceCharacterSet: ContentCharacterSets.AI82,
    requiresCheckCharacterPair: false
};

/**
 * CPID descriptor.
 */
export type CPIDDescriptor = BaseNonNumericIdentifierDescriptor<typeof NonNumericIdentifierTypes.CPID, typeof ContentCharacterSets.AI39>;

/**
 * CPID descriptor.
 */
export const CPID_DESCRIPTOR: CPIDDescriptor = {
    identifierType: NonNumericIdentifierTypes.CPID,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 30,
    referenceCharacterSet: ContentCharacterSets.AI39,
    requiresCheckCharacterPair: false
};

/**
 * GMN descriptor.
 */
export type GMNDescriptor = BaseNonNumericIdentifierDescriptor<typeof NonNumericIdentifierTypes.GMN, typeof ContentCharacterSets.AI82>;

/**
 * GMN descriptor.
 */
export const GMN_DESCRIPTOR: GMNDescriptor = {
    identifierType: NonNumericIdentifierTypes.GMN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: 25,
    referenceCharacterSet: ContentCharacterSets.AI82,
    requiresCheckCharacterPair: true
};

/**
 * Non-numeric identifier descriptor.
 */
export type NonNumericIdentifierDescriptor = GIAIDescriptor | GINCDescriptor | CPIDDescriptor | GMNDescriptor;

/**
 * Non-numeric identifier descriptor by identifier type.
 */
export type NonNumericIdentifierTypeDescriptor<TIdentifierType extends NonNumericIdentifierType> =
    TIdentifierType extends typeof NonNumericIdentifierTypes.GIAI ?
        GIAIDescriptor :
        TIdentifierType extends typeof NonNumericIdentifierTypes.GINC ?
            GINCDescriptor :
            TIdentifierType extends typeof NonNumericIdentifierTypes.CPID ?
                CPIDDescriptor :
                TIdentifierType extends typeof NonNumericIdentifierTypes.GMN ?
                    GMNDescriptor :
                    never;

/**
 * Non-numeric identifier descriptors indexed by identifier type.
 */
export const NonNumericIdentifierDescriptors = {
    [NonNumericIdentifierTypes.GIAI]: GIAI_DESCRIPTOR,
    [NonNumericIdentifierTypes.GINC]: GINC_DESCRIPTOR,
    [NonNumericIdentifierTypes.CPID]: CPID_DESCRIPTOR,
    [NonNumericIdentifierTypes.GMN]: GMN_DESCRIPTOR
} as const;
