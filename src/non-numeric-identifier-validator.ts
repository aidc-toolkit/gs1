import { Exclusions, RegExpValidator } from "@aidc-toolkit/utility";
import { hasValidCheckCharacterPair } from "./check";
import { type IdentifierType, IdentifierTypes } from "./identifier-type";
import {
    AbstractIdentifierValidator,
    type ContentCharacterSet,
    ContentCharacterSets,
    type IdentifierValidation
} from "./identifier-validator";
import { i18nextGS1 } from "./locale/i18n";
import type { NumericIdentifierType } from "./numeric-identifier-validator";
import { PrefixTypes } from "./prefix-type";

/**
 * Non-numeric identifier type.
 */
export type NonNumericIdentifierType = Exclude<IdentifierType, NumericIdentifierType>;

/**
 * Non-numeric identifier validation parameters.
 */
export interface NonNumericIdentifierValidation extends IdentifierValidation {
    /**
     * Exclusion support for reference. Prevents non-numeric identifier from being mistaken for numeric
     * identifier.
     */
    exclusion?: typeof Exclusions.None | typeof Exclusions.AllNumeric | undefined;
}

/**
 * Non-numeric identifier validator.
 */
export class NonNumericIdentifierValidator extends AbstractIdentifierValidator<NonNumericIdentifierValidation> {
    /**
     * Validator to ensure that an identifier (minus check character pair) is not all numeric.
     */
    private static readonly NOT_ALL_NUMERIC_VALIDATOR = new class extends RegExpValidator {
        /**
         * @inheritDoc
         */
        protected override createErrorMessage(_s: string): string {
            return i18nextGS1.t("Identifier.referenceCantBeAllNumeric");
        }
    }(/\D/);

    /**
     * True if the identifier requires a check character pair.
     */
    private readonly _requiresCheckCharacterPair: boolean;

    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param length
     * Length.
     *
     * @param referenceCharacterSet
     * Reference character set.
     *
     * @param requiresCheckCharacterPair
     * True if the identifier requires a check character pair.
     */
    constructor(identifierType: IdentifierType, length: number, referenceCharacterSet: ContentCharacterSet, requiresCheckCharacterPair = false) {
        super(identifierType, PrefixTypes.GS1CompanyPrefix, length, referenceCharacterSet);

        this._requiresCheckCharacterPair = requiresCheckCharacterPair;
    }

    /**
     * Determine if the identifier requires a check character pair.
     */
    get requiresCheckCharacterPair(): boolean {
        return this._requiresCheckCharacterPair;
    }

    /**
     * Validate a non-numeric identifier and throw an error if validation fails.
     *
     * @param identifier
     * Identifier.
     *
     * @param validation
     * Validation parameters.
     */
    validate(identifier: string, validation?: NonNumericIdentifierValidation): void {
        const partialIdentifier = this.requiresCheckCharacterPair ? identifier.substring(0, identifier.length - 2) : identifier;

        super.validatePrefix(partialIdentifier, validation?.positionOffset);

        if (!this.requiresCheckCharacterPair) {
            this.referenceCreator.validate(identifier, {
                maximumLength: this.length,
                positionOffset: validation?.positionOffset
            });
            // Validating the check character pair will also validate the characters.
        } else if (!hasValidCheckCharacterPair(this.padIdentifier(identifier, validation))) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidCheckCharacterPair"));
        }

        // Check for all-numeric identifier (minus check character pair) if excluded.
        if (validation?.exclusion === Exclusions.AllNumeric) {
            NonNumericIdentifierValidator.NOT_ALL_NUMERIC_VALIDATOR.validate(partialIdentifier);
        }
    }
}

/**
 * GIAI validator.
 */
export const GIAI_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.GIAI, 30, ContentCharacterSets.AI82);

/**
 * GINC validator.
 */
export const GINC_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.GINC, 30, ContentCharacterSets.AI82);

/**
 * CPID validator.
 */
export const CPID_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.CPID, 30, ContentCharacterSets.AI39);

/**
 * GMN validator.
 */
export const GMN_VALIDATOR = new NonNumericIdentifierValidator(IdentifierTypes.GMN, 25, ContentCharacterSets.AI82, true);
