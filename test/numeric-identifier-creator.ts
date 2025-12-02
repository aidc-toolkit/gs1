import { CharacterSetCreator, Sequence } from "@aidc-toolkit/utility";
import { describe, expect, test } from "vitest";
import {
    hasValidCheckDigit,
    IdentifierTypes,
    LeaderTypes,
    type NumericIdentifierCreator,
    type NumericIdentifierType
} from "../src";
import { testIdentifierCreatorCallback } from "./identifier-creator";

export function testNumericIdentifierCreator<TNumericIdentifierType extends NumericIdentifierType>(creator: NumericIdentifierCreator<TNumericIdentifierType>, preTestCallback?: () => void, postTestCallback?: () => void): void {
    describe(creator.identifierType === IdentifierTypes.GTIN ? `${creator.identifierType}-${creator.length}` : creator.identifierType, () => {
        testIdentifierCreatorCallback(preTestCallback);

        const prefix = creator.prefix;
        const prefixLength = prefix.length;
        const hasExtensionDigit = creator.leaderType === LeaderTypes.ExtensionDigit;
        const prefixSubstringStart = Number(hasExtensionDigit);
        const prefixSubstringEnd = prefixSubstringStart + prefixLength;
        const referenceLength = creator.length - prefixLength - 1;
        const referenceCount = Number(CharacterSetCreator.powerOf10(referenceLength));
        const referenceSubstringStart = prefixSubstringEnd;
        const referenceSubstringEnd = referenceSubstringStart + referenceLength - prefixSubstringStart;

        function validate(identifier: string, index: number, sparse: boolean): void {
            expect(() => {
                creator.validate(identifier);
            }).not.toThrow(RangeError);
            expect(identifier).toBe(creator.create(index, sparse));

            expect(identifier.length).toBe(creator.length);
            expect(identifier.substring(prefixSubstringStart, prefixSubstringEnd)).toBe(prefix);
            expect(hasValidCheckDigit(identifier)).toBe(true);
        }

        test("Straight", {
            // Test can take a long time.
            timeout: 20 * 1000
        }, () => {
            expect(creator.referenceLength).toBe(referenceLength);
            expect(creator.capacity).toBe(Number(CharacterSetCreator.powerOf10(referenceLength)));

            const sequenceIterator = creator.create(new Sequence(0, referenceCount))[Symbol.iterator]();

            let index = 0;

            for (const identifier of creator.createAll()) {
                validate(identifier, index, false);

                expect(Number((hasExtensionDigit ? identifier.charAt(0) : "") + identifier.substring(referenceSubstringStart, referenceSubstringEnd))).toBe(index);
                expect(sequenceIterator.next().value).toBe(identifier);

                index++;
            }

            expect(index).toBe(referenceCount);
            expect(sequenceIterator.next().value).toBeUndefined();

            const randomValues = new Array<number>();
            const identifiers = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identifiers.push(creator.create(randomValue));
            }

            expect(Array.from(creator.create(randomValues))).toStrictEqual(identifiers);
        });

        test("Sparse", () => {
            const sparseReferenceCount = Math.min(referenceCount, 1000);

            // Reference count of 1 is neither sequential nor sparse so treat it as sparse.
            let sequential = sparseReferenceCount !== 1;

            const sequenceSet = new Set<string>();

            let index = 0;

            for (const identifier of creator.create(new Sequence(0, sparseReferenceCount), true)) {
                validate(identifier, index, true);

                sequential &&= Number((hasExtensionDigit ? identifier.charAt(0) : "") + identifier.substring(referenceSubstringStart, referenceSubstringEnd)) === index;

                expect(sequenceSet.has(identifier)).toBe(false);
                sequenceSet.add(identifier);

                index++;
            }

            expect(sequential).toBe(false);
            expect(index).toBe(sparseReferenceCount);

            const randomValues = new Array<number>();
            const identifiers = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identifiers.push(creator.create(randomValue, true));
            }

            expect(Array.from(creator.create(randomValues, true))).toStrictEqual(identifiers);
        });

        test("Validation position", () => {
            const identifier = creator.create(0);

            const badIdentifier1 = `${identifier.substring(0, identifier.length - 2)}O${identifier.substring(identifier.length - 1)}`;

            expect(badIdentifier1.length).toBe(creator.length);
            expect(() => {
                creator.validate(badIdentifier1);
            }).toThrow(`Invalid character 'O' at position ${creator.length - 1}`);

            const badIdentifier2 = `${identifier.substring(0, 2)}O${identifier.substring(3)}`;

            expect(badIdentifier2.length).toBe(creator.length);
            expect(() => {
                creator.validate(badIdentifier2);
            }).toThrow("Invalid character 'O' at position 3");
        });

        test("Position offset", () => {
            expect(() => {
                creator.validate(creator.create(0), {
                    positionOffset: 4
                });
            }).not.toThrow(RangeError);
        });

        testIdentifierCreatorCallback(postTestCallback);
    });
}
