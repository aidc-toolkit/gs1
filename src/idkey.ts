import {
    CharacterSetCreator,
    type CharacterSetValidation,
    Exclusion,
    NUMERIC_CREATOR,
    RegExpValidator,
    type StringValidation,
    type StringValidator,
    type TransformerInput,
    type TransformerOutput,
    transformIterable
} from "@aidc-toolkit/utility";
import { Mixin } from "ts-mixer";
import { AI39_CREATOR, AI82_CREATOR } from "./character-set.js";
import {
    checkCharacterPair,
    checkDigit,
    checkDigitSum,
    hasValidCheckCharacterPair,
    hasValidCheckDigit
} from "./check.js";
import i18next, { gs1NS } from "./locale/i18n.js";

/**
 * Identification key type.
 */
export enum IdentificationKeyType {
    /**
     * Global Trade Item Number.
     */
    GTIN = "GTIN",

    /**
     * Global Location Number.
     */
    GLN = "GLN",

    /**
     * Serial Shipping Container Code.
     */
    SSCC = "SSCC",

    /**
     * Global Returnable Asset Identifier.
     */
    GRAI = "GRAI",

    /**
     * Global Individual Asset Identifier.
     */
    GIAI = "GIAI",

    /**
     * Global Service Relation Number.
     */
    GSRN = "GSRN",

    /**
     * Global Document Type Identifier.
     */
    GDTI = "GDTI",

    /**
     * Global Identification Number for Consignment.
     */
    GINC = "GINC",

    /**
     * Global Shipment Identification Number.
     */
    GSIN = "GSIN",

    /**
     * Global Coupon Number.
     */
    GCN = "GCN",

    /**
     * Component/Part Identifier.
     */
    CPID = "CPID",

    /**
     * Global Model Number.
     */
    GMN = "GMN"
}

/**
 * Prefix type.
 */
export enum PrefixType {
    /**
     * GS1 Company Prefix.
     */
    GS1CompanyPrefix,

    /**
     * U.P.C. Company Prefix.
     */
    UPCCompanyPrefix,

    /**
     * GS1-8 Prefix.
     */
    GS18Prefix
}

/**
 * Character set supported by the reference portion of an identification key or the serial component of a numeric
 * identification key.
 */
export enum ContentCharacterSet {
    /**
     * Numeric.
     */
    Numeric,

    /**
     * GS1 AI encodable character set 82.
     */
    AI82,

    /**
     * GS1 AI encodable character set 39.
     */
    AI39
}

/**
 * Identification key validation parameters.
 */
export interface IdentificationKeyValidation extends StringValidation {
    /**
     * Position offset within a larger string. Strings are sometimes composed of multiple substrings; this parameter
     * ensures that the error notes the proper position in the string.
     */
    positionOffset?: number | undefined;
}

/**
 * Identification key validator. Validates an identification key against its definition in section 3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 */
export interface IdentificationKeyValidator<V extends IdentificationKeyValidation = IdentificationKeyValidation> extends StringValidator<V> {
    /**
     * Get the identification key type. Per the GS1 General Specifications, the identification key type determines
     * the remaining properties.
     */
    get identificationKeyType(): IdentificationKeyType;

    /**
     * Get the prefix type supported by the identification key type. For all identification key types except the GTIN,
     * this is {@linkcode PrefixType.GS1CompanyPrefix}. For the GTIN, the prefix type determines the length.
     */
    get prefixType(): PrefixType;

    /**
     * Get the length. For numeric identification key types, the length is fixed; for alphanumeric identification key
     * types, the length is the maximum.
     */
    get length(): number;

    /**
     * Get the reference character set.
     */
    get referenceCharacterSet(): ContentCharacterSet;

    /**
     * Get the reference validator.
     */
    get referenceCreator(): CharacterSetCreator;

    /**
     * Validate an identification key and throw an error if validation fails.
     *
     * @param identificationKey
     * Identification key.
     *
     * @param validation
     * Identification key validation parameters.
     */
    validate: (identificationKey: string, validation?: V) => void;
}

/**
 * Abstract identification key validator. Implements common functionality for an identification key validator.
 */
abstract class AbstractIdentificationKeyValidator<V extends IdentificationKeyValidation = IdentificationKeyValidation> implements IdentificationKeyValidator<V> {
    private static readonly CHARACTER_SET_CREATORS = [
        NUMERIC_CREATOR, AI82_CREATOR, AI39_CREATOR
    ];

    /**
     * Identification key type.
     */
    private readonly _identificationKeyType: IdentificationKeyType;

    /**
     * Prefix type.
     */
    private readonly _prefixType: PrefixType;

    /**
     * Length.
     */
    private readonly _length: number;

    /**
     * Reference character set.
     */
    private readonly _referenceCharacterSet: ContentCharacterSet;

    /**
     * Reference creator.
     */
    private readonly _referenceCreator: CharacterSetCreator;

    /**
     * Get the character set creator for a character set.
     *
     * @param characterSet
     * Character set.
     *
     * @returns
     * Character set creator.
     */
    protected static creatorFor(characterSet: ContentCharacterSet): CharacterSetCreator {
        return AbstractIdentificationKeyValidator.CHARACTER_SET_CREATORS[characterSet];
    }

    /**
     * Constructor.
     *
     * @param identificationKeyType
     * Identification key type.
     *
     * @param prefixType
     * Prefix type.
     *
     * @param length
     * Length.
     *
     * @param referenceCharacterSet
     * Reference character set.
     */
    protected constructor(identificationKeyType: IdentificationKeyType, prefixType: PrefixType, length: number, referenceCharacterSet: ContentCharacterSet) {
        this._identificationKeyType = identificationKeyType;
        this._prefixType = prefixType;
        this._length = length;
        this._referenceCharacterSet = referenceCharacterSet;
        this._referenceCreator = AbstractIdentificationKeyValidator.creatorFor(referenceCharacterSet);
    }

    /**
     * @inheritDoc
     */
    get identificationKeyType(): IdentificationKeyType {
        return this._identificationKeyType;
    }

    /**
     * @inheritDoc
     */
    get prefixType(): PrefixType {
        return this._prefixType;
    }

    /**
     * @inheritDoc
     */
    get length(): number {
        return this._length;
    }

    /**
     * @inheritDoc
     */
    get referenceCharacterSet(): ContentCharacterSet {
        return this._referenceCharacterSet;
    }

    /**
     * @inheritDoc
     */
    get referenceCreator(): CharacterSetCreator {
        return this._referenceCreator;
    }

    /**
     * Pad an identification key on the left with zero-value character for validation purposes. This is done to align an
     * identification key with a position offset for any error message that may be thrown by the reference validator.
     *
     * @param identificationKey
     * Identification key.
     *
     * @param validation
     * Identification key validation parameters.
     *
     * @returns
     * Padded identification key.
     */
    protected padIdentificationKey(identificationKey: string, validation: IdentificationKeyValidation | undefined): string {
        // Identification key is returned as is if position offset is undefined.
        return validation?.positionOffset === undefined ? identificationKey : this.referenceCreator.character(0).repeat(validation.positionOffset).concat(identificationKey);
    }

    /**
     * Validate the prefix within an identification key.
     *
     * @param partialIdentificationKey
     * Partial identification key.
     *
     * @param positionOffset
     * Position offset within a larger string.
     */
    protected validatePrefix(partialIdentificationKey: string, positionOffset?: number): void {
        // Delegate to prefix manager with support for U.P.C. Company Prefix but not GS1-8 Prefix.
        PrefixManager.validatePrefix(this.prefixType, true, false, partialIdentificationKey, true, this.referenceCharacterSet === ContentCharacterSet.Numeric, positionOffset);
    }

    abstract validate(identificationKey: string, validation?: V): void;
}

/**
 * Leader type.
 */
export enum LeaderType {
    /**
     * No leader.
     */
    None,

    /**
     * Indicator digit (GTIN only).
     */
    IndicatorDigit,

    /**
     * Extension digit (SSCC only).
     */
    ExtensionDigit
}

/**
 * Numeric identification key validator. Validates a numeric identification key.
 */
export interface NumericIdentificationKeyValidator extends IdentificationKeyValidator {
    /**
     * Get the leader type.
     */
    get leaderType(): LeaderType;
}

/**
 * Abstract numeric identification key validator. Implements common functionality for a numeric identification key
 * validator.
 */
