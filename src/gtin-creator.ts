import {
    type CharacterSetValidation,
    Exclusions,
    NUMERIC_CREATOR,
    type TransformerInput,
    type TransformerOutput
} from "@aidc-toolkit/utility";
import { MixinAbstractNumericIdentifierCreator } from "./abstract-numeric-identifier-creator.js";
import { checkDigit } from "./check.js";
import { type GTINBaseLength, GTINLengths } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import { GTINValidator } from "./gtin-validator.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * GTIN creator. Applicable to GTIN-13, GTIN-12, and GTIN-8 types; not applicable to GTIN-14 type.
 */
export class GTINCreator extends MixinAbstractNumericIdentifierCreator<
    GTINType
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
}
