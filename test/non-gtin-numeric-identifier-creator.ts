import { expect, test } from "vitest";
import { isNonGTINNumericIdentifierCreator, type NonGTINNumericIdentifierCreator } from "../src";
import { testIdentifierCreatorCallback } from "./identifier-creator";
import { testNumericIdentifierCreator } from "./numeric-identifier-creator";

export function testNonGTINNumericIdentifierCreator(creator: NonGTINNumericIdentifierCreator, preTestCallback?: () => void, postTestCallback?: () => void): void {
    testNumericIdentifierCreator(creator, () => {
        testIdentifierCreatorCallback(preTestCallback);

        test("Mapping", () => {
            expect(isNonGTINNumericIdentifierCreator(creator)).toBe(true);
        });
    }, postTestCallback);
}
