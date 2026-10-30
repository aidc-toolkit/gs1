import { DEFAULT_LANGUAGE, i18nextInstance, I18nLanguageDetectors } from "@aidc-toolkit/core";
import { i18nGS1Init } from "../src/index.js";

await i18nGS1Init(I18nLanguageDetectors.CLI).then(async () => i18nextInstance.changeLanguage(DEFAULT_LANGUAGE));
