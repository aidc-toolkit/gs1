import { Exclusions, Sequence } from "@aidc-toolkit/utility";
import { describe, expect, test } from "vitest";
import {
    hasValidCheckCharacterPair,
    type NonGTINNumericIdentifierCreator,
    type NonNumericIdentifierCreator
} from "../src";
import { testNumericIdentifierCreator } from "./numeric-identifier-creator";

export function testNonGTINNumericIdentifierCreator(creator: NonGTINNumericIdentifierCreator, preTestCallback?: () => void, postTestCallback?: () => void): void {
    testNumericIdentifierCreator(creator, preTestCallback, postTestCallback);
}

const TEST_REFERENCE_LENGTH = 2;

export function testNonNumericIdentifierCreator(creator: NonNumericIdentifierCreator): void {
    describe(creator.identifierType, () => {
        const prefix = creator.prefix;
        const prefixLength = prefix.length;
        const referenceLength = creator.length - prefixLength - 2 * Number(creator.requiresCheckCharacterPair);
        const referenceCount = creator.referenceCreator.characterSetSize ** TEST_REFERENCE_LENGTH;
        const referenceSubstringStart = prefixLength;
        const referenceSubstringEnd = prefixLength + TEST_REFERENCE_LENGTH;

        test("Straight", () => {
            expect(creator.referenceLength).toBe(referenceLength);

            let index = 0;

            for (const identifier of creator.create(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, new Sequence(0, referenceCount)))) {
                expect(() => {
                    creator.validate(identifier);
                }).not.toThrow(RangeError);

                expect(Number(creator.referenceCreator.valueFor(identifier.substring(referenceSubstringStart, referenceSubstringEnd)))).toBe(index);

                expect(identifier.length).toBeLessThanOrEqual(creator.length);
                expect(identifier.substring(0, prefixLength)).toBe(prefix);
                expect(!creator.requiresCheckCharacterPair || hasValidCheckCharacterPair(identifier)).toBe(true);

                expect(identifier).toBe(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, index, Exclusions.None, undefined, reference => creator.create(reference)));

                index++;
            }

            expect(index).toBe(referenceCount);
        });

        test("Sparse", () => {
            let sequential = true;

            let index = 0;

            for (const identifier of creator.create(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, new Sequence(0, referenceCount), Exclusions.None, 123456n))) {
                expect(() => {
                    creator.validate(identifier);
                }).not.toThrow(RangeError);

                expect(Number(creator.referenceCreator.valueFor(identifier.substring(referenceSubstringStart, referenceSubstringEnd), Exclusions.None, 123456n))).toBe(index);

                sequential &&= Number(creator.referenceCreator.valueFor(identifier.substring(referenceSubstringStart, referenceSubstringEnd))) === index;

                expect(identifier.length).toBeLessThanOrEqual(creator.length);
                expect(identifier.substring(0, prefixLength)).toBe(prefix);
                expect(!creator.requiresCheckCharacterPair || hasValidCheckCharacterPair(identifier)).toBe(true);

                expect(identifier).toBe(creator.referenceCreator.create(TEST_REFERENCE_LENGTH, index, Exclusions.None, 123456n, reference => creator.create(reference)));

                index++;
            }

            expect(sequential).toBe(false);
            expect(index).toBe(referenceCount);
        });

        test("Position offset", () => {
            expect(() => {
                creator.validate(creator.create("ABC123"), {
                    positionOffset: 4
                });
            }).not.toThrow(RangeError);
        });

        test("Not all numeric", () => {
            expect(() => {
                creator.validate(creator.create("01234"), {
                    exclusion: Exclusions.AllNumeric
                });
            }).toThrow("Reference can't be all-numeric");

            expect(() => {
                creator.validate(creator.create("O1234"), {
                    exclusion: Exclusions.AllNumeric
                });
            }).not.toThrow(RangeError);
        });
    });
}
