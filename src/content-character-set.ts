/**
 * Character sets supported by the reference portion of an identifier or the serial component of a numeric identifier.
 */
export const ContentCharacterSets = {
    /**
     * Numeric.
     */
    Numeric: "Numeric",

    /**
     * GS1 AI encodable character set 82.
     */
    AI82: "AI82",

    /**
     * GS1 AI encodable character set 39.
     */
    AI39: "AI39"
} as const;

/**
 * Content character set.
 */
export type ContentCharacterSet = typeof ContentCharacterSets[keyof typeof ContentCharacterSets];
