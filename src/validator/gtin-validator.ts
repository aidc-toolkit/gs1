import { type CharacterSetValidation, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { checkDigit, hasValidCheckDigit } from "../check.js";
import { GTIN12_DESCRIPTOR, GTIN13_DESCRIPTOR, GTIN8_DESCRIPTOR } from "../descriptor/index.js";
import { GTINLengths } from "../gtin-length.js";
import { type GS1ParseKeys, i18nextGS1T } from "../locale/i18n.js";
import { type PrefixType, PrefixTypes } from "../prefix-type.js";
import type { BaseGTINValidator } from "./base-gtin-validator.js";
import { ConcreteGTINValidator } from "./concrete-gtin-validator.js";
import { type GTINLevel, GTINLevels } from "./gtin-level.js";
import { PrefixValidator } from "./prefix-validator.js";

/**
 * GTIN-13 validator.
 */
export type GTIN13Validator = BaseGTINValidator<typeof PrefixTypes.GS1CompanyPrefix>;

/**
 * GTIN-13 validator.
 */
export const GTIN13_VALIDATOR: GTIN13Validator = new ConcreteGTINValidator(GTIN13_DESCRIPTOR);

/**
 * GTIN-12 validator.
 */
export type GTIN12Validator = BaseGTINValidator<typeof PrefixTypes.UPCCompanyPrefix>;

/**
 * GTIN-12 validator.
 */
export const GTIN12_VALIDATOR: GTIN12Validator = new ConcreteGTINValidator(GTIN12_DESCRIPTOR);

/**
 * GTIN-8 validator.
 */
export type GTIN8Validator = BaseGTINValidator<typeof PrefixTypes.GS18Prefix>;

/**
 * GTIN-8 validator.
 */
export const GTIN8_VALIDATOR: GTIN8Validator = new ConcreteGTINValidator(GTIN8_DESCRIPTOR);

/**
 * GTIN validator.
 */
export type GTINValidator = GTIN13Validator | GTIN12Validator | GTIN8Validator;

/**
 * GTIN validators indexed by prefix type.
 */
export const GTINValidators = {
    [PrefixTypes.GS1CompanyPrefix]: GTIN13_VALIDATOR,
    [PrefixTypes.UPCCompanyPrefix]: GTIN12_VALIDATOR,
    [PrefixTypes.GS18Prefix]: GTIN8_VALIDATOR
} as const;

/**
 * GTIN validator by prefix type.
 */
export type GTINPrefixTypeValidator<TPrefixType extends PrefixType> =
    typeof GTINValidators[TPrefixType];

const ZERO_SUPPRESSED_GTIN12_VALIDATION: Readonly<CharacterSetValidation> = {
    minimumLength: 8,
    maximumLength: 8
};

const OPTIONAL_INDICATOR_DIGIT_VALIDATION: Readonly<CharacterSetValidation> = {
    minimumLength: 0,
    maximumLength: 1,
    component: () => i18nextGS1T("Identifier.indicatorDigit")
};

const ERROR_MESSAGE_PARSE_KEYS: Readonly<Record<GTINLevel, GS1ParseKeys | undefined>> = {
    [GTINLevels.Any]: undefined,
    [GTINLevels.RetailConsumer]: "Identifier.invalidGTINAtRetail",
    [GTINLevels.OtherThanRetailConsumer]: "Identifier.invalidGTINAtOtherThanRetail"
};

/**
 * GTIN validator functions.
 */
export const GTINValidator = {
    /**
     * Zero suppress a GTIN-12.
     *
     * @param gtin12
     * GTIN-12.
     *
     * @returns
     * Zero-suppressed GTIN-12.
     */
    zeroSuppress: (gtin12: string) => {
        GTIN12_VALIDATOR.validate(gtin12);

        // Convert to individual digits.
        const d = Array.from(gtin12);

        let zeroSuppressedGTIN12;

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
            throw new RangeError(i18nextGS1T("Identifier.invalidZeroSuppressibleGTIN12"));
        }

        return zeroSuppressedGTIN12;
    },

    /**
     * Zero expand a zero-suppressed GTIN-12.
     *
     * @param zeroSuppressedGTIN12
     * Zero-suppressed GTIN-12.
     *
     * @returns
     * GTIN-12.
     */
    zeroExpand: (zeroSuppressedGTIN12: string) => {
        NUMERIC_CREATOR.validate(zeroSuppressedGTIN12, ZERO_SUPPRESSED_GTIN12_VALIDATION);

        // Convert to individual digits.
        const d = Array.from(zeroSuppressedGTIN12);

        let gtin12;

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
            throw new RangeError(i18nextGS1T("Identifier.invalidZeroSuppressedGTIN12"));
        }

        // Make sure that resulting GTIN-12 is valid.
        GTIN12_VALIDATOR.validate(gtin12);

        return gtin12;
    },

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
    convertToGTIN14: (indicatorDigit: string, gtin: string) => {
        NUMERIC_CREATOR.validate(indicatorDigit, OPTIONAL_INDICATOR_DIGIT_VALIDATION);

        // Check digit doesn't change by prepending zeros.
        let gtin14 = GTINValidator.normalize(gtin).padStart(GTINLengths.GTIN14, "0");

        // If indicator digit provided and is different, recalculate the check digit.
        if (indicatorDigit.length !== 0 && !gtin14.startsWith(indicatorDigit)) {
            const partialGTIN14 = `${indicatorDigit}${gtin14.substring(1, GTINLengths.GTIN14 - 1)}`;

            gtin14 = `${partialGTIN14}${checkDigit(partialGTIN14)}`;
        }

        return gtin14;
    },

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
    normalize: (gtin: string) => {
        const gtinLength = gtin.length;

        let normalizedGTIN: string;

        switch (gtinLength) {
            case GTINLengths.GTIN13:
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
                    throw new RangeError(i18nextGS1T("Identifier.invalidZeroSuppressedGTIN12AsGTIN13"));
                }
                break;

            case GTINLengths.GTIN12:
                // GTIN is GTIN-12.
                normalizedGTIN = gtin;
                break;

            case GTINLengths.GTIN8:
                if (!gtin.startsWith("0")) {
                    // GTIN is GTIN-8.
                    normalizedGTIN = gtin;
                } else {
                    // GTIN is zero-suppressed GTIN-12.
                    normalizedGTIN = GTINValidator.zeroExpand(gtin);
                }
                break;

            case GTINLengths.GTIN14:
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
                    throw new RangeError(i18nextGS1T("Identifier.invalidZeroSuppressedGTIN12AsGTIN14"));
                }
                break;

            default:
                throw new RangeError(i18nextGS1T("Identifier.invalidGTINLength"));
        }

        // Validation applies to the normalized GTIN.
        GTINValidator.validateAny(normalizedGTIN);

        return normalizedGTIN;
    },

    /**
     * Validate any GTIN, optionally against a level.
     *
     * @param gtin
     * GTIN.
     *
     * @param gtinLevel
     * Level at which GTIN is to be validated.
     */
    validateAny: (gtin: string, gtinLevel: GTINLevel = GTINLevels.Any) => {
        // Assume length-validated GTIN is the GTIN (true for all except zero-suppressed GTIN-12).
        let lengthValidatedGTIN = gtin;

        let prefixType: PrefixType | undefined;
        let allowUPCCompanyPrefix = false;
        let allowGS18Prefix = false;
        let validatePrefix = gtin;
        let gtinLevelRestriction: GTINLevel;

        switch (gtin.length) {
            case GTINLengths.GTIN13:
                // Validate prefix with restrictions on prefix type depending on GTIN level.
                prefixType = PrefixTypes.GS1CompanyPrefix;
                allowUPCCompanyPrefix = gtinLevel !== GTINLevels.RetailConsumer;
                allowGS18Prefix = gtinLevel === GTINLevels.Any;
                gtinLevelRestriction = GTINLevels.Any;
                break;

            case GTINLengths.GTIN12:
                // Validate prefix requiring exact match for prefix type.
                prefixType = PrefixTypes.UPCCompanyPrefix;
                gtinLevelRestriction = GTINLevels.Any;
                break;

            case GTINLengths.GTIN8:
                // Zero-suppressed GTIN-12 always starts with 0.
                if (!gtin.startsWith("0")) {
                    // Validate prefix requiring exact match for prefix type.
                    prefixType = PrefixTypes.GS18Prefix;
                } else {
                    lengthValidatedGTIN = GTINValidator.zeroExpand(gtin);
                    prefixType = undefined;
                }

                gtinLevelRestriction = GTINLevels.RetailConsumer;
                break;

            case GTINLengths.GTIN14:
                // Validate prefix with restrictions on prefix type depending on GTIN level.
                prefixType = PrefixTypes.GS1CompanyPrefix;
                allowUPCCompanyPrefix = true;
                allowGS18Prefix = gtinLevel !== GTINLevels.OtherThanRetailConsumer || !gtin.startsWith("0");
                validatePrefix = gtin.substring(1);
                gtinLevelRestriction = GTINLevels.OtherThanRetailConsumer;
                break;

            default:
                throw new RangeError(i18nextGS1T("Identifier.invalidGTINLength"));
        }

        if (prefixType !== undefined) {
            PrefixValidator.validate(prefixType, allowUPCCompanyPrefix, allowGS18Prefix, validatePrefix, true, true, ERROR_MESSAGE_PARSE_KEYS[gtinLevel]);
        }

        // Validating the check digit will also validate the characters.
        if (!hasValidCheckDigit(lengthValidatedGTIN)) {
            throw new RangeError(i18nextGS1T("Identifier.invalidCheckDigit"));
        }

        // Validate against level if required.
        if (gtinLevel !== GTINLevels.Any && gtinLevelRestriction !== GTINLevels.Any && gtinLevelRestriction !== gtinLevel) {
            throw new RangeError(i18nextGS1T(gtinLevel === GTINLevels.RetailConsumer ? "Identifier.invalidGTINAtRetail" : "Identifier.invalidGTINAtOtherThanRetail"));
        }
    },

    /**
     * Validate a GTIN-14.
     *
     * @param gtin14
     * GTIN-14.
     */
    validateGTIN14: (gtin14: string) => {
        if (gtin14.length !== GTINLengths.GTIN14) {
            throw new RangeError(i18nextGS1T("Identifier.invalidGTIN14Length"));
        }

        GTINValidator.validateAny(gtin14);
    }
} as const;
