export const localeStrings = {
    Check: {
        lengthOfStringForCheckCharacterPairMustBeLessThanOrEqualTo: "La longueur {{length}} de la chaîne pour la paire de caractères de vérification doit être inférieure ou égale à {{maximum Length}}"
    },
    IdentificationKey: {
        identificationKeyTypeLength: "{{identificationKeyType}} doit comporter {{length}} chiffres",
        invalidCheckDigit: "Chiffre de contrôle non valide",
        invalidGTINLength: "Le GTIN doit comporter 13, 12, 8 ou 14 chiffres",
        invalidGTIN14Length: "Le GTIN doit comporter 14 chiffres",
        invalidZeroSuppressedGTIN12: "Code GTIN-12 non valide avec zéro supprimé",
        invalidZeroSuppressibleGTIN12: "Le GTIN-12 ne peut pas être supprimé par zéro",
        invalidZeroSuppressedGTIN12AsGTIN13: "GTIN-12 non valide avec zéro supprimé en tant que GTIN-13",
        invalidZeroSuppressedGTIN12AsGTIN14: "GTIN-12 non valide avec zéro supprimé en tant que GTIN-14",
        invalidGTIN13AtRetail: "Le GTIN-13 au niveau des articles de consommation au détail ne peut pas commencer par zéro",
        invalidGTINAtRetail: "Le GTIN n'est pas pris en charge au niveau des articles de consommation au détail",
        invalidGTINAtOtherThanRetail: "Le GTIN n'est pas pris en charge à d'autres niveaux que ceux des articles de consommation au détail",
        indicatorDigit: "chiffre indicateur",
        serialComponent: "composant série",
        reference: "référence",
        referenceCantBeAllNumeric: "La référence ne peut pas être entièrement numérique",
        invalidCheckCharacterPair: "Paire de caractères de contrôle non valide"
    },
    Prefix: {
        gs1CompanyPrefix: "Préfixe de l'entreprise GS1",
        upcCompanyPrefix: "Préfixe de l'entreprise U.P.C.",
        gs18Prefix: "Préfixe GS1-8",
        gs1CompanyPrefixCantStartWith0: "Le préfixe de l'entreprise GS1 ne peut pas commencer par \"0\"",
        gs1CompanyPrefixCantStartWith00000: "Le préfixe de l'entreprise GS1 ne peut pas commencer par \"00000\"",
        gs1CompanyPrefixCantStartWith000000: "Le préfixe de l'entreprise GS1 ne peut pas commencer par \"000000\"",
        upcCompanyPrefixCantStartWith0000: "Le préfixe de l'entreprise U.P.C. ne peut pas commencer par \"0000\"",
        gs18PrefixCantStartWith0: "Le préfixe GS1-8 ne peut pas commencer par \"0\"",
        identificationKeyTypeNotSupportedByGS18Prefix: "{{identificationKeyType}} non pris en charge par le préfixe GS1-8"
    }
} as const;
