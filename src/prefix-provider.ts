import type { PrefixType } from "./prefix-type.js";

/**
 * Prefix provider.
 */
export interface PrefixProvider {
    /**
     * Prefix type.
     */
    readonly prefixType: PrefixType;

    /**
     * Prefix appropriate to the prefix type.
     */
    readonly prefix: string;
    
    /**
     * Prefix as GS1 Company Prefix.
     */
    readonly gs1CompanyPrefix: string;
    
    /**
     * Prefix as U.P.C. Company Prefix if prefix type is {@linkcode PrefixTypes.UPCCompanyPrefix} or undefined if not.
     */
    readonly upcCompanyPrefix: string | undefined;
    
    /**
     * Prefix as GS1-8 Prefix if prefix type is {@linkcode PrefixTypes.GS18Prefix} or undefined if not.
     */
    readonly gs18Prefix: string | undefined;
}
