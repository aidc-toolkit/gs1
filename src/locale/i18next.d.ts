import type { CoreLocaleResources } from "@aidc-toolkit/core";
import type { UtilityLocaleResources } from "@aidc-toolkit/utility";
import type { GS1LocaleResources } from "./i18n.js";

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
            aidct_core: CoreLocaleResources;
            aidct_utility: UtilityLocaleResources;
            aidct_gs1: GS1LocaleResources;
        };
    }
}
