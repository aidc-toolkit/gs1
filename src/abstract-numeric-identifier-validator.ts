import { AbstractIdentifierValidator } from "./abstract-identifier-validator";
import { hasValidCheckDigit } from "./check";
import { ContentCharacterSets } from "./identifier-validator";
import { i18nextGS1 } from "./locale/i18n";
import {
    type LeaderType,
    LeaderTypes,
    type NumericIdentifierType,
    type NumericIdentifierValidation,
    type NumericIdentifierValidator
} from "./numeric-identifier-validator";

/**
 * Abstract numeric identifier validator.
 */
export abstract class AbstractNumericIdentifierValidator<TNumericIdentifierType extends NumericIdentifierType> extends AbstractIdentifierValidator<TNumericIdentifierType, NumericIdentifierValidation> implements NumericIdentifierValidator<TNumericIdentifierType> {
    /**
     * Leader type.
     */
    private readonly _leaderType: LeaderType;

    /**
     * Prefix position, determined by the leader type.
     */
    private readonly _prefixPosition: number;

    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param length
     * Length.
     *
     * @param leaderType
     * Leader type.
     */
    constructor(identifierType: TNumericIdentifierType, length: number, leaderType: LeaderType) {
        super(identifierType, length, ContentCharacterSets.Numeric);

        this._leaderType = leaderType;
        this._prefixPosition = this.leaderType !== LeaderTypes.ExtensionDigit ? 0 : 1;
    }

    /**
     * @inheritDoc
     */
    get leaderType(): LeaderType {
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
