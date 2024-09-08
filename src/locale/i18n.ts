import { i18nAddResourceBundle, i18next } from "@aidc-toolkit/core";
import { localeStrings as enLocaleStrings } from "./en/locale_strings.js";

export const gs1NS = "aidct_gs1";

i18nAddResourceBundle("en", gs1NS, enLocaleStrings);

export default i18next;