abstract class AbstractNumericIdentificationKeyValidator extends AbstractIdentificationKeyValidator implements NumericIdentificationKeyValidator {
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
     * @param identificationKeyType
     * Identification key type.
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
    protected constructor(identificationKeyType: IdentificationKeyType, prefixType: PrefixType, length: number, leaderType: LeaderType) {
        super(identificationKeyType, prefixType, length, ContentCharacterSet.Numeric);

        this._leaderType = leaderType;
        this._prefixPosition = Number(this.leaderType === LeaderType.ExtensionDigit);
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
    validate(identificationKey: string, validation?: IdentificationKeyValidation): void {
        // Validate the prefix, with care taken for its position within the identification key.
        if (this._prefixPosition === 0) {
            super.validatePrefix(identificationKey, validation?.positionOffset);
        } else {
            super.validatePrefix(identificationKey.substring(this._prefixPosition), validation?.positionOffset === undefined ? this._prefixPosition : validation.positionOffset + this._prefixPosition);
        }

        // Validate the length.
        if (identificationKey.length !== this.length) {
            throw new RangeError(i18next.t("IdentificationKey.identificationKeyTypeLength", {
                ns: gs1NS,
                identificationKeyType: this.identificationKeyType,
                length: this.length
            }));
        }

        // Validating the check digit will also validate the characters.
        if (!hasValidCheckDigit(this.padIdentificationKey(identificationKey, validation))) {
            throw new RangeError(i18next.t("IdentificationKey.invalidCheckDigit", {
                ns: gs1NS
            }));
        }
    }
}

/**
 * GTIN type. The numeric values of this enumeration are equal to the lengths of the GTIN types.
 */
export enum GTINType {
    /**
     * GTIN-13.
     */
    GTIN13 = 13,

    /**
     * GTIN-12.
     */
    GTIN12 = 12,

    /**
     * GTIN-8.
     */
    GTIN8 = 8,

    /**
     * GTIN-14.
     */
    GTIN14 = 14
}

/**
 * Level at which GTIN is to be validated.
 */
export enum GTINLevel {
    /**
     * Any level (level is ignored).
     */
    Any,

    /**
     * Retail consumer trade item level, supporting GTIN-13, GTIN-12 (optionally zero-suppressed), and GTIN-8.
     */
    RetailConsumer,

    /**
     * Other than retail consumer trade item level, supporting GTIN-13, GTIN-12 (not zero-suppressed), and GTIN-14.
     */
    OtherThanRetailConsumer
}

/**
 * GTIN validator.
 */
export class GTINValidator extends AbstractNumericIdentificationKeyValidator {
    /**
     * Zero-suppressed GTIN-12 validation parameters.
     */
    private static readonly ZERO_SUPPRESSED_GTIN12_VALIDATION: CharacterSetValidation = {
        minimumLength: 8,
        maximumLength: 8
    };

    /**
     * Constructor.
     *
     * @param gtinType
     * GTIN type.
     */
    constructor(gtinType: GTINType) {
        let prefixType: PrefixType;

        // Determine the prefix type based on the GTIN type.
        switch (gtinType) {
            case GTINType.GTIN13:
                prefixType = PrefixType.GS1CompanyPrefix;
                break;

            case GTINType.GTIN12:
                prefixType = PrefixType.UPCCompanyPrefix;
                break;

            case GTINType.GTIN8:
                prefixType = PrefixType.GS18Prefix;
                break;

            default:
                // Should never get here.
                throw new Error("Not supported");
        }

        super(IdentificationKeyType.GTIN, prefixType, gtinType, LeaderType.IndicatorDigit);
    }

    /**
     * @inheritDoc
     */
    get gtinType(): GTINType {
        // Length maps to GTIN type enumeration.
        return this.length satisfies GTINType;
    }

    /**
     * @inheritDoc
     */
    protected override validatePrefix(partialIdentificationKey: string, positionOffset?: number): void {
        // Delegate to prefix manager requiring exact match for prefix type.
        PrefixManager.validatePrefix(this.prefixType, false, false, partialIdentificationKey, true, true, positionOffset);
    }

    /**
     * Zero expand a zero-suppressed GTIN-12.
     *
     * @param zeroSuppressedGTIN12
     * Zero-suppressed GTIN-12.
     *
     * @returns
     * GTIN-12.
     */
    static zeroExpand(zeroSuppressedGTIN12: string): string {
        NUMERIC_CREATOR.validate(zeroSuppressedGTIN12, GTINValidator.ZERO_SUPPRESSED_GTIN12_VALIDATION);

        // Convert to individual digits.
        const d = Array.from(zeroSuppressedGTIN12);

        let gtin12: string | undefined;

        // Zero-suppressed GTIN-12 always starts with 0.
        if (d[0] === "0") {
            if (d[6] >= "5" && d[5] !== "0") {
                gtin12 = `0${d[1]}${d[2]}${d[3]}${d[4]}${d[5]}0000${d[6]}${d[7]}`;
            } else if (d[6] === "4" && d[4] !== "0") {
                gtin12 = `0${d[1]}${d[2]}${d[3]}${d[4]}00000${d[5]}${d[7]}`;
            } else if (d[6] <= "2") {
                gtin12 = `0${d[1]}${d[2]}${d[6]}0000${d[3]}${d[4]}${d[5]}${d[7]}`;
            } else if (d[6] === "3" && d[3] >= "3") {
                gtin12 = `0${d[1]}${d[2]}${d[3]}00000${d[4]}${d[5]}${d[7]}`;
            }
        }

        if (gtin12 === undefined) {
            throw new RangeError(i18next.t("IdentificationKey.invalidZeroSuppressedGTIN12", {
                ns: gs1NS
            }));
        }

        // Make sure that resulting GTIN-12 is valid.
        GTIN12_VALIDATOR.validate(gtin12);

        return gtin12;
    }

    /**
     * Validate any GTIN, optionally against a level.
     *
     * @param gtin
     * GTIN.
     *
     * @param gtinLevel
     * Level at which GTIN is to be validated.
     */
    static validateAny(gtin: string, gtinLevel: GTINLevel = GTINLevel.Any): void {
        // Assume length-validated GTIN is the GTIN (true for all except zero-suppressed GTIN-12).
        let lengthValidatedGTIN = gtin;

        let gtinLevelRestriction: GTINLevel;

        switch (gtin.length) {
            case GTINType.GTIN13 as number:
                if (gtin.startsWith("0")) {
                    throw new RangeError(i18next.t("IdentificationKey.invalidGTIN13AtRetail", {
                        ns: gs1NS
                    }));
                }

                // Validate prefix requiring exact match for prefix type.
                PrefixManager.validatePrefix(PrefixType.GS1CompanyPrefix, false, false, gtin, true, true);

                gtinLevelRestriction = GTINLevel.Any;
                break;

            case GTINType.GTIN12 as number:
                // Validate prefix requiring exact match for prefix type.
                PrefixManager.validatePrefix(PrefixType.UPCCompanyPrefix, false, false, gtin, true, true);

                gtinLevelRestriction = GTINLevel.Any;
                break;

            case GTINType.GTIN8 as number:
                // Zero-suppressed GTIN-12 always starts with 0.
                if (!gtin.startsWith("0")) {
                    // Validate prefix requiring exact match for prefix type.
                    PrefixManager.validatePrefix(PrefixType.GS18Prefix, false, false, gtin, true, true);
                } else {
                    lengthValidatedGTIN = GTINValidator.zeroExpand(gtin);
                }

                gtinLevelRestriction = GTINLevel.RetailConsumer;
                break;

            case GTINType.GTIN14 as number:
                // Validate prefix supporting any prefix type.
                PrefixManager.validatePrefix(PrefixType.GS1CompanyPrefix, true, true, gtin.substring(1), true, true);

                gtinLevelRestriction = GTINLevel.OtherThanRetailConsumer;
                break;

            default:
                throw new RangeError(i18next.t("IdentificationKey.invalidGTINLength", {
                    ns: gs1NS
                }));
        }

        // Validating the check digit will also validate the characters.
        if (!hasValidCheckDigit(lengthValidatedGTIN)) {
            throw new RangeError(i18next.t("IdentificationKey.invalidCheckDigit", {
                ns: gs1NS
            }));
        }

        // Validate against level if required.
        if (gtinLevel !== GTINLevel.Any && gtinLevelRestriction !== GTINLevel.Any && gtinLevelRestriction !== gtinLevel) {
            throw new RangeError(i18next.t(gtinLevel === GTINLevel.RetailConsumer ? "IdentificationKey.invalidGTINAtRetail" : "IdentificationKey.invalidGTINAtOtherThanRetail", {
                ns: gs1NS
            }));
        }
    }

