import { AbstractIdentifierValidator } from "./abstract-identifier-validator.js";
import { hasValidCheckDigit } from "./check.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import { LeaderTypes } from "./numeric-identifier-type.js";
import type { NumericIdentifierValidation, NumericIdentifierValidator } from "./numeric-identifier-validator.js";

/**
 * Abstract numeric identifier validator.
 *
 * @template TNumericIdentifierDescriptor
 * Numeric identifier descriptor type.
 */
export abstract class AbstractNumericIdentifierValidator<TNumericIdentifierDescriptor extends NumericIdentifierDescriptor> extends AbstractIdentifierValidator<TNumericIdentifierDescriptor, NumericIdentifierValidation> implements NumericIdentifierValidator<TNumericIdentifierDescriptor> {
    /**
     * Leader type.
     */
    readonly #leaderType: TNumericIdentifierDescriptor["leaderType"];

    /**
     * Prefix position, determined by the leader type.
     */
    readonly #prefixPosition: number;

    /**
     * Constructor.
     *
     * @param identifierDescriptor
     * Identifier descriptor.
     */
    constructor(identifierDescriptor: NumericIdentifierDescriptor) {
        super(identifierDescriptor);

        this.#leaderType = identifierDescriptor.leaderType;
        this.#prefixPosition = Number(this.leaderType === LeaderTypes.ExtensionDigit);
    }

    /**
     * @inheritDoc
     */
    get leaderType(): TNumericIdentifierDescriptor["leaderType"] {
        return this.#leaderType;
    }

    /**
     * @inheritDoc
     */
    validate(identifier: string, validation?: NumericIdentifierValidation): void {
        // Validate the prefix, with care taken for its position within the identifier.
        if (this.#prefixPosition === 0) {
            super.validatePrefix(identifier, validation?.positionOffset);
        } else {
            super.validatePrefix(identifier.substring(this.#prefixPosition), validation?.positionOffset === undefined ? this.#prefixPosition : validation.positionOffset + this.#prefixPosition);
        }

        // Validate the length.
        if (identifier.length !== this.length) {
            throw new RangeError(i18nextGS1.t("Identifier.identifierTypeLength", {
                identifierType: this.identifierType,
                length: this.length
            }));
        }

        // Validating the check digit will also validate the characters.
        if (!hasValidCheckDigit(this.padIdentifier(identifier, validation?.positionOffset))) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidCheckDigit"));
        }
    }
}
