import { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { checkDigit, hasValidCheckDigit, isValidPriceOrWeightCheckDigit, priceOrWeightCheckDigit } from "./check.js";
import { i18nextGS1 } from "./locale/i18n.js";

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
 * Variable measure trade item support functions.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- Wrapper for future functionality.
export class VariableMeasure {
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
    static parseRCN(format: string, rcn: string): RCNReference {
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

    /**
     * Create a Restricted Circulation Number (RCN) using a variable measure trade item format. See {@linkcode parseRCN}
     * for format details.
     *
     * @param format
     * Format.
     *
     * @param itemReference
     * Item reference.
     *
     * @param priceOrWeight
     * Price or weight (whole number only).
     *
     * @returns
     * RCN-12 or RCN-13.
     */
    static createRCN(format: string, itemReference: number, priceOrWeight: number): string {
        const formatLength = format.length;

        let validFormat = formatLength === 12 || formatLength === 13;

        let rcnPrefix = "";

        let buildingItemReference = false;
        let itemReferenceString = "";
        let itemReferenceLength = 0;

        let buildingPriceOrWeight = false;
        let priceOrWeightString = "";
        let priceOrWeightLength = 0;

        let calculatePriceOrWeightCheckDigit = false;

        // RCN may be built in almost any order, so defer to builders that will be in ordered array.
        const rcnPrefixBuilder = (partialRCN: string): string => partialRCN + rcnPrefix;
        const itemReferenceBuilder = (partialRCN: string): string => partialRCN + itemReferenceString;
        const priceOrWeightBuilder = (partialRCN: string): string => partialRCN + priceOrWeightString;
        const priceOrWeightCheckDigitBuilder = (partialRCN: string): string => partialRCN + priceOrWeightCheckDigit(priceOrWeightString);
        const checkDigitBuilder = (partialRCN: string): string => partialRCN + checkDigit(partialRCN);

        const rcnBuilders = [rcnPrefixBuilder];

        for (let index = 0; validFormat && index < formatLength; index++) {
            const formatChar = format.charAt(index);

            if (index === 0) {
                validFormat = formatChar === "2";
                rcnPrefix = formatChar;
            } else if (formatLength === 13 && index === 1) {
                validFormat = NUMERIC_CREATOR.characterIndex(formatChar) !== undefined;
                rcnPrefix += formatChar;
            } else if (index === formatLength - 1) {
                validFormat = formatChar === "C";
            } else {
                switch (formatChar) {
                    case "I":
                        if (!buildingItemReference) {
                            // Item reference can't appear more than once.
                            validFormat = itemReferenceLength === 0;

                            buildingItemReference = true;
                            buildingPriceOrWeight = false;

                            rcnBuilders.push(itemReferenceBuilder);
                        }

                        itemReferenceLength++;
                        break;

                    case "P":
                        if (!buildingPriceOrWeight) {
                            // Price or weight can't appear more than once.
                            validFormat = priceOrWeightLength === 0;

                            buildingPriceOrWeight = true;
                            buildingItemReference = false;

                            rcnBuilders.push(priceOrWeightBuilder);
                        }

                        priceOrWeightLength++;
                        break;

                    case "V":
                        // Price or weight check digit can't appear more than once.
                        validFormat = !calculatePriceOrWeightCheckDigit;

                        buildingItemReference = false;
                        buildingPriceOrWeight = false;

                        calculatePriceOrWeightCheckDigit = true;

                        rcnBuilders.push(priceOrWeightCheckDigitBuilder);
                        break;

                    default:
                        validFormat = false;
                        break;
                }
            }
        }

        validFormat &&= itemReferenceLength !== 0 && priceOrWeightLength !== 0;

        if (!validFormat) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidVariableMeasureRCNFormat"));
        }

        itemReferenceString = NUMERIC_CREATOR.create(itemReferenceLength, itemReference);
        priceOrWeightString = NUMERIC_CREATOR.create(priceOrWeightLength, priceOrWeight);

        rcnBuilders.push(checkDigitBuilder);

        return rcnBuilders.reduce((partialRCN, rcnBuilder) => rcnBuilder(partialRCN), "");
    }
}
