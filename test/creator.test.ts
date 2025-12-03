import { describe } from "vitest";
import { PrefixManager, PrefixTypes } from "../src";
import { testGTINCreator } from "./gtin-creator";
import { testNonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator";
import { testNonNumericIdentifierCreator } from "./non-numeric-identifier-creator";
import { testSerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator";

describe("Creators", () => {
    testGTINCreator(PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123456").gtinCreator);
    testGTINCreator(PrefixManager.get(PrefixTypes.UPCCompanyPrefix, "61414112").gtinCreator);
    testGTINCreator(PrefixManager.get(PrefixTypes.GS18Prefix, "9521").gtinCreator);

    // Different lengths required to balance testing completeness and run time.
    const shortPrefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123456");
    const longPrefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "952123456789");

    testNonGTINNumericIdentifierCreator(shortPrefixManager.glnCreator);
    testNonGTINNumericIdentifierCreator(longPrefixManager.ssccCreator);
    testSerializableNumericIdentifierCreator(shortPrefixManager.graiCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.giaiCreator);
    testNonGTINNumericIdentifierCreator(longPrefixManager.gsrnCreator);
    testSerializableNumericIdentifierCreator(shortPrefixManager.gdtiCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.gincCreator);
    testNonGTINNumericIdentifierCreator(longPrefixManager.gsinCreator);
    testSerializableNumericIdentifierCreator(shortPrefixManager.gcnCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.cpidCreator);
    testNonNumericIdentifierCreator(shortPrefixManager.gmnCreator);
});
