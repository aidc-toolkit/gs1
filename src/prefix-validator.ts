import { type CharacterSetValidation, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { i18nextGS1 } from "./locale/i18n.js";
import type { PrefixProvider } from "./prefix-provider.js";
import { type PrefixType, PrefixTypes } from "./prefix-type.js";
import type { ParseKeys } from "i18next";

/**
 * Prefix validation parameters.
 */
export interface PrefixValidation extends CharacterSetValidation {
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
 * GS1 Company Prefix minimum length.
 */
const GS1_COMPANY_PREFIX_MINIMUM_LENGTH = 4;

/**
 * GS1 Company Prefix maximum length.
 */
const GS1_COMPANY_PREFIX_MAXIMUM_LENGTH = 12;

/**
 * U.P.C. Company Prefix minimum length.
 */
const UPC_COMPANY_PREFIX_MINIMUM_LENGTH = 5;

/**
 * U.P.C. Company Prefix maximum length.
 */
const UPC_COMPANY_PREFIX_MAXIMUM_LENGTH = 11;

/**
 * GS1-8 Prefix minimum length.
 */
const GS1_8_PREFIX_MINIMUM_LENGTH = 2;

/**
 * GS1-8 Prefix maximum length.
 */
const GS1_8_PREFIX_MAXIMUM_LENGTH = 7;

/**
 * Validation parameters for GS1 Company Prefix.
 */
const GS1_COMPANY_PREFIX_VALIDATION: Readonly<PrefixValidation> = {
    minimumLength: GS1_COMPANY_PREFIX_MINIMUM_LENGTH,
    maximumLength: GS1_COMPANY_PREFIX_MAXIMUM_LENGTH,
    component: () => i18nextGS1.t("Prefix.gs1CompanyPrefix")
};

/**
 * Validation parameters for U.P.C. Company Prefix expressed as GS1 Company Prefix.
 */
const UPC_COMPANY_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION: Readonly<PrefixValidation> = {
    minimumLength: UPC_COMPANY_PREFIX_MINIMUM_LENGTH + 1,
    maximumLength: UPC_COMPANY_PREFIX_MAXIMUM_LENGTH + 1,
    component: () => i18nextGS1.t("Prefix.gs1CompanyPrefix")
};

/**
 * Validation parameters for GS1-8 Prefix expressed as GS1 Company Prefix.
 */
const GS1_8_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION: Readonly<PrefixValidation> = {
    minimumLength: GS1_8_PREFIX_MINIMUM_LENGTH + 5,
    maximumLength: GS1_8_PREFIX_MAXIMUM_LENGTH + 5,
    component: () => i18nextGS1.t("Prefix.gs1CompanyPrefix")
};

/**
 * Validation parameters for U.P.C. Company Prefix.
 */
const UPC_COMPANY_PREFIX_VALIDATION: Readonly<PrefixValidation> = {
    minimumLength: UPC_COMPANY_PREFIX_MINIMUM_LENGTH,
    maximumLength: UPC_COMPANY_PREFIX_MAXIMUM_LENGTH,
    component: () => i18nextGS1.t("Prefix.upcCompanyPrefix")
};

/**
 * Validation parameters for GS1-8 Prefix.
 */
const GS1_8_PREFIX_VALIDATION: Readonly<PrefixValidation> = {
    minimumLength: GS1_8_PREFIX_MINIMUM_LENGTH,
    maximumLength: GS1_8_PREFIX_MAXIMUM_LENGTH,
    component: () => i18nextGS1.t("Prefix.gs18Prefix")
};

/**
 * Prefix validator.
 */
export const PrefixValidator = {
    GS1_COMPANY_PREFIX_MINIMUM_LENGTH,
    GS1_COMPANY_PREFIX_MAXIMUM_LENGTH,
    UPC_COMPANY_PREFIX_MINIMUM_LENGTH,
    UPC_COMPANY_PREFIX_MAXIMUM_LENGTH,
    GS1_8_PREFIX_MINIMUM_LENGTH,
    GS1_8_PREFIX_MAXIMUM_LENGTH,

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
     * @param isFromIdentifier
     * If true, the prefix is from an identifier and should be trimmed before its character set is validated.
     *
     * @param isNumericIdentifier
     * If true, the prefix is from a numeric identifier and its character set will be validated by the caller.
     *
     * @param errorMessageParseKey
     * Parse key for error message when validating GS1 Company Prefix type.
     */
    validate(prefixType: PrefixType, allowUPCCompanyPrefix: boolean, allowGS18Prefix: boolean, prefix: string, isFromIdentifier = false, isNumericIdentifier = false, errorMessageParseKey?: ParseKeys): void {
        let validation: PrefixValidation;

        // Validate the prefix type and determine the prefix validation parameters.
        switch (prefixType) {
            case PrefixTypes.GS1CompanyPrefix:
                if (!prefix.startsWith("0")) {
                    validation = GS1_COMPANY_PREFIX_VALIDATION;
                } else if (!prefix.startsWith("00000")) {
                    if (!allowUPCCompanyPrefix) {
                        throw new RangeError(i18nextGS1.t(errorMessageParseKey ?? "Prefix.gs1CompanyPrefixCantStartWith0"));
                    }

                    validation = UPC_COMPANY_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION;
                } else if (!prefix.startsWith("000000")) {
                    if (!allowGS18Prefix) {
                        throw new RangeError(i18nextGS1.t(errorMessageParseKey ?? "Prefix.gs1CompanyPrefixCantStartWith00000"));
                    }

                    validation = GS1_8_PREFIX_AS_GS1_COMPANY_PREFIX_VALIDATION;
                } else {
                    throw new RangeError(i18nextGS1.t(errorMessageParseKey ?? "Prefix.gs1CompanyPrefixCantStartWith000000"));
                }
                break;

            case PrefixTypes.UPCCompanyPrefix:
                if (prefix.startsWith("0000")) {
                    throw new RangeError(i18nextGS1.t("Prefix.upcCompanyPrefixCantStartWith0000"));
                }

                validation = UPC_COMPANY_PREFIX_VALIDATION;
                break;

            case PrefixTypes.GS18Prefix:
                if (prefix.startsWith("0")) {
                    throw new RangeError(i18nextGS1.t("Prefix.gs18PrefixCantStartWith0"));
                }

                validation = GS1_8_PREFIX_VALIDATION;
                break;
        }

        // If from identifier and numeric, identifier validation will take care of character set validation.
        if (!isFromIdentifier) {
            NUMERIC_CREATOR.validate(prefix, validation);
        } else if (!isNumericIdentifier) {
            // Validate only the minimum length, allowing at least one character for the (possibly non-numeric) reference.
            NUMERIC_CREATOR.validate(prefix.substring(0, Math.min(validation.minimumLength, prefix.length - 1)), validation);
        }
    },

    /**
     * Normalize a prefix.
     *
     * @param prefixType
     * Prefix type.
     *
     * @param prefix
     * Prefix.
     *
     * @returns
     * Prefix provider with normalized prefix type and prefix.
     */
    normalize(prefixType: PrefixType, prefix: string): PrefixProvider {
        // Validate first.
        this.validate(prefixType, true, true, prefix);

        let gs1CompanyPrefix: string;

        // First step is to map the prefix to a GS1 Company Prefix.
        switch (prefixType) {
            case PrefixTypes.GS1CompanyPrefix:
                gs1CompanyPrefix = prefix;
                break;

            case PrefixTypes.UPCCompanyPrefix:
                gs1CompanyPrefix = "0" + prefix;
                break;

            case PrefixTypes.GS18Prefix:
                gs1CompanyPrefix = "00000" + prefix;
                break;
        }

        let normalizedPrefixType: PrefixType;
        let normalizedPrefix: string;

        let upcCompanyPrefix: string | undefined = undefined;
        let gs18Prefix: string | undefined = undefined;

        // Determine the prefix type and populate the remaining fields.
        if (!gs1CompanyPrefix.startsWith("0")) {
            normalizedPrefixType = PrefixTypes.GS1CompanyPrefix;
            normalizedPrefix = gs1CompanyPrefix;
        } else if (!gs1CompanyPrefix.startsWith("00000")) {
            normalizedPrefixType = PrefixTypes.UPCCompanyPrefix;
            upcCompanyPrefix = gs1CompanyPrefix.substring(1);
            normalizedPrefix = upcCompanyPrefix;
        } else {
            normalizedPrefixType = PrefixTypes.GS18Prefix;
            gs18Prefix = gs1CompanyPrefix.substring(5);
            normalizedPrefix = gs18Prefix;
        }

        return {
            prefixType: normalizedPrefixType,
            prefix: normalizedPrefix,
            gs1CompanyPrefix,
            upcCompanyPrefix,
            gs18Prefix
        };
    }
} as const;
