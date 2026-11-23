import { isValueType, readonlyObjectValues } from "@aidc-toolkit/core";

/**
 * Prefix types.
 */
export const PrefixTypes = {
    /**
     * GS1 Company Prefix.
     */
    GS1CompanyPrefix: "GS1 Company Prefix",

    /**
     * U.P.C. Company Prefix.
     */
    UPCCompanyPrefix: "U.P.C. Company Prefix",

    /**
     * GS1-8 Prefix.
     */
    GS18Prefix: "GS1-8 Prefix"
} as const;

/**
 * Prefix type key.
 */
export type PrefixTypeKey = keyof typeof PrefixTypes;

/**
 * Prefix type.
 */
export type PrefixType = typeof PrefixTypes[PrefixTypeKey];

/**
 * Prefix type values.
 */
export const PrefixTypeValues = readonlyObjectValues<PrefixType>(PrefixTypes);

/**
 * Determine if prefix type is a valid prefix type.
 *
 * @param prefixType
 * Prefix type.
 *
 * @returns
 * True if prefix type is a valid prefix type.
 */
export function isPrefixType(prefixType: string): prefixType is PrefixType {
    return isValueType(PrefixTypeValues, prefixType);
}
