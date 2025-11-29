import type { CharacterSetCreator, CharacterSetValidation } from "@aidc-toolkit/utility";
import { type IdentifierType, IdentifierTypes } from "./identifier-type";
import { type ContentCharacterSet, ContentCharacterSets, type IdentifierValidation } from "./identifier-validator";
import { i18nextGS1 } from "./locale/i18n";
import {
    type NonGTINNumericIdentifierType,
    NonGTINNumericIdentifierValidator
} from "./non-gtin-numeric-identifier-validator";
import { LeaderTypes } from "./numeric-identifier-validator";

/**
 * Serializable numeric identifier type.
 */
export type SerializableNumericIdentifierType = Exclude<NonGTINNumericIdentifierType, typeof IdentifierTypes.GLN | typeof IdentifierTypes.SSCC | typeof IdentifierTypes.GSRN | typeof IdentifierTypes.GSIN>;

/**
 * Serializable numeric identifier validator. Validates both serialized and non-serialized forms of
 * numeric identifiers that support serialization.
 */
export class SerializableNumericIdentifierValidator extends NonGTINNumericIdentifierValidator {
    /**
     * Serial component length.
     */
    private readonly _serialComponentLength: number;

    /**
     * Serial component character set.
     */
    private readonly _serialComponentCharacterSet: ContentCharacterSet;

    /**
     * Serial component validation parameters.
     */
    private readonly _serialComponentValidation: CharacterSetValidation;

    /**
     * Serial component creator.
     */
    private readonly _serialComponentCreator: CharacterSetCreator;

    /**
     * Constructor.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param length
     * Length.
     *
     * @param serialComponentLength
     * Serial component length.
     *
     * @param serialComponentCharacterSet
     * Serial component character set.
     */
    constructor(identifierType: IdentifierType, length: number, serialComponentLength: number, serialComponentCharacterSet: ContentCharacterSet) {
        super(identifierType, length, LeaderTypes.None);

        this._serialComponentLength = serialComponentLength;
        this._serialComponentCharacterSet = serialComponentCharacterSet;

        this._serialComponentValidation = {
            minimumLength: 1,
            maximumLength: serialComponentLength,
            component: () => i18nextGS1.t("Identifier.serialComponent")
        };

        this._serialComponentCreator = SerializableNumericIdentifierValidator.creatorFor(serialComponentCharacterSet);
    }

    /**
     * Get the serial component length.
     */
    get serialComponentLength(): number {
        return this._serialComponentLength;
    }

    /**
     * Get the serial component character set.
     */
    get serialComponentCharacterSet(): ContentCharacterSet {
        return this._serialComponentCharacterSet;
    }

    /**
     * Get the serial component validation parameters.
     */
    protected get serialComponentValidation(): CharacterSetValidation {
        return this._serialComponentValidation;
    }

    /**
     * Get the serial component creator.
     */
    get serialComponentCreator(): CharacterSetCreator {
        return this._serialComponentCreator;
    }

    /**
     * @inheritDoc
     */
    override validate(identifier: string, validation?: IdentifierValidation): void {
        super.validate(identifier.substring(0, this.length), validation);

        if (identifier.length > this.length) {
            this.serialComponentCreator.validate(identifier.substring(this.length), this._serialComponentValidation);
        }
    }
}

/**
 * GRAI validator.
 */
export const GRAI_VALIDATOR = new SerializableNumericIdentifierValidator(IdentifierTypes.GRAI, 13, 16, ContentCharacterSets.AI82);

/**
 * GDTI validator.
 */
export const GDTI_VALIDATOR = new SerializableNumericIdentifierValidator(IdentifierTypes.GDTI, 13, 17, ContentCharacterSets.AI82);

/**
 * GCN validator.
 */
export const GCN_VALIDATOR = new SerializableNumericIdentifierValidator(IdentifierTypes.GCN, 13, 12, ContentCharacterSets.Numeric);
