import { i18nCoreInit, type I18nEnvironment } from "@aidc-toolkit/core";
import { i18nUtilityInit, utilityResources } from "@aidc-toolkit/utility";
import i18next, { type i18n, type Resource } from "i18next";
import enLocaleResources from "./en/locale-resources.js";
import frLocaleResources from "./fr/locale-resources.js";

export const gs1NS = "aidct_gs1";

/**
 * Locale strings type is extracted from the English locale strings object.
 */
export type GS1LocaleResources = typeof enLocaleResources;

/**
 * GS1 resources.
 */
export const gs1Resources: Resource = {
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
 * @param environment
 * Environment in which the application is running.
 *
 * @param debug
 * Debug setting.
 *
 * @returns
 * Void promise.
 */
export async function i18nGS1Init(environment: I18nEnvironment, debug = false): Promise<void> {
    await i18nUtilityInit(environment, debug);
    await i18nCoreInit(i18nextGS1, environment, debug, gs1NS, utilityResources, gs1Resources);
}