    /**
     * Validate a GTIN-14.
     *
     * @param gtin14
     * GTIN-14.
     */
    static validateGTIN14(gtin14: string): void {
        if (gtin14.length as GTINType !== GTINType.GTIN14) {
            throw new RangeError(i18next.t("IdentificationKey.invalidGTIN14Length", {
                ns: gs1NS
            }));
        }

        GTINCreator.validateAny(gtin14);
    }
}

/**
 * Non-GTIN numeric identification key validator.
 */
export class NonGTINNumericIdentificationKeyValidator extends AbstractNumericIdentificationKeyValidator {
    /**
     * Constructor.
     *
     * @param identificationKeyType
     * Identification key type.
     *
     * @param length
     * Length.
     *
     * @param leaderType
     * Leader type.
     */
    constructor(identificationKeyType: IdentificationKeyType, length: number, leaderType: LeaderType = LeaderType.None) {
        super(identificationKeyType, PrefixType.GS1CompanyPrefix, length, leaderType);
    }
}

/**
 * Serializable numeric identification key validator. Validates both serialized and non-serialized forms of
 * numeric identification keys that support serialization.
 */
export class SerializableNumericIdentificationKeyValidator extends NonGTINNumericIdentificationKeyValidator {
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
     * @param identificationKeyType
     * Identification key type.
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
    constructor(identificationKeyType: IdentificationKeyType, length: number, serialComponentLength: number, serialComponentCharacterSet: ContentCharacterSet) {
        super(identificationKeyType, length, LeaderType.None);

        this._serialComponentLength = serialComponentLength;
        this._serialComponentCharacterSet = serialComponentCharacterSet;

        this._serialComponentValidation = {
            minimumLength: 1,
            maximumLength: serialComponentLength,
            component: () => i18next.t("IdentificationKey.serialComponent", {
                ns: gs1NS
            })
        };

        this._serialComponentCreator = SerializableNumericIdentificationKeyValidator.creatorFor(serialComponentCharacterSet);
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
    override validate(identificationKey: string, validation?: IdentificationKeyValidation): void {
        super.validate(identificationKey.substring(0, this.length), validation);

        if (identificationKey.length > this.length) {
            this.serialComponentCreator.validate(identificationKey.substring(this.length), this._serialComponentValidation);
        }
    }
}

/**
 * Non-numeric identification key validation parameters.
 */
export interface NonNumericIdentificationKeyValidation extends IdentificationKeyValidation {
    /**
     * Exclusion support for reference. Prevents non-numeric identification key from being mistaken for numeric
     * identification key.
     */
    exclusion?: Exclusion.None | Exclusion.AllNumeric | undefined;
}

/**
 * Non-numeric identification key validator.
 */
export class NonNumericIdentificationKeyValidator extends AbstractIdentificationKeyValidator<NonNumericIdentificationKeyValidation> {
    /**
     * Validator to ensure that an identification key (minus check character pair) is not all numeric.
     */
    private static readonly NOT_ALL_NUMERIC_VALIDATOR = new class extends RegExpValidator {
        /**
         * @inheritDoc
         */
        protected override createErrorMessage(_s: string): string {
            return i18next.t("IdentificationKey.referenceCantBeAllNumeric", {
                ns: gs1NS
            });
        }
    }(/\D/);

    /**
     * True if the identification key requires a check character pair.
     */
    private readonly _requiresCheckCharacterPair: boolean;

    /**
     * Constructor.
     *
     * @param identificationKeyType
     * Identification key type.
     *
     * @param length
     * Length.
     *
     * @param referenceCharacterSet
     * Reference character set.
     *
     * @param requiresCheckCharacterPair
     * True if the identification key requires a check character pair.
     */
    constructor(identificationKeyType: IdentificationKeyType, length: number, referenceCharacterSet: ContentCharacterSet, requiresCheckCharacterPair = false) {
        super(identificationKeyType, PrefixType.GS1CompanyPrefix, length, referenceCharacterSet);

        this._requiresCheckCharacterPair = requiresCheckCharacterPair;
    }

    /**
     * Determine if the identification key requires a check character pair.
     */
    get requiresCheckCharacterPair(): boolean {
        return this._requiresCheckCharacterPair;
    }

    /**
     * Validate a non-numeric identification key and throw an error if validation fails.
     *
     * @param identificationKey
     * Identification key.
     *
     * @param validation
     * Validation parameters.
     */
    validate(identificationKey: string, validation?: NonNumericIdentificationKeyValidation): void {
        const partialIdentificationKey = this.requiresCheckCharacterPair ? identificationKey.substring(0, identificationKey.length - 2) : identificationKey;

        super.validatePrefix(partialIdentificationKey, validation?.positionOffset);

        if (!this.requiresCheckCharacterPair) {
            this.referenceCreator.validate(identificationKey, {
                maximumLength: this.length,
                positionOffset: validation?.positionOffset
            });
        // Validating the check character pair will also validate the characters.
        } else if (!hasValidCheckCharacterPair(this.padIdentificationKey(identificationKey, validation))) {
            throw new RangeError(i18next.t("IdentificationKey.invalidCheckCharacterPair", {
                ns: gs1NS
            }));
        }

        // Check for all-numeric identification key (minus check character pair) if excluded.
        if (validation?.exclusion === Exclusion.AllNumeric) {
            NonNumericIdentificationKeyValidator.NOT_ALL_NUMERIC_VALIDATOR.validate(partialIdentificationKey);
        }
    }
}

/**
 * GTIN-13 validator.
 */
export const GTIN13_VALIDATOR = new GTINValidator(GTINType.GTIN13);

/**
 * GTIN-12 validator.
 */
export const GTIN12_VALIDATOR = new GTINValidator(GTINType.GTIN12);

/**
 * GTIN-8 validator.
 */
export const GTIN8_VALIDATOR = new GTINValidator(GTINType.GTIN8);

/**
 * GTIN validators indexed by prefix type.
 */
export const GTIN_VALIDATORS = [
    GTIN13_VALIDATOR, GTIN12_VALIDATOR, GTIN8_VALIDATOR
];

/**
 * GLN validator.
 */
export const GLN_VALIDATOR = new NonGTINNumericIdentificationKeyValidator(IdentificationKeyType.GLN, 13);

/**
 * SSCC validator.
 */
export const SSCC_VALIDATOR = new NonGTINNumericIdentificationKeyValidator(IdentificationKeyType.SSCC, 18, LeaderType.ExtensionDigit);

/**
 * GRAI validator.
 */
export const GRAI_VALIDATOR = new SerializableNumericIdentificationKeyValidator(IdentificationKeyType.GRAI, 13, 16, ContentCharacterSet.AI82);

/**
 * GIAI validator.
 */
export const GIAI_VALIDATOR = new NonNumericIdentificationKeyValidator(IdentificationKeyType.GIAI, 30, ContentCharacterSet.AI82);

/**
 * GSRN validator.
 */
export const GSRN_VALIDATOR = new NonGTINNumericIdentificationKeyValidator(IdentificationKeyType.GSRN, 18);

/**
 * GDTI validator.
 */
export const GDTI_VALIDATOR = new SerializableNumericIdentificationKeyValidator(IdentificationKeyType.GDTI, 13, 17, ContentCharacterSet.AI82);

/**
 * GINC validator.
 */
export const GINC_VALIDATOR = new NonNumericIdentificationKeyValidator(IdentificationKeyType.GINC, 30, ContentCharacterSet.AI82);

/**
 * GSIN validator.
 */
export const GSIN_VALIDATOR = new NonGTINNumericIdentificationKeyValidator(IdentificationKeyType.GSIN, 17);

/**
 * GCN validator.
 */
export const GCN_VALIDATOR = new SerializableNumericIdentificationKeyValidator(IdentificationKeyType.GCN, 13, 12, ContentCharacterSet.Numeric);

/**
 * CPID validator.
 */
export const CPID_VALIDATOR = new NonNumericIdentificationKeyValidator(IdentificationKeyType.CPID, 30, ContentCharacterSet.AI39);

/**
 * GMN validator.
 */
export const GMN_VALIDATOR = new NonNumericIdentificationKeyValidator(IdentificationKeyType.GMN, 25, ContentCharacterSet.AI82, true);

/**
 * Identification key creator. Creates an identification key based on its definition in section 3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * Keys are created based on a prefix defined in a prefix manager to which the identification key creator is bound.
 */
export interface IdentificationKeyCreator extends IdentificationKeyValidator {
    /**
     * Get the prefix manager to which this identification key creator is bound.
     */
    get prefixManager(): PrefixManager;

    /**
     * Get the prefix, equivalent to calling {@linkcode PrefixManager.prefix | prefixManager.prefix} for a GTIN or
     * {@linkcode PrefixManager.gs1CompanyPrefix | prefixManager.gs1CompanyPrefix} for all other identification key
     * types.
     */
    get prefix(): string;

    /**
     * Get the reference length.
     */
    get referenceLength(): number;
}

/**
 * Abstract identification key creator. Implements common functionality for an identification key creator, bound to a
 * {@link PrefixManager}.
 */
abstract class AbstractIdentificationKeyCreator implements IdentificationKeyCreator {
    /**
     * Prefix manager.
     */
    private _prefixManager!: PrefixManager;

