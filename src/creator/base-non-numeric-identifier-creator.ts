import type { ContentCharacterSet, ContentCharacterSets } from "../content-character-set.js";
import type { NonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import type { PrefixTypes } from "../prefix-type.js";
import type {
    BaseNonNumericIdentifierValidator,
    NonNumericIdentifierValidation
} from "../validator/base-non-numeric-identifier-validator.js";
import type { BaseIdentifierCreator } from "./base-identifier-creator.js";

/**
 * Base non-numeric identifier creator.
 */
export interface BaseNonNumericIdentifierCreator<
    TIdentifierType extends NonNumericIdentifierType,
    TReferenceCharacterSet extends Exclude<ContentCharacterSet, typeof ContentCharacterSets.Numeric>
> extends BaseIdentifierCreator<TIdentifierType, typeof PrefixTypes.GS1CompanyPrefix, number, TReferenceCharacterSet, NonNumericIdentifierValidation>, BaseNonNumericIdentifierValidator<TIdentifierType, TReferenceCharacterSet> {
    /**
     * Create an identifier or identifiers.
     */
    create: {
        /**
         * Create an identifier with a reference.
         *
         * @param reference
         * Reference.
         *
         * @returns
         * Identifier.
         */
        (reference: string): string;

        /**
         * Create identifiers with references.
         *
         * @param references
         * References.
         *
         * @returns
         * Identifiers.
         */
        (references: Iterable<string>): Iterable<string>;
    };
}
