import { expect, test } from "vitest";
import { isNonGTINNumericIdentifierCreator, type NonGTINNumericIdentifierCreator } from "../src/index.js";
import { testIdentifierCreatorCallback } from "./identifier-creator.js";
import { testNumericIdentifierCreator } from "./numeric-identifier-creator.js";

export function testNonGTINNumericIdentifierCreator(creator: NonGTINNumericIdentifierCreator, preTestCallback?: () => void, postTestCallback?: () => void): void {
    testNumericIdentifierCreator(creator, () => {
        testIdentifierCreatorCallback(preTestCallback);

        test("Mapping", () => {
            expect(isNonGTINNumericIdentifierCreator(creator)).toBe(true);
        });
    }, postTestCallback);
}
