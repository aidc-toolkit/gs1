import type { NumericIdentifierTypes } from "../numeric-identifier-type.js";
import type { PrefixTypes } from "../prefix-type.js";
import type { BaseGTINCreator } from "./base-gtin-creator.js";

/**
 * GTIN-13 creator.
 */
export type GTIN13Creator = BaseGTINCreator<typeof PrefixTypes.GS1CompanyPrefix>;

/**
 * GTIN-12 creator.
 */
export type GTIN12Creator = BaseGTINCreator<typeof PrefixTypes.UPCCompanyPrefix>;

/**
 * GTIN-8 creator.
 */
export type GTIN8Creator = BaseGTINCreator<typeof PrefixTypes.GS18Prefix>;

/**
 * GTIN creator.
 */
export type GTINCreator = GTIN13Creator | GTIN12Creator | GTIN8Creator;

/**
 * GTIN creators indexed by identifier type.
 */
export interface GTINCreators {
    /**
     * GTIN creator.
     */
    readonly [NumericIdentifierTypes.GTIN]: GTINCreator;
}