    /**
     * Reference length.
     */
    private _referenceLength!: number;

    /**
     * Initialize the prefix manager. This method is in lieu of a constructor due to the mixin architecture.
     *
     * @param prefixManager
     * Prefix manager.
     *
     * @param prefix
     * Prefix within prefix manager to use to calculate reference length.
     *
     * @param checkAllowance
     * Number of characters to allow for check digit or check character pair.
     */
    protected init(prefixManager: PrefixManager, prefix: string, checkAllowance: number): void {
        this._prefixManager = prefixManager;

        // Reference length allows for prefix and optionally check digit or check character pair.
        this._referenceLength = this.length - prefix.length - checkAllowance;
    }

    abstract get identificationKeyType(): IdentificationKeyType;

    abstract get prefixType(): PrefixType;

    abstract get length(): number;

    abstract get referenceCharacterSet(): ContentCharacterSet;

    abstract get referenceCreator(): CharacterSetCreator;

    /**
     * @inheritDoc
     */
    get prefixManager(): PrefixManager {
        return this._prefixManager;
    }

    /**
     * @inheritDoc
     */
    get prefix(): string {
        return this.prefixManager.gs1CompanyPrefix;
    }

    /**
     * @inheritDoc
     */
    get referenceLength(): number {
        return this._referenceLength;
    }

    abstract validate(identificationKey: string, validation?: IdentificationKeyValidation): void;
}

/**
 * Numeric identification key creator. Creates one or many numeric identification keys.
 */
export interface NumericIdentificationKeyCreator extends NumericIdentificationKeyValidator, IdentificationKeyCreator {
    /**
     * Get the capacity (`10**referenceLength`).
     */
    get capacity(): number;

    /**
     * Create identification key(s) with reference(s) based on numeric value(s). The value(s) is/are converted to
     * references of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @param valueOrValues
     * Numeric value(s).
     *
     * @param sparse
     * If true, the value(s) are mapped to a sparse sequence resistant to discovery. Default is false.
     *
     * @returns
     * Identification key(s).
     */
    create: <T extends TransformerInput<number | bigint>>(valueOrValues: T, sparse?: boolean) => TransformerOutput<T, string>;

    /**
     * Create all identification keys for the prefix from `0` to `capacity - 1`.
     *
     * The implementation creates the strings only as needed using an internal generator function. Although the result
     * is equivalent to calling `creator.create(new Sequencer(0, creator.capacity - 1))`, this method is significantly
     * faster.
     *
     * @returns
     * All identification keys for the prefix.
     */
    createAll: () => Iterable<string>;
}

/**
 * Abstract numeric identification key creator. Implements common functionality for a numeric identification key creator.
 */
abstract class AbstractNumericIdentificationKeyCreator extends AbstractIdentificationKeyCreator implements NumericIdentificationKeyCreator {
    /**
     * Capacity.
     */
    private _capacity!: number;

    /**
     * Tweak for sparse creation.
     */
    private _tweak = 0n;

    /**
     * Initialize the prefix manager. This method is in lieu of a constructor due to the mixin architecture.
     *
     * @param prefixManager
     * Prefix manager.
     *
     * @param prefix
     * Prefix within prefix manager to use to calculate reference length.
     */
    protected override init(prefixManager: PrefixManager, prefix: string): void {
        super.init(prefixManager, prefix, 1);

        // Capacity is always in number range.
        this._capacity = Number(CharacterSetCreator.powerOf10(this.referenceLength));
    }

    abstract get leaderType(): LeaderType;

    /**
     * @inheritDoc
     */
    get capacity(): number {
        return this._capacity;
    }

    /**
     * Get the tweak for sparse creation.
     */
    get tweak(): bigint {
        return this._tweak;
    }

    /**
     * Set the tweak for sparse creation.
     */
    set tweak(value: bigint) {
        this._tweak = value;
    }

    /**
     * Build an identification key from a reference by merging it with the prefix and adding the check digit.
     *
     * @param reference
     * Identification key reference.
     *
     * @returns
     * Identification key.
     */
    private buildIdentificationKey(reference: string): string {
        const partialIdentificationKey = this.leaderType === LeaderType.ExtensionDigit ? reference.substring(0, 1) + this.prefix + reference.substring(1) : this.prefix + reference;

        return partialIdentificationKey + checkDigit(partialIdentificationKey);
    }

    /**
     * @inheritDoc
     */
    create<T extends TransformerInput<number | bigint>>(valueOrValues: T, sparse = false): TransformerOutput<T, string> {
        return NUMERIC_CREATOR.create(this.referenceLength, valueOrValues, Exclusion.None, sparse ? this.tweak : undefined, reference => this.buildIdentificationKey(reference));
    }

