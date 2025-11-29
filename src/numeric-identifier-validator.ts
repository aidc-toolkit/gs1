import { hasValidCheckDigit } from "./check";
import type { IdentifierType, IdentifierTypes } from "./identifier-type";
import {
    AbstractIdentifierValidator,
    ContentCharacterSets,
    type IdentifierValidation,
    type IdentifierValidator
} from "./identifier-validator";
import { i18nextGS1 } from "./locale/i18n";
import type { PrefixType } from "./prefix-type";

/**
 * Numeric identifier type.
 */
export type NumericIdentifierType =
    typeof IdentifierTypes.GTIN |
    typeof IdentifierTypes.GLN |
    typeof IdentifierTypes.SSCC |
    typeof IdentifierTypes.GRAI |
    typeof IdentifierTypes.GSRN |
    typeof IdentifierTypes.GDTI |
    typeof IdentifierTypes.GSIN |
    typeof IdentifierTypes.GCN;

/**
 * Leader type.
 */
export const LeaderTypes = {
    /**
     * No leader.
     */
    None: "None",

    /**
     * Indicator digit (GTIN only).
     */
    IndicatorDigit: "Indicator digit",

    /**
     * Extension digit (SSCC only).
     */
    ExtensionDigit: "Extension digit"
};

/**
 * Leader type.
 */
export type LeaderType = typeof LeaderTypes[keyof typeof LeaderTypes];

/**
 * Numeric identifier validator. Validates a numeric identifier.
 */
export interface NumericIdentifierValidator extends IdentifierValidator {
    /**
     * Get the leader type.
     */
    get leaderType(): LeaderType;
}

/**
 * Abstract numeric identifier validator. Implements common functionality for a numeric identifier
 * validator.
 */
export abstract class AbstractNumericIdentifierValidator extends AbstractIdentifierValidator implements NumericIdentifierValidator {
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
     * @param prefixType
     * Prefix type.
     *
     * @param length
     * Length.
     *
     * @param leaderType
     * Leader type.
     */
    protected constructor(identifierType: IdentifierType, prefixType: PrefixType, length: number, leaderType: LeaderType) {
        super(identifierType, prefixType, length, ContentCharacterSets.Numeric);

        this._leaderType = leaderType;
        this._prefixPosition = Number(this.leaderType === LeaderTypes.ExtensionDigit);
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
    validate(identifier: string, validation?: IdentifierValidation): void {
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
        if (!hasValidCheckDigit(this.padIdentifier(identifier, validation))) {
            throw new RangeError(i18nextGS1.t("Identifier.invalidCheckDigit"));
        }
    }
}
