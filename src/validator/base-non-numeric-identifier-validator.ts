import type { Exclusions } from "@aidc-toolkit/utility";
import type { ContentCharacterSet, ContentCharacterSets } from "../content-character-set.js";
import type { BaseNonNumericIdentifierDescriptor } from "../descriptor/base-non-numeric-identifier-descriptor.js";
import type { NonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import type { PrefixTypes } from "../prefix-type.js";
import type { BaseIdentifierValidator, IdentifierValidation } from "./base-identifier-validator.js";

/**
 * Non-numeric identifier validation parameters.
 */
export interface NonNumericIdentifierValidation extends IdentifierValidation {
    /**
     * Exclusion support for reference. Prevents non-numeric identifier from being mistaken for numeric identifier.
     */
    exclusion?: typeof Exclusions.None | typeof Exclusions.AllNumeric | undefined;
}

/**
 * Base non-numeric identifier validator.
 */
export interface BaseNonNumericIdentifierValidator<
    TIdentifierType extends NonNumericIdentifierType,
    TReferenceCharacterSet extends Exclude<ContentCharacterSet, typeof ContentCharacterSets.Numeric>
> extends BaseIdentifierValidator<TIdentifierType, typeof PrefixTypes.GS1CompanyPrefix, number, TReferenceCharacterSet, NonNumericIdentifierValidation>, BaseNonNumericIdentifierDescriptor<TIdentifierType, TReferenceCharacterSet> {
}