    /**
     * Create all identification keys from a partial identification key. Call is recursive until remaining reference
     * length is 0.
     *
     * @param partialIdentificationKey
     * Partial identification key. Initial value is `this.prefix`.
     *
     * @param remainingReferenceLength
     * Remaining reference length. Initial value is `this.referenceLength`.
     *
     * @param extensionWeight
     * If this value is not zero, the identification key has an extension digit, this call is setting it, and this value
     * is applied to the calculation of the check digit.
     *
     * @param weight
     * If the extension weight is zero, this value is applied to the calculation of the check digit.
     *
     * @param partialCheckDigitSum
     * Partial check digit sum for the partial identification key.
     *
     * @yields
     * Identification key.
     */
    private static * createAllPartial(partialIdentificationKey: string, remainingReferenceLength: number, extensionWeight: number, weight: number, partialCheckDigitSum: number): Generator<string> {
        if (remainingReferenceLength === 0) {
            // Finalize check digit calculation and append.
            yield partialIdentificationKey + NUMERIC_CREATOR.character(9 - (partialCheckDigitSum + 9) % 10);
        } else {
            const nextRemainingReferenceLength = remainingReferenceLength - 1;

            let nextPartialCheckDigitSum = partialCheckDigitSum;

            if (extensionWeight !== 0) {
                // Apply every digit to the extension digit.
                for (const c of NUMERIC_CREATOR.characterSet) {
                    yield * AbstractNumericIdentificationKeyCreator.createAllPartial(c + partialIdentificationKey, nextRemainingReferenceLength, 0, weight, nextPartialCheckDigitSum);

                    nextPartialCheckDigitSum += extensionWeight;
                }
            } else {
                const nextWeight = 4 - weight;

                // Apply every digit to the current character in the identification key.
                for (const c of NUMERIC_CREATOR.characterSet) {
                    yield * AbstractNumericIdentificationKeyCreator.createAllPartial(partialIdentificationKey + c, nextRemainingReferenceLength, 0, nextWeight, nextPartialCheckDigitSum);

                    nextPartialCheckDigitSum += weight;
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    createAll(): Iterable<string> {
        const hasExtensionDigit = this.leaderType === LeaderType.ExtensionDigit;
        const prefix = this.prefix;
        const length = this.length;
        const referenceLength = this.referenceLength;

        // Start weight is for reference excluding extension digit, which has its weight calculated separately.
        const startWeight = 3 - 2 * ((referenceLength + 1 - Number(hasExtensionDigit)) % 2);

        // Returning separate Iterable object makes iteration repeatable.
        return {
            [Symbol.iterator]() {
                return AbstractNumericIdentificationKeyCreator.createAllPartial(prefix, referenceLength, hasExtensionDigit ? 3 - 2 * length % 2 : 0, startWeight, checkDigitSum(startWeight === 3, prefix));
            }
        };
    }
}

/**
 * GTIN creator. Applicable to GTIN-13, GTIN-12, and GTIN-8 types; no applicable to GTIN-14 type.
 */
export class GTINCreator extends Mixin(GTINValidator, AbstractNumericIdentificationKeyCreator) {
    /**
     * Validation parameters for required indicator digit.
     */
    private static readonly REQUIRED_INDICATOR_DIGIT_VALIDATION: CharacterSetValidation = {
        minimumLength: 1,
        maximumLength: 1,
        component: () => i18next.t("IdentificationKey.indicatorDigit", {
            ns: gs1NS
        })
    };

    /**
     * Validation parameters for optional indicator digit.
     */
    private static readonly OPTIONAL_INDICATOR_DIGIT_VALIDATION: CharacterSetValidation = {
        minimumLength: 0,
        maximumLength: 1,
        component: () => i18next.t("IdentificationKey.indicatorDigit", {
            ns: gs1NS
        })
    };

    /**
     * Constructor. Called internally by {@link PrefixManager.gtinCreator}; should not be called by other code.
     *
     * @param prefixManager
     * Prefix manager.
     *
     * @param gtinType
     * GTIN type.
     */
    constructor(prefixManager: PrefixManager, gtinType: GTINType) {
        super(gtinType);

        this.init(prefixManager, prefixManager.prefix);
    }

    /**
     * @inheritDoc
     */
    override get prefix(): string {
        return this.prefixManager.prefix;
    }

    /**
     * Create GTIN-14(s) with an indicator digit and reference(s) based on numeric value(s). The value(s) is/are
     * converted to reference(s) of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @param indicatorDigit
     * Indicator digit.
     *
     * @param valueOrValues
     * Numeric value(s).
     *
     * @param sparse
     * If true, the value(s) is/are mapped to a sparse sequence resistant to discovery. Default is false.
     *
     * @returns
     * GTIN-14(s).
     */
    createGTIN14<T extends TransformerInput<number | bigint>>(indicatorDigit: string, valueOrValues: T, sparse = false): TransformerOutput<T, string> {
        NUMERIC_CREATOR.validate(indicatorDigit, GTINCreator.REQUIRED_INDICATOR_DIGIT_VALIDATION);

        return NUMERIC_CREATOR.create(GTINType.GTIN13 - this.prefixManager.gs1CompanyPrefix.length - 1, valueOrValues, Exclusion.None, sparse ? this.tweak : undefined, (reference) => {
            const partialIdentificationKey = indicatorDigit + this.prefixManager.gs1CompanyPrefix + reference;

            return partialIdentificationKey + checkDigit(partialIdentificationKey);
        });
    }

    /**
     * Zero suppress a GTIN-12.
     *
     * @param gtin12
     * GTIN-12.
     *
     * @returns
     * Zero-suppressed GTIN-12.
     */
    static zeroSuppress(gtin12: string): string {
        GTIN12_VALIDATOR.validate(gtin12);

        // Convert to individual digits.
        const d = Array.from(gtin12);

        let zeroSuppressedGTIN12: string | undefined;

        // All rules require that digits in positions 1, 5, and 6 be zero.
        if (d[0] === "0" && d[6] === "0" && d[7] === "0") {
            if (d[10] >= "5" && d[8] === "0" && d[9] === "0" && d[5] !== "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[3]}${d[4]}${d[5]}${d[10]}${d[11]}`;
            } else if (d[5] === "0" && d[8] === "0" && d[9] === "0" && d[4] !== "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[3]}${d[4]}${d[10]}4${d[11]}`;
            } else if (d[3] <= "2" && d[4] === "0" && d[5] === "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[8]}${d[9]}${d[10]}${d[3]}${d[11]}`;
            } else if (d[3] >= "3" && d[4] === "0" && d[5] === "0" && d[8] === "0") {
                zeroSuppressedGTIN12 = `0${d[1]}${d[2]}${d[3]}${d[9]}${d[10]}3${d[11]}`;
            }
        }

        if (zeroSuppressedGTIN12 === undefined) {
            throw new RangeError(i18next.t("IdentificationKey.invalidZeroSuppressibleGTIN12", {
                ns: gs1NS
            }));
        }

        return zeroSuppressedGTIN12;
    }

    /**
     * Convert a GTIN of any length to a GTIN-14 with an optional indicator digit.
     *
     * @param indicatorDigit
     * Indicator digit. If blank, assumes "0" if the GTIN is not already a GTIN-14.
     *
     * @param gtin
     * GTIN.
     *
     * @returns
     * GTIN-14.
     */
    static convertToGTIN14(indicatorDigit: string, gtin: string): string {
        GTINCreator.validateAny(gtin);

        NUMERIC_CREATOR.validate(indicatorDigit, GTINCreator.OPTIONAL_INDICATOR_DIGIT_VALIDATION);

        const gtinLength = gtin.length;

        // Check digit doesn't change by prepending zeros.
        let gtin14 = "0".repeat(GTINType.GTIN14 - gtinLength) + gtin;

        // If indicator digit provided and is different, recalculate the check digit.
        if (indicatorDigit.length !== 0 && indicatorDigit !== gtin14.charAt(0)) {
            const partialGTIN14 = indicatorDigit + gtin14.substring(1, GTINType.GTIN14 - 1);

            gtin14 = partialGTIN14 + checkDigit(partialGTIN14);
        }

        return gtin14;
    }

    /**
     * Normalize a GTIN of any length.
     * - A GTIN-14 that starts with six zeros or a GTIN-13 that starts with five zeros is normalized to GTIN-8.
     * - A GTIN-14 that starts with two zeros or a GTIN-13 that starts with one zero is normalized to GTIN-12.
     * - A GTIN-14 that starts with one zero is normalized to GTIN-13.
     * - Otherwise, the GTIN is unchanged.
     *
     * @param gtin
     * GTIN.
     *
     * @returns
     * Normalized GTIN.
     */
    static normalize(gtin: string): string {
        const gtinLength = gtin.length;

        let normalizedGTIN: string;

        switch (gtinLength) {
            case GTINType.GTIN13 as number:
                if (!gtin.startsWith("0")) {
                    // GTIN is GTIN-13.
                    normalizedGTIN = gtin;
                } else if (!gtin.startsWith("00000")) {
                    // GTIN is GTIN-12.
                    normalizedGTIN = gtin.substring(1);
                } else if (!gtin.startsWith("000000")) {
                    // GTIN is GTIN-8.
                    normalizedGTIN = gtin.substring(5);
                } else {
                    throw new RangeError(i18next.t("IdentificationKey.invalidZeroSuppressedGTIN12AsGTIN13", {
                        ns: gs1NS
                    }));
                }
                break;

            case GTINType.GTIN12 as number:
                // GTIN is GTIN-12.
                normalizedGTIN = gtin;
                break;

            case GTINType.GTIN8 as number:
                if (!gtin.startsWith("0")) {
                    // GTIN is GTIN-8.
                    normalizedGTIN = gtin;
                } else {
                    // GTIN is zero-suppressed GTIN-12.
                    normalizedGTIN = GTINCreator.zeroExpand(gtin);
                }
                break;

            case GTINType.GTIN14 as number:
                if (!gtin.startsWith("0")) {
                    // GTIN is GTIN-14.
                    normalizedGTIN = gtin;
                } else if (!gtin.startsWith("00")) {
                    // GTIN is GTIN-13.
                    normalizedGTIN = gtin.substring(1);
                } else if (!gtin.startsWith("000000")) {
                    // GTIN is GTIN-12.
                    normalizedGTIN = gtin.substring(2);
                } else if (!gtin.startsWith("0000000")) {
                    // GTIN is GTIN-8.
                    normalizedGTIN = gtin.substring(6);
                } else {
                    throw new RangeError(i18next.t("IdentificationKey.invalidZeroSuppressedGTIN12AsGTIN14", {
                        ns: gs1NS
                    }));
                }
                break;

            default:
                throw new RangeError(i18next.t("IdentificationKey.invalidGTINLength", {
                    ns: gs1NS
                }));
        }

        // Validation applies to the normalized GTIN.
        GTINCreator.validateAny(normalizedGTIN);

        return normalizedGTIN;
    }
}

/**
 * Non-GTIN numeric identification key creator.
 */
export class NonGTINNumericIdentificationKeyCreator extends Mixin(NonGTINNumericIdentificationKeyValidator, AbstractNumericIdentificationKeyCreator) {
    /**
     * Constructor. Called internally by {@link PrefixManager} non-GTIN numeric identification key creator getters;
     * should not be called by other code.
     *
     * @param prefixManager
     * Prefix manager.
     *
     * @param identificationKeyType
     * Identification key type.
     *
     * @param length
     * Length.
     *
     * @param leaderType
     * Leader type.
     */
    constructor(prefixManager: PrefixManager, identificationKeyType: IdentificationKeyType, length: number, leaderType: LeaderType = LeaderType.None) {
        super(identificationKeyType, length, leaderType);

        this.init(prefixManager, prefixManager.gs1CompanyPrefix);
    }
}

/**
 * Serializable numeric identification key creator.
 */
export class SerializableNumericIdentificationKeyCreator extends Mixin(SerializableNumericIdentificationKeyValidator, AbstractNumericIdentificationKeyCreator) {
    /**
     * Constructor. Called internally by {@link PrefixManager} serialized numeric identification key creator getters;
     * should not be called by other code.
     *
     * @param prefixManager
     * Prefix manager.
     *
     * @param identificationKeyType
     * Identification key type.
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
    constructor(prefixManager: PrefixManager, identificationKeyType: IdentificationKeyType, length: number, serialComponentLength: number, serialComponentCharacterSet: ContentCharacterSet) {
        super(identificationKeyType, length, serialComponentLength, serialComponentCharacterSet);

        this.init(prefixManager, prefixManager.gs1CompanyPrefix);
    }

    /**
     * Concatenate a validated base identification key with serial component(s).
     *
     * @param baseIdentificationKey
     * Base identification key.
     *
     * @param serialComponentOrComponents
     * Serial component(s).
     *
     * @returns
     * Serialized identification key(s).
     */
    private concatenateValidated<T extends TransformerInput<string>>(baseIdentificationKey: string, serialComponentOrComponents: T): TransformerOutput<T, string> {
        // TODO Refactor type when https://github.com/microsoft/TypeScript/pull/56941 released.
        let result: string | Iterable<string>;

        const serialComponentCreator = this.serialComponentCreator;
        const serialComponentValidation = this.serialComponentValidation;

        /**
         * Validate a serial component and concatenate it to the base identification key.
         *
         * @param serialComponent
         * Serial component.
         *
         * @returns
         * Serialized identification key.
         */
        function validateAndConcatenate(serialComponent: string): string {
            serialComponentCreator.validate(serialComponent, serialComponentValidation);

            return baseIdentificationKey + serialComponent;
        }

        if (typeof serialComponentOrComponents !== "object") {
            result = validateAndConcatenate(serialComponentOrComponents);
        } else {
            result = transformIterable(serialComponentOrComponents, validateAndConcatenate);
        }

        return result as TransformerOutput<T, string>;
    }

    /**
     * Create serialized identification key(s) with a reference based on a numeric value concatenated with serial
     * component(s). The value is converted to a reference of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @param value
     * Numeric value of the reference.
     *
     * @param serialComponentOrComponents
     * Serial component(s).
     *
     * @param sparse
     * If true, the value is mapped to a sparse sequence resistant to discovery. Default is false.
     *
     * @returns
     * Serialized identification keys.
     */
    createSerialized<T extends TransformerInput<string>>(value: number, serialComponentOrComponents: T, sparse?: boolean): TransformerOutput<T, string> {
        return this.concatenateValidated(this.create(value, sparse), serialComponentOrComponents);
    }

    /**
     * Concatenate a base identification key with serial component(s).
     *
     * @param baseIdentificationKey
     * Base identification key.
     *
     * @param serialComponentOrComponents
     * Serial component(s).
     *
     * @returns
     * Serialized identification key(s).
     */
    concatenate<T extends TransformerInput<string>>(baseIdentificationKey: string, serialComponentOrComponents: T): TransformerOutput<T, string> {
        this.validate(baseIdentificationKey);

        return this.concatenateValidated(baseIdentificationKey, serialComponentOrComponents);
    }
}

/**
 * Non-numeric identification key creator.
 */
export class NonNumericIdentificationKeyCreator extends Mixin(NonNumericIdentificationKeyValidator, AbstractIdentificationKeyCreator) {
    /**
     * Reference validation parameters.
     */
    private readonly _referenceValidation: CharacterSetValidation;

    /**
     * Constructor. Called internally by {@link PrefixManager} non-numeric identification key creator getters; should
     * not be called by other code.
     *
     * @param prefixManager
     * Prefix manager.
     *
     * @param identificationKeyType
     * Identification key type.
     *
     * @param length
     * Length.
     *
     * @param referenceCharacterSet
     * Reference character set.
     *
     * @param requiresCheckCharacterPair
     * True if the identification key requires a check character pair.
     */
    constructor(prefixManager: PrefixManager, identificationKeyType: IdentificationKeyType, length: number, referenceCharacterSet: ContentCharacterSet, requiresCheckCharacterPair = false) {
        super(identificationKeyType, length, referenceCharacterSet, requiresCheckCharacterPair);

        this.init(prefixManager, prefixManager.gs1CompanyPrefix, 2 * Number(requiresCheckCharacterPair));

        this._referenceValidation = {
            minimumLength: 1,
            // Maximum reference length has to account for prefix and check character pair.
            maximumLength: this.referenceLength,
            component: () => i18next.t("IdentificationKey.reference", {
                ns: gs1NS
            })
        };
    }

    /**
     * Get the reference validation parameters.
     */
    protected get referenceValidation(): CharacterSetValidation {
        return this._referenceValidation;
    }

    /**
     * Create identification key(s) with reference(s).
     *
     * @param referenceOrReferences
     * Reference(s).
     *
     * @returns
     * Identification key(s).
     */
    create<T extends TransformerInput<string>>(referenceOrReferences: T): TransformerOutput<T, string> {
        // TODO Refactor type when https://github.com/microsoft/TypeScript/pull/56941 released.
        let result: string | Iterable<string>;

        const referenceCreator = this.referenceCreator;
        const referenceValidation = this.referenceValidation;
        const prefix = this.prefix;
        const requiresCheckCharacterPair = this.requiresCheckCharacterPair;

        /**
         * Validate a reference and create an identification key.
         *
         * @param reference
         * Reference.
         *
         * @returns
         * Identification key.
         */
        function validateAndCreate(reference: string): string {
            referenceCreator.validate(reference, referenceValidation);

            const partialIdentificationKey = prefix + reference;

            return requiresCheckCharacterPair ? partialIdentificationKey + checkCharacterPair(partialIdentificationKey) : partialIdentificationKey;
        }

        if (typeof referenceOrReferences !== "object") {
            result = validateAndCreate(referenceOrReferences);
        } else {
            result = transformIterable(referenceOrReferences, validateAndCreate);
        }

        return result as TransformerOutput<T, string>;
    }
}

/**
 * Prefix validation parameters.
 */
interface PrefixValidation extends CharacterSetValidation {
    /**
     * Minimum length.
     */
    minimumLength: number;

    /**
     * Maximum length.
     */
    maximumLength: number;

    /**
     * Callback to localized prefix type name.
     */
    component: () => string;
}

/**
 * Prefix manager. This is the core class for identification key creation.
 *
 * A prefix manager may be created for any {@link PrefixType | prefix type}. As most applications work with a limited
 * number of prefixes for creating identification keys, prefix managers are cached in memory and may be reused.
 *
 * Prefix managers are keyed by GS1 Company Prefix, so the prefix type that is requested may not match the prefix type
 * of the returned prefix manager. For example, the prefix manager for GS1 Company Prefix 0614141 is identical to the
 * one for U.P.C. Company Prefix 614141, with the prefix type equal to {@link PrefixType.UPCCompanyPrefix} and the
 * prefix equal to "614141".
 *
 * To support the creation of sparse identification keys, a prefix manager maintains a {@link tweakFactor | tweak
 * factor} which is used, along with a type-specific multiplier, as the tweak when creating numeric identification keys.
 * The default tweak factor is the numeric value of the GS1 Company Prefix representation of the prefix preceded by '1'
 * to ensure uniqueness (i.e., so that prefixes 0 N1 N2 N3... and N1 N2 N3... produce different tweak factors). This is
 * usually sufficient for obfuscation, but as the sparse creation algorithm is reversible and as the GS1 Company Prefix
 * is discoverable via {@link https://www.gs1.org/services/verified-by-gs1 | Verified by GS1}, a user-defined tweak
 * factor should be used if a higher degree of obfuscation is required. When using a tweak factor other than the
 * default, care should be taken to restore it when resuming the application. A tweak factor of 0 creates a straight
 * sequence.
 */
export class PrefixManager {
    /**
     * Cached prefix managers, keyed by GS1 Company Prefix.
     */
    private static readonly PREFIX_MANAGERS_MAP = new Map<string, PrefixManager>();

    /**
     * GS1 Company Prefix minimum length.
     */
    static readonly GS1_COMPANY_PREFIX_MINIMUM_LENGTH = 4;

    /**
     * GS1 Company Prefix maximum length.
     */
    static readonly GS1_COMPANY_PREFIX_MAXIMUM_LENGTH = 12;

    /**
     * U.P.C. Company Prefix minimum length.
     */
    static readonly UPC_COMPANY_PREFIX_MINIMUM_LENGTH = 6;

    /**
     * U.P.C. Company Prefix maximum length.
     */
    static readonly UPC_COMPANY_PREFIX_MAXIMUM_LENGTH = 11;

    /**
     * GS1-8 Prefix minimum length.
     */
    static readonly GS1_8_PREFIX_MINIMUM_LENGTH = 2;

    /**
     * GS1-8 Prefix maximum length.
     */
    static readonly GS1_8_PREFIX_MAXIMUM_LENGTH = 7;

    /**
     * Validation parameters for GS1 Company Prefix.
     */
    private static readonly GS1_COMPANY_PREFIX_VALIDATION: PrefixValidation = {
        minimumLength: PrefixManager.GS1_COMPANY_PREFIX_MINIMUM_LENGTH,
        maximumLength: PrefixManager.GS1_COMPANY_PREFIX_MAXIMUM_LENGTH,
        component: () => i18next.t("Prefix.gs1CompanyPrefix", {
            ns: gs1NS
        })
    };

    /**
     * Validation parameters for U.P.C. Company Prefix expressed as GS1 Company Prefix.
     */
    private static readonly UPC_COMPANY_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION: PrefixValidation = {
        minimumLength: PrefixManager.UPC_COMPANY_PREFIX_MINIMUM_LENGTH + 1,
        maximumLength: PrefixManager.UPC_COMPANY_PREFIX_MAXIMUM_LENGTH + 1,
        component: () => i18next.t("Prefix.gs1CompanyPrefix", {
            ns: gs1NS
        })
    };

    /**
     * Validation parameters for GS1-8 Prefix expressed as GS1 Company Prefix.
     */
    private static readonly GS1_8_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION: PrefixValidation = {
        minimumLength: PrefixManager.GS1_8_PREFIX_MINIMUM_LENGTH + 5,
        maximumLength: PrefixManager.GS1_8_PREFIX_MAXIMUM_LENGTH + 5,
        component: () => i18next.t("Prefix.gs1CompanyPrefix", {
            ns: gs1NS
        })
    };

    /**
     * Validation parameters for U.P.C. Company Prefix.
     */
    private static readonly UPC_COMPANY_PREFIX_VALIDATION: PrefixValidation = {
        minimumLength: PrefixManager.UPC_COMPANY_PREFIX_MINIMUM_LENGTH,
        maximumLength: PrefixManager.UPC_COMPANY_PREFIX_MAXIMUM_LENGTH,
        component: () => i18next.t("Prefix.upcCompanyPrefix", {
            ns: gs1NS
        })
    };

    /**
     * Validation parameters for GS1-8 Prefix.
     */
    private static readonly GS1_8_PREFIX_VALIDATION: PrefixValidation = {
        minimumLength: PrefixManager.GS1_8_PREFIX_MINIMUM_LENGTH,
        maximumLength: PrefixManager.GS1_8_PREFIX_MAXIMUM_LENGTH,
        component: () => i18next.t("Prefix.gs18Prefix", {
            ns: gs1NS
        })
    };

    /**
     * Creator tweak factors. Different numeric identification key types have different tweak factors so that sparse
     * creation generates different sequences for each.
     */
    private static readonly CREATOR_TWEAK_FACTORS_MAP: ReadonlyMap<IdentificationKeyType, bigint> = new Map([
        [IdentificationKeyType.GTIN, 1987n],
        [IdentificationKeyType.GLN, 4241n],
        [IdentificationKeyType.SSCC, 8087n],
        [IdentificationKeyType.GRAI, 3221n],
        [IdentificationKeyType.GSRN, 2341n],
        [IdentificationKeyType.GDTI, 7333n],
        [IdentificationKeyType.GSIN, 5623n],
        [IdentificationKeyType.GCN, 6869n]
    ]);

    /**
     * Normalized prefix type.
     */
    private readonly _prefixType: PrefixType;

    /**
     * Normalized prefix.
     */
    private readonly _prefix: string;

    /**
     * Prefix as GS1 Company Prefix.
     */
    private readonly _gs1CompanyPrefix: string;

    /**
     * U.P.C. Company Prefix if prefix type is {@link PrefixType.UPCCompanyPrefix}.
     */
    private readonly _upcCompanyPrefix: string | undefined;

    /**
     * GS1-8 Prefix if prefix type is {@link PrefixType.GS18Prefix}.
     */
    private readonly _gs18Prefix: string | undefined;

    /**
     * Tweak factor.
     */
    private _tweakFactor = 0n;

    /**
     * Cached identification key creators.
     */
    private readonly _identificationKeyCreatorsMap = new Map<IdentificationKeyType, IdentificationKeyCreator>();

    /**
     * Constructor.
     *
     * @param gs1CompanyPrefix
     * GS1 Company Prefix.
     */
    private constructor(gs1CompanyPrefix: string) {
        this._gs1CompanyPrefix = gs1CompanyPrefix;

        // Determine the prefix type and populate the remaining fields.
        if (!gs1CompanyPrefix.startsWith("0")) {
            this._prefixType = PrefixType.GS1CompanyPrefix;
            this._prefix = this._gs1CompanyPrefix;
        } else if (!gs1CompanyPrefix.startsWith("00000")) {
            this._prefixType = PrefixType.UPCCompanyPrefix;
            this._upcCompanyPrefix = gs1CompanyPrefix.substring(1);
            this._prefix = this._upcCompanyPrefix;
        } else {
            this._prefixType = PrefixType.GS18Prefix;
            this._gs18Prefix = gs1CompanyPrefix.substring(5);
            this._prefix = this._gs18Prefix;
        }

        this.resetTweakFactor();
    }

    /**
     * Get the prefix type.
     */
    get prefixType(): PrefixType {
        return this._prefixType;
    }

    /**
     * Get the prefix.
     */
    get prefix(): string {
        return this._prefix;
    }

    /**
     * Get the GS1 Company Prefix.
     */
    get gs1CompanyPrefix(): string {
        return this._gs1CompanyPrefix;
    }

    /**
     * Get the U.P.C. Company Prefix if prefix type is {@link PrefixType.UPCCompanyPrefix} or undefined if not.
     */
    get upcCompanyPrefix(): string | undefined {
        return this._upcCompanyPrefix;
    }

    /**
     * Get the GS1-8 Prefix if prefix type is {@link PrefixType.GS18Prefix} or undefined if not.
     */
    get gs18Prefix(): string | undefined {
        return this._gs18Prefix;
    }

    /**
     * Set the tweak for an identification key creator if it's a numeric identification key creator.
     *
     * @param creator
     * Identification key creator.
     */
    private setCreatorTweak(creator: IdentificationKeyCreator): void {
        const creatorTweakFactor = PrefixManager.CREATOR_TWEAK_FACTORS_MAP.get(creator.identificationKeyType);

        // Creator tweak factor is defined for numeric identification keys only.
        if (creatorTweakFactor !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Explicit cast without testing is necessary as "instanceof" doesn't work for mixin types.
            (creator as AbstractNumericIdentificationKeyCreator).tweak = this.tweakFactor * creatorTweakFactor;
        }
    }

    /**
     * Get the tweak factor.
     */
    get tweakFactor(): bigint {
        return this._tweakFactor;
    }

    /**
     * Set the tweak factor.
     *
     * @param value
     * Tweak factor.
     */
    set tweakFactor(value: number | bigint) {
        const tweakFactor = BigInt(value);

        if (this._tweakFactor !== tweakFactor) {
            this._tweakFactor = tweakFactor;

            for (const creator of this._identificationKeyCreatorsMap.values()) {
                this.setCreatorTweak(creator);
            }
        }
    }

    /**
     * Reset the tweak factor to its default (numeric value of the GS1 Company Prefix preceded by '1').
     */
    resetTweakFactor(): void {
        // Default tweak factor is the numeric value of the GS1 Company Prefix preceded by '1'.
        this.tweakFactor = BigInt("1" + this.gs1CompanyPrefix);
    }

    /**
     * Get a prefix manager.
     *
     * @param prefixType
     * Prefix type.
     *
     * @param prefix
     * Prefix.
     *
     * @returns
     * Prefix manager with normalized prefix type and prefix.
     */
    static get(prefixType: PrefixType, prefix: string): PrefixManager {
        PrefixManager.validatePrefix(prefixType, true, true, prefix);

        let gs1CompanyPrefix: string;

        switch (prefixType) {
            case PrefixType.GS1CompanyPrefix:
                gs1CompanyPrefix = prefix;
                break;

            case PrefixType.UPCCompanyPrefix:
                gs1CompanyPrefix = "0" + prefix;
                break;

            case PrefixType.GS18Prefix:
                gs1CompanyPrefix = "00000" + prefix;
                break;
        }

        let prefixManager = PrefixManager.PREFIX_MANAGERS_MAP.get(gs1CompanyPrefix);

        if (prefixManager === undefined) {
            prefixManager = new PrefixManager(gs1CompanyPrefix);
            PrefixManager.PREFIX_MANAGERS_MAP.set(gs1CompanyPrefix, prefixManager);
        }

        return prefixManager;
    }

    /**
     * Validate a prefix.
     *
     * @param prefixType
     * Prefix type.
     *
     * @param allowUPCCompanyPrefix
     * If true, a U.P.C. Company Prefix expressed as a GS1 Company Prefix is permitted.
     *
     * @param allowGS18Prefix
     * If true, a GS1-8 Prefix expressed as a GS1 Company Prefix is permitted.
     *
     * @param prefix
     * Prefix.
     *
     * @param isFromIdentificationKey
     * If true, the prefix is from an identification key and should be trimmed before its character set is validated.
     *
     * @param isNumericIdentificationKey
     * If true, the prefix is from a numeric identification key and its character set will be validated by the caller.
     *
     * @param positionOffset
     * Position offset within a larger string.
     */
    static validatePrefix(prefixType: PrefixType, allowUPCCompanyPrefix: boolean, allowGS18Prefix: boolean, prefix: string, isFromIdentificationKey = false, isNumericIdentificationKey = false, positionOffset?: number): void {
        let baseValidation: PrefixValidation;

        // Validate the prefix type and determine the prefix validation parameters.
        switch (prefixType) {
            case PrefixType.GS1CompanyPrefix:
                if (!prefix.startsWith("0")) {
                    baseValidation = PrefixManager.GS1_COMPANY_PREFIX_VALIDATION;
                } else if (!prefix.startsWith("00000")) {
                    if (!allowUPCCompanyPrefix) {
                        throw new RangeError(i18next.t("Prefix.gs1CompanyPrefixCantStartWith0", {
                            ns: gs1NS
                        }));
                    }

                    baseValidation = PrefixManager.UPC_COMPANY_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION;
                } else if (!prefix.startsWith("000000")) {
                    if (!allowGS18Prefix) {
                        throw new RangeError(i18next.t("Prefix.gs1CompanyPrefixCantStartWith00000", {
                            ns: gs1NS
                        }));
                    }

                    baseValidation = PrefixManager.GS1_8_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION;
                } else {
                    throw new RangeError(i18next.t("Prefix.gs1CompanyPrefixCantStartWith000000", {
                        ns: gs1NS
                    }));
                }
                break;

            case PrefixType.UPCCompanyPrefix:
                if (prefix.startsWith("0000")) {
                    throw new RangeError(i18next.t("Prefix.upcCompanyPrefixCantStartWith0000", {
                        ns: gs1NS
                    }));
                }

                baseValidation = PrefixManager.UPC_COMPANY_PREFIX_VALIDATION;
                break;

            case PrefixType.GS18Prefix:
                if (prefix.startsWith("0")) {
                    throw new RangeError(i18next.t("Prefix.gs18PrefixCantStartWith0", {
                        ns: gs1NS
                    }));
                }

                baseValidation = PrefixManager.GS1_8_PREFIX_VALIDATION;
                break;
        }

        const mergedValidation: PrefixValidation = {
            ...baseValidation,
            positionOffset
        };

        // If from key and numeric, key validation will take care of character set validation.
        if (!isFromIdentificationKey) {
            NUMERIC_CREATOR.validate(prefix, mergedValidation);
        } else if (!isNumericIdentificationKey) {
            // Validate only the minimum length, allowing at least one character for the (possibly non-numeric) reference.
            NUMERIC_CREATOR.validate(prefix.substring(0, Math.min(mergedValidation.minimumLength, prefix.length - 1)), mergedValidation);
        }
    }

    /**
     * Get an identification key creator.
     *
     * @param identificationKeyType
     * Identification key type.
     *
     * @param constructorCallback
     * Constructor callback.
     *
     * @returns
     * Identification key creator.
     */
    private getIdentificationKeyCreator<T extends IdentificationKeyCreator>(identificationKeyType: IdentificationKeyType, constructorCallback: () => T): T {
        let creator = this._identificationKeyCreatorsMap.get(identificationKeyType) as (T | undefined);

        if (creator === undefined) {
            if (this.prefixType === PrefixType.GS18Prefix && identificationKeyType !== IdentificationKeyType.GTIN) {
                throw new RangeError(i18next.t("Prefix.identificationKeyTypeNotSupportedByGS18Prefix", {
                    ns: gs1NS,
                    identificationKeyType
                }));
            }

            creator = constructorCallback();

            this.setCreatorTweak(creator);

            this._identificationKeyCreatorsMap.set(identificationKeyType, creator);
        }

        return creator;
    }

    /**
     * Get non-GTIN numeric identification key creator.
     *
     * @param validator
     * Validator on which identification key creator is based.
     *
     * @returns
     * Identification key creator.
     */
    private getNonGTINNumericIdentificationKeyCreator(validator: NonGTINNumericIdentificationKeyValidator): NonGTINNumericIdentificationKeyCreator {
        return this.getIdentificationKeyCreator(validator.identificationKeyType, () => new NonGTINNumericIdentificationKeyCreator(this, validator.identificationKeyType, validator.length, validator.leaderType));
    }

    /**
     * Get serialized numeric identification key creator.
     *
     * @param validator
     * Validator on which identification key creator is based.
     *
     * @returns
     * Identification key creator.
     */
    private getSerializableNumericIdentificationKeyCreator(validator: SerializableNumericIdentificationKeyValidator): SerializableNumericIdentificationKeyCreator {
        return this.getIdentificationKeyCreator(validator.identificationKeyType, () => new SerializableNumericIdentificationKeyCreator(this, validator.identificationKeyType, validator.length, validator.serialComponentLength, validator.serialComponentCharacterSet));
    }

    /**
     * Get non-numeric identification key creator.
     *
     * @param validator
     * Validator on which identification key creator is based.
     *
     * @returns
     * Identification key creator.
     */
    private getNonNumericIdentificationKeyCreator(validator: NonNumericIdentificationKeyValidator): NonNumericIdentificationKeyCreator {
        return this.getIdentificationKeyCreator(validator.identificationKeyType, () => new NonNumericIdentificationKeyCreator(this, validator.identificationKeyType, validator.length, validator.referenceCharacterSet, validator.requiresCheckCharacterPair));
    }

    /**
     * Get GTIN creator.
     */
    get gtinCreator(): GTINCreator {
        return this.getIdentificationKeyCreator(IdentificationKeyType.GTIN, () => {
            let gtinType: GTINType;

            switch (this.prefixType) {
                case PrefixType.GS1CompanyPrefix:
                    gtinType = GTINType.GTIN13;
                    break;

                case PrefixType.UPCCompanyPrefix:
                    gtinType = GTINType.GTIN12;
                    break;

                case PrefixType.GS18Prefix:
                    gtinType = GTINType.GTIN8;
                    break;
            }

            return new GTINCreator(this, gtinType);
        });
    }

    /**
     * Get GLN creator.
     */
    get glnCreator(): NonGTINNumericIdentificationKeyCreator {
        return this.getNonGTINNumericIdentificationKeyCreator(GLN_VALIDATOR);
    }

    /**
     * Get SSCC creator.
     */
    get ssccCreator(): NonGTINNumericIdentificationKeyCreator {
        return this.getNonGTINNumericIdentificationKeyCreator(SSCC_VALIDATOR);
    }

    /**
     * Get GRAI creator.
     */
    get graiCreator(): SerializableNumericIdentificationKeyCreator {
        return this.getSerializableNumericIdentificationKeyCreator(GRAI_VALIDATOR);
    }

    /**
     * Get GIAI creator.
     */
    get giaiCreator(): NonNumericIdentificationKeyCreator {
        return this.getNonNumericIdentificationKeyCreator(GIAI_VALIDATOR);
    }

    /**
     * Get GSRN creator.
     */
    get gsrnCreator(): NonGTINNumericIdentificationKeyCreator {
        return this.getNonGTINNumericIdentificationKeyCreator(GSRN_VALIDATOR);
    }

    /**
     * Get GDTI creator.
     */
    get gdtiCreator(): SerializableNumericIdentificationKeyCreator {
        return this.getSerializableNumericIdentificationKeyCreator(GDTI_VALIDATOR);
    }

    /**
     * Get GINC creator.
     */
    get gincCreator(): NonNumericIdentificationKeyCreator {
        return this.getNonNumericIdentificationKeyCreator(GINC_VALIDATOR);
    }

    /**
     * Get GSIN creator.
     */
    get gsinCreator(): NonGTINNumericIdentificationKeyCreator {
        return this.getNonGTINNumericIdentificationKeyCreator(GSIN_VALIDATOR);
    }

    /**
     * Get GCN creator.
     */
    get gcnCreator(): SerializableNumericIdentificationKeyCreator {
        return this.getSerializableNumericIdentificationKeyCreator(GCN_VALIDATOR);
    }

    /**
     * Get CPID creator.
     */
    get cpidCreator(): NonNumericIdentificationKeyCreator {
        return this.getNonNumericIdentificationKeyCreator(CPID_VALIDATOR);
    }

    /**
     * Get GMN creator.
     */
    get gmnCreator(): NonNumericIdentificationKeyCreator {
        return this.getNonNumericIdentificationKeyCreator(GMN_VALIDATOR);
    }
}
