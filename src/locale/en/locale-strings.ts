export const localeStrings = {
    Check: {
        lengthOfStringForPriceOrWeightMustBeExactly: "Length {{length, number}} of string for price or weight must be 4 or 5",
        priceOrWeightComponent: "price or weight",
        lengthOfStringForCheckCharacterPairMustBeLessThanOrEqualTo: "Length {{length, number}} of string for check character pair must be less than or equal to {{maximumLength, number}}"
    },
    IdentificationKey: {
        identificationKeyTypeLength: "{{identificationKeyType}} must be {{length, number}} digits long",
        invalidCheckDigit: "Invalid check digit",
        invalidGTINLength: "GTIN must be 13, 12, 8, or 14 digits long",
        invalidGTIN14Length: "GTIN must be 14 digits long",
        invalidZeroSuppressedGTIN12: "Invalid zero-suppressed GTIN-12",
        invalidZeroSuppressibleGTIN12: "GTIN-12 not zero-suppressible",
        invalidZeroSuppressedGTIN12AsGTIN13: "Invalid zero-suppressed GTIN-12 as GTIN-13",
        invalidZeroSuppressedGTIN12AsGTIN14: "Invalid zero-suppressed GTIN-12 as GTIN-14",
        invalidGTIN13AtRetail: "GTIN-13 at retail consumer trade item level can't start with zero",
        invalidGTINAtRetail: "GTIN not supported at retail consumer trade item level",
        invalidGTINAtOtherThanRetail: "GTIN not supported at other than retail consumer trade item level",
        indicatorDigit: "indicator digit",
        serialComponent: "serial component",
        reference: "reference",
        referenceCantBeAllNumeric: "Reference can't be all-numeric",
        invalidCheckCharacterPair: "Invalid check character pair"
    },
    Prefix: {
        gs1CompanyPrefix: "GS1 Company Prefix",
        upcCompanyPrefix: "U.P.C. Company Prefix",
        gs18Prefix: "GS1-8 Prefix",
        invalidPrefixType: "Invalid prefix type",
        gs1CompanyPrefixCantStartWith0: "GS1 Company Prefix can't start with \"0\"",
        gs1CompanyPrefixCantStartWith00000: "GS1 Company Prefix can't start with \"00000\"",
        gs1CompanyPrefixCantStartWith000000: "GS1 Company Prefix can't start with \"000000\"",
        upcCompanyPrefixCantStartWith0000: "U.P.C. Company Prefix can't start with \"0000\"",
        gs18PrefixCantStartWith0: "GS1-8 Prefix can't start with \"0\"",
        identificationKeyTypeNotSupportedByGS18Prefix: "{{identificationKeyType}} not supported by GS1-8 Prefix"
    }
} as const;
