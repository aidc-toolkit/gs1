/**
 * Levels at which GTIN is to be validated.
 */
export const GTINLevels = {
    /**
     * Any level (level is ignored).
     */
    Any: 0,

    /**
     * Retail consumer trade item level, supporting GTIN-13, GTIN-12 (optionally zero-suppressed), and GTIN-8.
     */
    RetailConsumer: 1,

    /**
     * Other than retail consumer trade item level, supporting GTIN-13, GTIN-12 (not zero-suppressed), and GTIN-14.
     */
    OtherThanRetailConsumer: 2
} as const;

/**
 * GTIN level key.
 */
export type GTINLevelKey = keyof typeof GTINLevels;

/**
 * GTIN level.
 */
export type GTINLevel = typeof GTINLevels[GTINLevelKey];
