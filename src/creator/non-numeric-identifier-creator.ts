import type { ContentCharacterSets } from "../content-character-set.js";
import type { IdentifierTypes } from "../identifier-type.js";
import type { NonNumericIdentifierTypes } from "../non-numeric-identifier-type.js";
import type { BaseNonNumericIdentifierCreator } from "./base-non-numeric-identifier-creator.js";

/**
 * GIAI creator.
 */
export type GIAICreator = BaseNonNumericIdentifierCreator<typeof IdentifierTypes.GIAI, typeof ContentCharacterSets.AI82>;

/**
 * GINC creator.
 */
export type GINCCreator = BaseNonNumericIdentifierCreator<typeof IdentifierTypes.GINC, typeof ContentCharacterSets.AI82>;

/**
 * CPID creator.
 */
export type CPIDCreator = BaseNonNumericIdentifierCreator<typeof IdentifierTypes.CPID, typeof ContentCharacterSets.AI39>;

/**
 * GMN creator.
 */
export type GMNCreator = BaseNonNumericIdentifierCreator<typeof IdentifierTypes.GMN, typeof ContentCharacterSets.AI82>;

/**
 * Non-numeric identifier creator.
 */
export type NonNumericIdentifierCreator = GIAICreator | GINCCreator | CPIDCreator | GMNCreator;

/**
 * Non-numeric identifier creators indexed by identifier type.
 */
export interface NonNumericIdentifierCreators {
    /**
     * GIAI creator.
     */
    readonly [NonNumericIdentifierTypes.GIAI]: GIAICreator;

    /**
     * GINC creator.
     */
    readonly [NonNumericIdentifierTypes.GINC]: GINCCreator;

    /**
     * CPID creator.
     */
    readonly [NonNumericIdentifierTypes.CPID]: CPIDCreator;

    /**
     * GMN creator.
     */
    readonly [NonNumericIdentifierTypes.GMN]: GMNCreator;
}
