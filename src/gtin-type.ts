/**
 * GTIN types. The numeric values are equal to the lengths of the GTIN types.
 */
export const GTINTypes = {
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
 * GTIN type key.
 */
export type GTINTypeKey = keyof typeof GTINTypes;

/**
 * GTIN type.
 */
export type GTINType = typeof GTINTypes[GTINTypeKey];

/**
 * GTIN base type (all except GTIN-14).
 */
export type GTINBaseType = Exclude<GTINType, typeof GTINTypes.GTIN14>;
