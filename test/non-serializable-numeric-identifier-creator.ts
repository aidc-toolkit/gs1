import { expect, test } from "vitest";
import {
    isNonSerializableNumericIdentifierCreator,
    type NonSerializableNumericIdentifierCreator
} from "../src/index.js";
import { testNonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";

export function testNonSerializableNumericIdentifierCreator(creator: NonSerializableNumericIdentifierCreator): void {
    testNonGTINNumericIdentifierCreator(creator, () => {
        test("Mapping", () => {
            expect(isNonSerializableNumericIdentifierCreator(creator)).toBe(true);
        });
    });
}
