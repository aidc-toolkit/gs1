import type { UtilityLocaleStrings } from "@aidc-toolkit/utility";
import type { GS1LocaleStrings } from "./i18n.js";

/**
 * Internationalization module.
 */
declare module "i18next" {
    /**
     * Custom type options for this package.
     */
    interface CustomTypeOptions {
        defaultNS: "aidct_gs1";
        resources: {
            aidct_utility: UtilityLocaleStrings;
            aidct_gs1: GS1LocaleStrings;
        };
    }
}
