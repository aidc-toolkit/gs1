import { describe } from "vitest";
import { PrefixManager, PrefixTypes } from "../src/index.js";
import { testGTINCreator } from "./gtin-creator.js";
import { testNonSerializableNumericIdentifierCreator } from "./non-serializable-numeric-identifier-creator.js";
import { testNonNumericIdentifierCreator } from "./non-numeric-identifier-creator.js";
import { testSerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator.js";

describe("Creators", () => {
    testGTINCreator(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123456").gtinCreator);
    testGTINCreator(PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "61414112").gtinCreator);
    testGTINCreator(PrefixManager.get(PrefixTypes.GS18Prefix, "9521").gtinCreator);

    // Different lengths required to balance testing completeness and run time.
    const shortPrefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123456");
    const longPrefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123456789");

    testNonSerializableNumericIdentifierCreator(shortPrefixManager.glnCreator);
    testNonSerializableNumericIdentifierCreator(longPrefixManager.ssccCreator);
    testSerializableNumericIdentifierCreator(shortPrefixManager.graiCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.giaiCreator);
    testNonSerializableNumericIdentifierCreator(longPrefixManager.gsrnCreator);
    testSerializableNumericIdentifierCreator(shortPrefixManager.gdtiCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.gincCreator);
    testNonSerializableNumericIdentifierCreator(longPrefixManager.gsinCreator);
    testSerializableNumericIdentifierCreator(shortPrefixManager.gcnCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.cpidCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.gmnCreator);
});
