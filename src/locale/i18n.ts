import { i18nAddResourceBundle, i18nAssertValidResources, i18next } from "@aidc-toolkit/core";
import { localeStrings as enLocaleStrings } from "./en/locale_strings.js";
import { localeStrings as frLocaleStrings } from "./fr/locale_strings.js";

export const gs1NS = "aidct_gs1";

i18nAssertValidResources(enLocaleStrings, "fr", frLocaleStrings);

i18nAddResourceBundle("en", gs1NS, enLocaleStrings);
i18nAddResourceBundle("fr", gs1NS, frLocaleStrings);

export default i18next;
