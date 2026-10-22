import { i18nCoreInit, i18nextInstance, i18nInit, type I18nLanguageDetector } from "@aidc-toolkit/core";
import { i18nUtilityInit } from "@aidc-toolkit/utility";
import type { ParseKeys, Resource } from "i18next";
import enLocaleResources from "./en/locale-resources.js";
import frLocaleResources from "./fr/locale-resources.js";

/**
 * GS1 namespace.
 */
export const gs1NS = "aidct_gs1";

/**
 * GS1 parse keys.
 */
export type GS1ParseKeys = ParseKeys<typeof gs1NS>;

/**
 * Locale resources type is extracted from the English locale strings object.
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

/**
 * GS1 i18next translator function.
 */
export const i18nextGS1T = i18nextInstance.getFixedT(null, gs1NS);

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
    return i18nInit(languageDetector, debug, gs1ResourceBundle, i18nCoreInit, i18nUtilityInit);
}
