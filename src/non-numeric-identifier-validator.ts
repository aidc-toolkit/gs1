import { Exclusions, RegExpValidator } from "@aidc-toolkit/utility";
import { AbstractIdentifierValidator } from "./abstract-identifier-validator.js";
import { hasValidCheckCharacterPair } from "./check.js";
import { IdentifierDescriptors } from "./descriptors.js";
import type { IdentifierValidation } from "./identifier-validator.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { NonNumericIdentifierDescriptor } from "./non-numeric-identifier-descriptor.js";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type.js";

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
 * Non-numeric identifier validator.
 */
export class NonNumericIdentifierValidator extends AbstractIdentifierValidator<NonNumericIdentifierDescriptor, NonNumericIdentifierValidation> {
    /**
     * Validator to ensure that an identifier (minus check character pair) is not all numeric.
     */
    static readonly #NOT_ALL_NUMERIC_VALIDATOR = new class extends RegExpValidator {
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
    readonly #requiresCheckCharacterPair: boolean;

    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(identifierType: NonNumericIdentifierType) {
        const identifierDescriptor = IdentifierDescriptors[identifierType];

        super(identifierDescriptor);

        this.#requiresCheckCharacterPair = identifierDescriptor.requiresCheckCharacterPair;
    }

    /**
     * Determine if the identifier requires a check character pair.
     */
    get requiresCheckCharacterPair(): boolean {
        return this.#requiresCheckCharacterPair;
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

        super.validatePrefix(partialIdentifier);

        if (!this.requiresCheckCharacterPair) {
            this.referenceCreator.validate(identifier, {
                maximumLength: this.length
            });
            // Validating the check character pair will also validate the characters.
        } else if (!hasValidCheckCharacterPair(this.padIdentifier(identifier))) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidCheckCharacterPair"));
        }

        // Check for all-numeric identifier (minus check character pair) if excluded.
        if (validation?.exclusion === Exclusions.AllNumeric) {
            NonNumericIdentifierValidator.#NOT_ALL_NUMERIC_VALIDATOR.validate(partialIdentifier);
        }
    }
}
