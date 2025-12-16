import { type CharacterSetValidation, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { checkDigit, hasValidCheckDigit, isValidPriceOrWeightCheckDigit } from "./check.js";
import type { GTINDescriptor } from "./gtin-descriptor.js";
import { type GTINBaseLength, GTINLengths } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import { IdentifierDescriptors } from "./identifier-descriptors.js";
import { i18nextGS1 } from "./locale/i18n.js";
import { NumericIdentifierValidator } from "./numeric-identifier-validator.js";
import { type PrefixType, PrefixTypes } from "./prefix-type.js";
import { PrefixValidator } from "./prefix-validator.js";

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

/**
 * Restricted Circulation Number reference.
 */
export interface RCNReference {
    /**
     * Item reference.
     */
    itemReference: number;

    /**
     * Price or weight (whole number only).
     */
    priceOrWeight: number;
}

/**
 * GTIN validator.
 */
export class GTINValidator extends NumericIdentifierValidator<GTINType> implements GTINDescriptor {
    /**
     * Validation parameters for optional indicator digit.
     */
    static readonly #OPTIONAL_INDICATOR_DIGIT_VALIDATION: CharacterSetValidation = {
        minimumLength: 0,
        maximumLength: 1,
        component: () => i18nextGS1.t("Identifier.indicatorDigit")
    };

    /**
     * Validation parameters for zero-suppressed GTIN-12.
     */
    static readonly #ZERO_SUPPRESSED_GTIN12_VALIDATION: CharacterSetValidation = {
        minimumLength: 8,
        maximumLength: 8
    };

    /**
     * Prefix type.
     */
    readonly #prefixType: PrefixType;

    /**
     * Constructor.
     *
     * @param gtinBaseLength
     * GTIN base length (all except GTIN-14).
     */
    constructor(gtinBaseLength: GTINBaseLength) {
        const identifierDescriptor = IdentifierDescriptors.GTIN[gtinBaseLength];

        super(identifierDescriptor);

        this.#prefixType = identifierDescriptor.prefixType;
    }

    /**
     * @inheritDoc
     */
    override get prefixType(): PrefixType {
        return this.#prefixType;
    }

    /**
     * @inheritDoc
     */
    protected override validatePrefix(partialIdentifier: string, positionOffset?: number): void {
        // Delegate to prefix validator requiring exact match for prefix type.
        PrefixValidator.validate(this.prefixType, false, false, partialIdentifier, true, true, positionOffset);
    }

    /**
     * Zero suppress a GTIN-12.
     *
     * @param gtin12
     * GTIN-12.
     *
     * @returns
     * Zero-suppressed GTIN-12.
     */
    static zeroSuppress(gtin12: string): string {
        GTIN12_VALIDATOR.validate(gtin12);

        // Convert to individual digits.
        const d = Array.from(gtin12);

        let zeroSuppressedGTIN12: string | undefined;

        // All rules require that digits in positions 1, 5, and 6 be zero.
        if (d[0] === "0" && d[6] === "0" && d[7] === "0") {
            if (d[10] >= "5" && d[8] === "0" && d[9] === "0" && d[5] !== "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[3]}${d[4]}${d[5]}${d[10]}${d[11]}`;
            } else if (d[5] === "0" && d[8] === "0" && d[9] === "0" && d[4] !== "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[3]}${d[4]}${d[10]}4${d[11]}`;
            } else if (d[3] <= "2" && d[4] === "0" && d[5] === "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[8]}${d[9]}${d[10]}${d[3]}${d[11]}`;
            } else if (d[3] >= "3" && d[4] === "0" && d[5] === "0" && d[8] === "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[3]}${d[9]}${d[10]}3${d[11]}`;
            }
        }

        if (zeroSuppressedGTIN12 === undefined) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidZeroSuppressibleGTIN12"));
        }

        return zeroSuppressedGTIN12;
    }

    /**
     * Zero expand a zero-suppressed GTIN-12.
     *
     * @param zeroSuppressedGTIN12
     * Zero-suppressed GTIN-12.
     *
     * @returns
     * GTIN-12.
     */
    static zeroExpand(zeroSuppressedGTIN12: string): string {
        NUMERIC_CREATOR.validate(zeroSuppressedGTIN12, GTINValidator.#ZERO_SUPPRESSED_GTIN12_VALIDATION);

        // Convert to individual digits.
        const d = Array.from(zeroSuppressedGTIN12);

        let gtin12: string | undefined;

        // Zero-suppressed GTIN-12 always starts with 0.
        if (d[0] === "0") {
            if (d[6] >= "5" && d[5] !== "0") {
                gtin12 = `0${d[1]}${d[2]}${d[3]}${d[4]}${d[5]}0000${d[6]}${d[7]}`;
            } else if (d[6] === "4" && d[4] !== "0") {
                gtin12 = `0${d[1]}${d[2]}${d[3]}${d[4]}00000${d[5]}${d[7]}`;
            } else if (d[6] <= "2") {
                gtin12 = `0${d[1]}${d[2]}${d[6]}0000${d[3]}${d[4]}${d[5]}${d[7]}`;
            } else if (d[6] === "3" && d[3] >= "3") {
                gtin12 = `0${d[1]}${d[2]}${d[3]}00000${d[4]}${d[5]}${d[7]}`;
            }
        }

        if (gtin12 === undefined) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidZeroSuppressedGTIN12"));
        }

        // Make sure that resulting GTIN-12 is valid.
        GTIN12_VALIDATOR.validate(gtin12);

        return gtin12;
    }

    /**
     * Convert a GTIN of any length to a GTIN-14 with an optional indicator digit.
     *
     * @param indicatorDigit
     * Indicator digit. If blank, assumes "0" if the GTIN is not already a GTIN-14.
     *
     * @param gtin
     * GTIN.
     *
     * @returns
     * GTIN-14.
     */
    static convertToGTIN14(indicatorDigit: string, gtin: string): string {
        GTINValidator.validateAny(gtin);

        NUMERIC_CREATOR.validate(indicatorDigit, GTINValidator.#OPTIONAL_INDICATOR_DIGIT_VALIDATION);

        // Check digit doesn't change by prepending zeros.
        let gtin14 = gtin.padStart(GTINLengths.GTIN14, "0");

        // If indicator digit provided and is different, recalculate the check digit.
        if (indicatorDigit.length !== 0 && indicatorDigit !== gtin14.charAt(0)) {
            const partialGTIN14 = indicatorDigit + gtin14.substring(1, GTINLengths.GTIN14 - 1);

            gtin14 = partialGTIN14 + checkDigit(partialGTIN14);
        }

        return gtin14;
    }

    /**
     * Normalize a GTIN of any length.
     * - A GTIN-14 that starts with six zeros or a GTIN-13 that starts with five zeros is normalized to GTIN-8.
     * - A GTIN-14 that starts with two zeros or a GTIN-13 that starts with one zero is normalized to GTIN-12.
     * - A GTIN-14 that starts with one zero is normalized to GTIN-13.
     * - Otherwise, the GTIN is unchanged.
     *
     * @param gtin
     * GTIN.
     *
     * @returns
     * Normalized GTIN.
     */
    static normalize(gtin: string): string {
        const gtinLength = gtin.length;

        let normalizedGTIN: string;

        switch (gtinLength) {
            case GTINLengths.GTIN13 :
                if (!gtin.startsWith("0")) {
                    // GTIN is GTIN-13.
                    normalizedGTIN = gtin;
                } else if (!gtin.startsWith("00000")) {
                    // GTIN is GTIN-12.
                    normalizedGTIN = gtin.substring(1);
                } else if (!gtin.startsWith("000000")) {
                    // GTIN is GTIN-8.
                    normalizedGTIN = gtin.substring(5);
                } else {
                    throw new RangeError(i18nextGS1.t("Identifier.invalidZeroSuppressedGTIN12AsGTIN13"));
                }
                break;

            case GTINLengths.GTIN12 :
                // GTIN is GTIN-12.
                normalizedGTIN = gtin;
                break;

            case GTINLengths.GTIN8 :
                if (!gtin.startsWith("0")) {
                    // GTIN is GTIN-8.
                    normalizedGTIN = gtin;
                } else {
                    // GTIN is zero-suppressed GTIN-12.
                    normalizedGTIN = GTINValidator.zeroExpand(gtin);
                }
                break;

            case GTINLengths.GTIN14 :
                if (!gtin.startsWith("0")) {
                    // GTIN is GTIN-14.
                    normalizedGTIN = gtin;
                } else if (!gtin.startsWith("00")) {
                    // GTIN is GTIN-13.
                    normalizedGTIN = gtin.substring(1);
                } else if (!gtin.startsWith("000000")) {
                    // GTIN is GTIN-12.
                    normalizedGTIN = gtin.substring(2);
                } else if (!gtin.startsWith("0000000")) {
                    // GTIN is GTIN-8.
                    normalizedGTIN = gtin.substring(6);
                } else {
                    throw new RangeError(i18nextGS1.t("Identifier.invalidZeroSuppressedGTIN12AsGTIN14"));
                }
                break;

            default:
                throw new RangeError(i18nextGS1.t("Identifier.invalidGTINLength"));
        }

        // Validation applies to the normalized GTIN.
        GTINValidator.validateAny(normalizedGTIN);

        return normalizedGTIN;
    }

    /**
     * Validate any GTIN, optionally against a level.
     *
     * @param gtin
     * GTIN.
     *
     * @param gtinLevel
     * Level at which GTIN is to be validated.
     */
    static validateAny(gtin: string, gtinLevel: GTINLevel = GTINLevels.Any): void {
        // Assume length-validated GTIN is the GTIN (true for all except zero-suppressed GTIN-12).
        let lengthValidatedGTIN = gtin;

        let gtinLevelRestriction: GTINLevel;

        switch (gtin.length) {
            case GTINLengths.GTIN13 :
                if (gtin.startsWith("0")) {
                    throw new RangeError(i18nextGS1.t("Identifier.invalidGTIN13AtRetail"));
                }

                // Validate prefix requiring exact match for prefix type.
                PrefixValidator.validate(PrefixTypes.GS1CompanyPrefix, false, false, gtin, true, true);

                gtinLevelRestriction = GTINLevels.Any;
                break;

            case GTINLengths.GTIN12 :
                // Validate prefix requiring exact match for prefix type.
                PrefixValidator.validate(PrefixTypes.UPCCompanyPrefix, false, false, gtin, true, true);

                gtinLevelRestriction = GTINLevels.Any;
                break;

            case GTINLengths.GTIN8 :
                // Zero-suppressed GTIN-12 always starts with 0.
                if (!gtin.startsWith("0")) {
                    // Validate prefix requiring exact match for prefix type.
                    PrefixValidator.validate(PrefixTypes.GS18Prefix, false, false, gtin, true, true);
                } else {
                    lengthValidatedGTIN = GTINValidator.zeroExpand(gtin);
                }

                gtinLevelRestriction = GTINLevels.RetailConsumer;
                break;

            case GTINLengths.GTIN14 :
                // Validate prefix supporting any prefix type.
                PrefixValidator.validate(PrefixTypes.GS1CompanyPrefix, true, true, gtin.substring(1), true, true);

                gtinLevelRestriction = GTINLevels.OtherThanRetailConsumer;
                break;

            default:
                throw new RangeError(i18nextGS1.t("Identifier.invalidGTINLength"));
        }

        // Validating the check digit will also validate the characters.
        if (!hasValidCheckDigit(lengthValidatedGTIN)) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidCheckDigit"));
        }

        // Validate against level if required.
        if (gtinLevel !== GTINLevels.Any && gtinLevelRestriction !== GTINLevels.Any && gtinLevelRestriction !== gtinLevel) {
            throw new RangeError(i18nextGS1.t(gtinLevel === GTINLevels.RetailConsumer ? "Identifier.invalidGTINAtRetail" : "Identifier.invalidGTINAtOtherThanRetail"));
        }
    }

    /**
     * Validate a GTIN-14.
     *
     * @param gtin14
     * GTIN-14.
     */
    static validateGTIN14(gtin14: string): void {
        if (gtin14.length !== GTINLengths.GTIN14) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidGTIN14Length"));
        }

        GTINValidator.validateAny(gtin14);
    }

    /**
     * Parse a Restricted Circulation Number (RCN) using a variable measure trade item format. The format is a 12- or
     * 13-character string (for RCN-12 or RCN-13 respectively), containing the following:
     *
     * - '2' - The first character of the RCN.
     * - '0'-'9' - The second character of the RCN (RCN-13 only).
     * - 'I' - One or more, in sequence, for the item reference.
     * - 'P' - One or more, in sequence, for the price or weight.
     * - 'V' - Zero or one, for the price or weight check digit.
     * - 'C' - The check digit of the entire RCN.
     *
     * The 'I', 'P', and 'V' formats may be in any order.
     *
     * Some examples:
     *
     * - 2IIIIIVPPPPC - RCN-12 with a five-digit item reference, a price or weight check digit, and a four-digit price
     * or weight.
     * - 23IIIIVPPPPPC - RCN-13 with a four-digit item reference, a price or weight check digit, and a five-digit price
     * or weight.
     * - 2IIIIIIPPPPC - RCN-12 with a six-digit item reference and a four-digit price or eight.
     * - 29IIIIIPPPPPC - RCN-13 with a five-digit item reference and a five-digit price or weight.
     *
     * @param format
     * Format.
     *
     * @param rcn
     * RCN.
     *
     * @returns
     * RCN reference.
     */
    static parseVariableMeasureRCN(format: string, rcn: string): RCNReference {
        const formatLength = format.length;

        if (rcn.length !== formatLength) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidRCNLength"));
        }

        let validFormat = formatLength === 12 || formatLength === 13;
        let validRCNPrefix = true;

        let buildingItemReference = false;
        let itemReference = "";

        let buildingPriceOrWeight = false;
        let priceOrWeight = "";

        let priceOrWeightCheckDigit = "";

        for (let index = 0; validFormat && index < formatLength; index++) {
            const formatChar = format.charAt(index);
            const rcnChar = rcn.charAt(index);

            if (index === 0) {
                validFormat = formatChar === "2";
                validRCNPrefix = rcnChar === "2";
            } else if (formatLength === 13 && index === 1) {
                validFormat = NUMERIC_CREATOR.characterIndex(formatChar) !== undefined;
                validRCNPrefix = rcnChar === formatChar;
            } else if (index === formatLength - 1) {
                validFormat = formatChar === "C";
            } else {
                switch (formatChar) {
                    case "I":
                        if (!buildingItemReference) {
                            // Item reference can't appear more than once.
                            validFormat = itemReference === "";

                            buildingItemReference = true;
                            buildingPriceOrWeight = false;
                        }

                        itemReference += rcnChar;
                        break;

                    case "P":
                        if (!buildingPriceOrWeight) {
                            // Price or weight can't appear more than once.
                            validFormat = priceOrWeight === "";

                            buildingPriceOrWeight = true;
                            buildingItemReference = false;
                        }

                        priceOrWeight += rcnChar;
                        break;

                    case "V":
                        // Price or weight check digit can't appear more than once.
                        validFormat = priceOrWeightCheckDigit === "";

                        buildingItemReference = false;
                        buildingPriceOrWeight = false;

                        priceOrWeightCheckDigit = rcnChar;
                        break;

                    default:
                        validFormat = false;
                        break;
                }
            }
        }

        validFormat &&= itemReference !== "" && priceOrWeight !== "";

        if (!validFormat) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidVariableMeasureRCNFormat"));
        }

        if (!validRCNPrefix) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidVariableMeasureRCNPrefix"));
        }

        if (priceOrWeightCheckDigit !== "" && !isValidPriceOrWeightCheckDigit(priceOrWeight, priceOrWeightCheckDigit)) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidVariableMeasurePriceOrWeight"));
        }

        if (!hasValidCheckDigit(rcn)) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidCheckDigit"));
        }

        return {
            itemReference: Number(itemReference),
            priceOrWeight: Number(priceOrWeight)
        };
    }
}

/**
 * GTIN-13 validator.
 */
// Defined here because of circular reference.
export const GTIN13_VALIDATOR = new GTINValidator(GTINLengths.GTIN13);

/**
 * GTIN-12 validator.
 */
// Defined here because of circular reference.
export const GTIN12_VALIDATOR = new GTINValidator(GTINLengths.GTIN12);

/**
 * GTIN-8 validator.
 */
// Defined here because of circular reference.
export const GTIN8_VALIDATOR = new GTINValidator(GTINLengths.GTIN8);

/**
 * GTIN validators indexed by prefix type.
 */
// Defined here because of circular reference.
export const GTIN_VALIDATORS: Readonly<Record<GTINBaseLength, GTINValidator>> = {
    [GTINLengths.GTIN13]: GTIN13_VALIDATOR,
    [GTINLengths.GTIN12]: GTIN12_VALIDATOR,
    [GTINLengths.GTIN8]: GTIN8_VALIDATOR
};
