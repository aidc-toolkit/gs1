import { hasValidCheckDigit } from "./check.js";
import type { IdentifierTypeDescriptor } from "./identifier-descriptors.js";
import { type IdentifierValidation, IdentifierValidator } from "./identifier-validator.js";
import { LeaderTypes } from "./leader-type.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import type { NumericIdentifierType } from "./numeric-identifier-type.js";

/**
 * Numeric identifier validation parameters.
 */
export interface NumericIdentifierValidation extends IdentifierValidation {
    /**
     * Position offset within a larger string. Some numeric identifier types have the prefix offset by one.
     */
    positionOffset?: number | undefined;
}

/**
 * Numeric identifier validator.
 *
 * @template TNumericIdentifierType
 * Numeric identifier type type.
 */
export abstract class NumericIdentifierValidator<TNumericIdentifierType extends NumericIdentifierType = NumericIdentifierType> extends IdentifierValidator<TNumericIdentifierType, NumericIdentifierValidation> implements NumericIdentifierDescriptor {
    /**
     * Leader type.
     */
    readonly #leaderType: IdentifierTypeDescriptor<TNumericIdentifierType>["leaderType"];

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
    constructor(identifierDescriptor: IdentifierTypeDescriptor<TNumericIdentifierType>) {
        super(identifierDescriptor);

        this.#leaderType = identifierDescriptor.leaderType;
        this.#prefixPosition = Number(this.leaderType === LeaderTypes.ExtensionDigit);
    }

    /**
     * @inheritDoc
     */
    get leaderType(): IdentifierTypeDescriptor<TNumericIdentifierType>["leaderType"] {
        return this.#leaderType;
    }

    /**
     * @inheritDoc
     */
    validate(identifier: string, validation?: NumericIdentifierValidation): void {
        // Validate the prefix, with care taken for its position within the identifier.
        if (this.#prefixPosition === 0) {
            super.validatePrefix(identifier);
        } else {
            super.validatePrefix(identifier.substring(this.#prefixPosition));
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
