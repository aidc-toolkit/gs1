import { type CharacterSetValidation, Exclusions, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
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
     * Create GTIN-14 with an indicator digit and reference based on a numeric value. The value is converted to a
     * reference of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @param indicatorDigit
     * Indicator digit.
     *
     * @param value
     * Numeric value.
     *
     * @param sparse
     * If true, the value is mapped to a sparse sequence resistant to discovery.
     *
     * @returns
     * GTIN-14.
     */
    createGTIN14(indicatorDigit: string, value: number | bigint, sparse?: boolean): string;

    /**
     * Create GTIN-14s with an indicator digit and references based on numeric values. The values are converted to
     * references of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @param indicatorDigit
     * Indicator digit.
     *
     * @param values
     * Numeric values.
     *
     * @param sparse
     * If true, the values are mapped to a sparse sequence resistant to discovery.
     *
     * @returns
     * GTIN-14s.
     */
    createGTIN14(indicatorDigit: string, values: Iterable<number | bigint>, sparse?: boolean): Iterable<string>;

    // eslint-disable-next-line jsdoc/require-jsdoc -- Implementation of overloaded signatures.
    createGTIN14(indicatorDigit: string, valueOrValues: number | bigint | Iterable<number | bigint>, sparse?: boolean): string | Iterable<string> {
        NUMERIC_CREATOR.validate(indicatorDigit, GTINCreator.#REQUIRED_INDICATOR_DIGIT_VALIDATION);

        return NUMERIC_CREATOR.create(GTINLengths.GTIN13 - this.prefixProvider.gs1CompanyPrefix.length - 1, valueOrValues, Exclusions.None, sparse === true ? this.tweak : undefined, (reference) => {
            const partialIdentifier = indicatorDigit + this.prefixProvider.gs1CompanyPrefix + reference;

            return partialIdentifier + checkDigit(partialIdentifier);
        });
    }
}
