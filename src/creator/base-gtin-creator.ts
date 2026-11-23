// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in JSDoc.
import type { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import type { GTINBaseLength } from "../gtin-length.js";
import type { GTINType } from "../gtin-type.js";
import type { LeaderTypes } from "../leader-type.js";
import type { PrefixType } from "../prefix-type.js";
import type { BaseGTINValidator } from "../validator/base-gtin-validator.js";
import type { BaseNumericIdentifierCreator } from "./base-numeric-identifier-creator.js";

/**
 * Base GTIN creator.
 */
export interface BaseGTINCreator<
    TPrefixType extends PrefixType
> extends BaseNumericIdentifierCreator<GTINType, TPrefixType, GTINBaseLength, typeof LeaderTypes.IndicatorDigit>, BaseGTINValidator<TPrefixType> {
    /**
     * Create a GTIN-14 or GTIN-14s.
     */
    createGTIN14: {
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
         * True if the value should be mapped to a sparse sequence resistant to discovery.
         *
         * @returns
         * GTIN-14.
         */
        (indicatorDigit: string, value: number | bigint, sparse?: boolean): string;

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
         * True if the values are mapped to a sparse sequence resistant to discovery.
         *
         * @returns
         * GTIN-14s.
         */
        (indicatorDigit: string, values: Iterable<number | bigint>, sparse?: boolean): Iterable<string>;
    };
}
