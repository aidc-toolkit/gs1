import type { UtilityLocaleResources } from "@aidc-toolkit/utility";
import type { GS1LocaleResources } from "./i18n";

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
            aidct_utility: UtilityLocaleResources;
            aidct_gs1: GS1LocaleResources;
        };
    }
}
