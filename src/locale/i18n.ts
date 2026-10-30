import { i18nCoreInit, i18nInit, type I18nLanguageDetector } from "@aidc-toolkit/core";
import { i18nUtilityInit } from "@aidc-toolkit/utility";
import i18next, { type i18n, type Resource } from "i18next";
import enLocaleResources from "./en/locale-resources.js";
import frLocaleResources from "./fr/locale-resources.js";

export const gs1NS = "aidct_gs1";

/**
 * Locale strings type is extracted from the English locale strings object.
 */
export type GS1LocaleResources = typeof enLocaleResources;

/**
 * GS1 resource bundle.
 */
export const gs1ResourceBundle: Resource = {
    en: {
        aidct_gs1: enLocaleResources
    },
    fr: {
        aidct_gs1: frLocaleResources
    }
};

// Explicit type is necessary because type can't be inferred without additional references.
export const i18nextGS1: i18n = i18next.createInstance();

/**
 * Initialize internationalization.
 *
 * @param languageDetector
 * Language detector.
 *
 * @param debug
 * Debug setting.
 *
 * @returns
 * GS1 resource bundle.
 */
export async function i18nGS1Init(languageDetector: I18nLanguageDetector, debug = false): Promise<Resource> {
    return i18nInit(i18nextGS1, languageDetector, debug, gs1NS, gs1ResourceBundle, i18nCoreInit, i18nUtilityInit);
}
