import { Exclusions, RegExpValidator } from "@aidc-toolkit/utility";
import { hasValidCheckCharacterPair } from "../check.js";
import type { NonNumericIdentifierDescriptor } from "../descriptor/index.js";
import { i18nextGS1T } from "../locale/i18n.js";
import { AbstractIdentifierValidator } from "./abstract-identifier-validator.js";
import type {
    BaseNonNumericIdentifierValidator,
    NonNumericIdentifierValidation
} from "./base-non-numeric-identifier-validator.js";

/**
 * Concrete non-numeric identifier validator.
 */
export class ConcreteNonNumericIdentifierValidator<
    TIdentifierDescriptor extends NonNumericIdentifierDescriptor
> extends AbstractIdentifierValidator<TIdentifierDescriptor, NonNumericIdentifierValidation> implements BaseNonNumericIdentifierValidator<
    TIdentifierDescriptor["identifierType"],
    TIdentifierDescriptor["referenceCharacterSet"]
> {
    /**
     * Validator to ensure that an identifier (minus check character pair) is not all numeric.
     */
    static readonly #NOT_ALL_NUMERIC_VALIDATOR = new class extends RegExpValidator {
        /**
         * @inheritDoc
         */
        protected override createErrorMessage(_s: string): string {
            return i18nextGS1T("Identifier.referenceCantBeAllNumeric");
        }
    }(/\D/u);

    /**
     * True if the identifier requires a check character pair.
     */
    get requiresCheckCharacterPair(): boolean {
        return this.identifierDescriptor.requiresCheckCharacterPair;
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
            throw new RangeError(i18nextGS1T("Identifier.invalidCheckCharacterPair"));
        }

        // Check for all-numeric identifier (minus check character pair) if excluded.
        if (validation?.exclusion === Exclusions.AllNumeric) {
            ConcreteNonNumericIdentifierValidator.#NOT_ALL_NUMERIC_VALIDATOR.validate(partialIdentifier);
        }
    }
}
