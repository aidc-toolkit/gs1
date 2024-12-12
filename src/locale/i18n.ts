import { i18nAssertValidResources, i18nCoreInit, type I18NEnvironment } from "@aidc-toolkit/core";
import { i18nUtilityInit, utilityResources } from "@aidc-toolkit/utility";
import i18next, { type i18n } from "i18next";
import { localeStrings as enLocaleStrings } from "./en/locale-strings.js";
import { localeStrings as frLocaleStrings } from "./fr/locale-strings.js";

export const gs1NS = "aidct_gs1";

/**
 * Locale strings type is extracted from the English locale strings object.
 */
export type GS1LocaleStrings = typeof enLocaleStrings;

i18nAssertValidResources(enLocaleStrings, "fr", frLocaleStrings);

/**
 * GS1 resources.
 */
export const gs1Resources = {
    en: {
        aidct_gs1: enLocaleStrings
    },
    fr: {
        aidct_gs1: frLocaleStrings
    }
};

// Explicit type is necessary to work around bug in type discovery with linked packages.
export const i18nextGS1: i18n = i18next.createInstance();

/**
 * Initialize internationalization.
 *
 * @param environment
 * Environment in which the application is running.
 *
 * @param debug
 * Debug setting.
 *
 * @returns
 * Void promise.
 */
export async function i18nGS1Init(environment: I18NEnvironment, debug = false): Promise<void> {
    await i18nUtilityInit(environment, debug);
    await i18nCoreInit(i18nextGS1, environment, debug, gs1NS, utilityResources, gs1Resources);
}
