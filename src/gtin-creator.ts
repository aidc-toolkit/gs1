import {
    type CharacterSetValidation,
    Exclusions,
    NUMERIC_CREATOR,
    type TransformerInput,
    type TransformerOutput
} from "@aidc-toolkit/utility";
import { MixinAbstractNumericIdentifierCreator } from "./abstract-numeric-identifier-creator.js";
import { checkDigit, priceOrWeightCheckDigit } from "./check.js";
import { type GTINBaseLength, GTINLengths } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import { GTINValidator } from "./gtin-validator.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * GTIN creator. Applicable to GTIN-13, GTIN-12, and GTIN-8 types; no applicable to GTIN-14 type.
 */
export class GTINCreator extends MixinAbstractNumericIdentifierCreator<
    [GTINBaseLength],
    GTINType,
    typeof GTINValidator
>(GTINValidator) {
    /**
     * Validation parameters for required indicator digit.
     */
    static readonly #REQUIRED_INDICATOR_DIGIT_VALIDATION: CharacterSetValidation = {
        minimumLength: 1,
        maximumLength: 1,
        component: () => i18nextGS1.t("Identifier.indicatorDigit")
    };

    /**
     * Constructor.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param gtinBaseLength
     * GTIN base length (all except GTIN-14).
     */
    constructor(prefixProvider: PrefixProvider, gtinBaseLength: GTINBaseLength) {
        super(prefixProvider, prefixProvider.prefix, gtinBaseLength);
    }

    /**
     * @inheritDoc
     */
    override get prefix(): string {
        return this.prefixProvider.prefix;
    }

    /**
     * Create GTIN-14(s) with an indicator digit and reference(s) based on numeric value(s). The value(s) is/are
     * converted to reference(s) of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @template TTransformerInput
     * Transformer input type.
     *
     * @param indicatorDigit
     * Indicator digit.
     *
     * @param valueOrValues
     * Numeric value(s).
     *
     * @param sparse
     * If true, the value(s) is/are mapped to a sparse sequence resistant to discovery. Default is false.
     *
     * @returns
     * GTIN-14(s).
     */
    createGTIN14<TTransformerInput extends TransformerInput<number | bigint>>(indicatorDigit: string, valueOrValues: TTransformerInput, sparse = false): TransformerOutput<TTransformerInput, string> {
        NUMERIC_CREATOR.validate(indicatorDigit, GTINCreator.#REQUIRED_INDICATOR_DIGIT_VALIDATION);

        return NUMERIC_CREATOR.create(GTINLengths.GTIN13 - this.prefixProvider.gs1CompanyPrefix.length - 1, valueOrValues, Exclusions.None, sparse ? this.tweak : undefined, (reference) => {
            const partialIdentifier = indicatorDigit + this.prefixProvider.gs1CompanyPrefix + reference;

            return partialIdentifier + checkDigit(partialIdentifier);
        });
    }

    /**
     * Create a Restricted Circulation Number (RCN) using a variable measure trade item format. See {@linkcode
     * GTINValidator.parseVariableMeasureRCN} for format details.
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
    static createVariableMeasureRCN(format: string, itemReference: number, priceOrWeight: number): string {
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
