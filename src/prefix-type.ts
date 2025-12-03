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
