import { AbstractIdentifierValidator } from "./abstract-identifier-validator";
import { hasValidCheckDigit } from "./check";
import { i18nextGS1 } from "./locale/i18n";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor";
import { LeaderTypes } from "./numeric-identifier-type";
import type { NumericIdentifierValidation, NumericIdentifierValidator } from "./numeric-identifier-validator";

/**
 * Abstract numeric identifier validator.
 */
export abstract class AbstractNumericIdentifierValidator<TNumericIdentifierDescriptor extends NumericIdentifierDescriptor> extends AbstractIdentifierValidator<TNumericIdentifierDescriptor, NumericIdentifierValidation> implements NumericIdentifierValidator<TNumericIdentifierDescriptor> {
    /**
     * Leader type.
     */
    private readonly _leaderType: TNumericIdentifierDescriptor["leaderType"];

    /**
     * Prefix position, determined by the leader type.
     */
    private readonly _prefixPosition: number;

    /**
     * Constructor.
     *
     * @param identifierDescriptor
     * Identifier descriptor.
     */
    constructor(identifierDescriptor: NumericIdentifierDescriptor) {
        super(identifierDescriptor);

        this._leaderType = identifierDescriptor.leaderType;
        this._prefixPosition = Number(this.leaderType === LeaderTypes.ExtensionDigit);
    }

    /**
     * @inheritDoc
     */
    get leaderType(): TNumericIdentifierDescriptor["leaderType"] {
        return this._leaderType;
    }

    /**
     * @inheritDoc
     */
    validate(identifier: string, validation?: NumericIdentifierValidation): void {
        // Validate the prefix, with care taken for its position within the identifier.
        if (this._prefixPosition === 0) {
            super.validatePrefix(identifier, validation?.positionOffset);
        } else {
            super.validatePrefix(identifier.substring(this._prefixPosition), validation?.positionOffset === undefined ? this._prefixPosition : validation.positionOffset + this._prefixPosition);
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
