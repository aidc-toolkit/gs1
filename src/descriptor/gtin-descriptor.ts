import { ContentCharacterSets } from "../content-character-set.js";
import { GTINBaseLengths } from "../gtin-length.js";
import { IdentifierTypes } from "../identifier-type.js";
import { LeaderTypes } from "../leader-type.js";
import { type PrefixType, PrefixTypes } from "../prefix-type.js";
import type { BaseGTINDescriptor } from "./base-gtin-descriptor.js";

/**
 * GTIN-13 descriptor.
 */
export type GTIN13Descriptor = BaseGTINDescriptor<typeof PrefixTypes.GS1CompanyPrefix>;

/**
 * GTIN-13 descriptor.
 */
export const GTIN13_DESCRIPTOR: GTIN13Descriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.GS1CompanyPrefix,
    length: GTINBaseLengths.GTIN13,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN-12 descriptor.
 */
export type GTIN12Descriptor = BaseGTINDescriptor<typeof PrefixTypes.UPCCompanyPrefix>;

/**
 * GTIN-12 descriptor.
 */
export const GTIN12_DESCRIPTOR: GTIN12Descriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.UPCCompanyPrefix,
    length: GTINBaseLengths.GTIN12,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN-8 descriptor.
 */
export type GTIN8Descriptor = BaseGTINDescriptor<typeof PrefixTypes.GS18Prefix>;

/**
 * GTIN-8 descriptor.
 */
export const GTIN8_DESCRIPTOR: GTIN8Descriptor = {
    identifierType: IdentifierTypes.GTIN,
    prefixType: PrefixTypes.GS18Prefix,
    length: GTINBaseLengths.GTIN8,
    referenceCharacterSet: ContentCharacterSets.Numeric,
    leaderType: LeaderTypes.IndicatorDigit
};

/**
 * GTIN descriptor.
 */
export type GTINDescriptor = GTIN13Descriptor | GTIN12Descriptor | GTIN8Descriptor;

/**
 * GTIN descriptors indexed by prefix type.
 */
export const GTINDescriptors = {
    [PrefixTypes.GS1CompanyPrefix]: GTIN13_DESCRIPTOR,
    [PrefixTypes.UPCCompanyPrefix]: GTIN12_DESCRIPTOR,
    [PrefixTypes.GS18Prefix]: GTIN8_DESCRIPTOR
} as const;

/**
 * GTIN descriptor by prefix type.
 */
export type GTINPrefixTypeDescriptor<TPrefixType extends PrefixType> =
    typeof GTINDescriptors[TPrefixType];
