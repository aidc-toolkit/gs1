/**
 * Identifier types.
 */
export const IdentifierTypes = {
    /**
     * Global Trade Item Number.
     */
    GTIN: "GTIN",

    /**
     * Global Location Number.
     */
    GLN: "GLN",

    /**
     * Serial Shipping Container Code.
     */
    SSCC: "SSCC",

    /**
     * Global Returnable Asset Identifier.
     */
    GRAI: "GRAI",

    /**
     * Global Individual Asset Identifier.
     */
    GIAI: "GIAI",

    /**
     * Global Service Relation Number.
     */
    GSRN: "GSRN",

    /**
     * Global Document Type Identifier.
     */
    GDTI: "GDTI",

    /**
     * Global Identification Number for Consignment.
     */
    GINC: "GINC",

    /**
     * Global Shipment Identification Number.
     */
    GSIN: "GSIN",

    /**
     * Global Coupon Number.
     */
    GCN: "GCN",

    /**
     * Component/Part Identifier.
     */
    CPID: "CPID",

    /**
     * Global Model Number.
     */
    GMN: "GMN"
} as const;

/**
 * Identifier type.
 */
export type IdentifierType = typeof IdentifierTypes[keyof typeof IdentifierTypes];
