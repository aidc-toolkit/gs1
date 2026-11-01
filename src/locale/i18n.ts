import { i18nCoreInit, i18nInit } from "@aidc-toolkit/core";
import { i18nUtilityInit } from "@aidc-toolkit/utility";
import type { i18n, ParseKeys, Resource, TFunction } from "i18next";
import enLocaleResources from "./en/locale-resources.js";
import frLocaleResources from "./fr/locale-resources.js";

/**
 * GS1 namespace.
 */
export const gs1NS = "aidct_gs1";

/**
 * Locale resources type is extracted from the English locale resources object.
 */
export type GS1LocaleResources = typeof enLocaleResources;

/**
 * Core locale resources augmentation.
 */
declare module "@aidc-toolkit/core" {
    /**
     * Internationalization locale resources.
     */
    export interface I18nLocaleResources {
        /**
         * GS1 locale resources.
         */
        [gs1NS]: GS1LocaleResources;
    }
}

/**
 * GS1 parse keys.
 */
export type GS1ParseKeys = ParseKeys<typeof gs1NS>;

/**
 * GS1 resource bundle.
 */
export const gs1ResourceBundle: Resource = {
    en: {
        [gs1NS]: enLocaleResources
    },
    fr: {
        [gs1NS]: frLocaleResources
    }
};

/**
 * GS1 i18next translator function.
 */
export let i18nextGS1T: TFunction<typeof gs1NS>;

/**
 * Initialize internationalization.
 *
 * @param i18next
 * Internationalization instance.
 *
 * @param debug
 * Debug setting.
 *
 * @returns
 * GS1 resource bundle.
 */
export async function i18nGS1Init(i18next: i18n, debug = false): Promise<Resource> {
    // Bind translator function to i18next.
    i18nextGS1T = i18next.getFixedT(null, gs1NS);

    return i18nInit(i18next, debug, gs1ResourceBundle, i18nCoreInit, i18nUtilityInit);
}
