import { omit } from "@aidc-toolkit/core";

/**
 * GTIN lengths. The numeric values are equal to the lengths of the GTINs.
 */
export const GTINLengths = {
    /**
     * GTIN-13.
     */
    GTIN13: 13,

    /**
     * GTIN-12.
     */
    GTIN12: 12,

    /**
     * GTIN-8.
     */
    GTIN8: 8,

    /**
     * GTIN-14.
     */
    GTIN14: 14
} as const;

/**
 * GTIN length key.
 */
export type GTINLengthKey = keyof typeof GTINLengths;

/**
 * GTIN length.
 */
export type GTINLength = typeof GTINLengths[GTINLengthKey];

/**
 * GTIN base lengths (all except GTIN-14).
 */
export const GTINBaseLengths = omit(GTINLengths, "GTIN14");

/**
 * GTIN base length key.
 */
export type GTINBaseLengthKey = keyof typeof GTINBaseLengths;

/**
 * GTIN length.
 */
export type GTINBaseLength = typeof GTINBaseLengths[GTINBaseLengthKey];
