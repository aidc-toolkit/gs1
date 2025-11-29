import { expect, test } from "vitest";
import { ContentCharacterSets, type SerializableNumericIdentifierCreator } from "../src";
import { testNonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator";

export function testSerializableNumericIdentifierCreator(creator: SerializableNumericIdentifierCreator): void {
    testNonGTINNumericIdentifierCreator(creator, undefined, () => {
        test("Serialization", () => {
            const identifier = creator.create(0, true);
            const serial = "12345678";
            const serializedIdentifier = identifier + serial;
            const serials = [serial, "23456789", "34567890", "456789012"];
            const serializedIdentifiers = serials.map(serial => identifier + serial);

            expect(creator.createSerialized(0, serial, true)).toBe(serializedIdentifier);
            expect(creator.concatenate(identifier, serial)).toBe(serializedIdentifier);
            expect(Array.from(creator.createSerialized(0, serials, true))).toStrictEqual(serializedIdentifiers);
            expect(Array.from(creator.concatenate(identifier, serials))).toStrictEqual(serializedIdentifiers);

            const fullLengthSerial = "0".repeat(creator.serialComponentLength);
            const fullLengthPlusOneSerial = fullLengthSerial + "0";
            const fullLengthPlusOneSerialErrorMessage = `Length ${creator.serialComponentLength + 1} of serial component must be less than or equal to ${creator.serialComponentLength}`;

            expect(() => creator.createSerialized(0, fullLengthSerial, true)).not.toThrow(RangeError);
            expect(() => creator.concatenate(identifier, fullLengthSerial)).not.toThrow(RangeError);
            expect(() => Array.from(creator.createSerialized(0, [...serials, fullLengthSerial], true))).not.toThrow(RangeError);
            expect(() => Array.from(creator.concatenate(identifier, [...serials, fullLengthSerial]))).not.toThrow(RangeError);
            expect(() => creator.createSerialized(0, fullLengthPlusOneSerial, true)).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => creator.concatenate(identifier, fullLengthPlusOneSerial)).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => Array.from(creator.createSerialized(0, [...serials, fullLengthPlusOneSerial], true))).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => Array.from(creator.concatenate(identifier, [...serials, fullLengthPlusOneSerial]))).toThrow(fullLengthPlusOneSerialErrorMessage);

            let invalidSerial: string;

            switch (creator.serialComponentCharacterSet) {
                case ContentCharacterSets.Numeric:
                    invalidSerial = "1234A5678";
                    break;

                case ContentCharacterSets.AI82:
                    invalidSerial = "ABCD~1234";
                    break;

                case ContentCharacterSets.AI39:
                    invalidSerial = "ABCD%1234";
                    break;
            }

            const invalidSerialErrorMessage = `Invalid character '${invalidSerial.charAt(4)}' at position 5 of serial component`;

            expect(() => creator.createSerialized(0, invalidSerial, true)).toThrow(invalidSerialErrorMessage);
            expect(() => creator.concatenate(identifier, invalidSerial)).toThrow(invalidSerialErrorMessage);
            expect(() => Array.from(creator.createSerialized(0, [...serials, invalidSerial], true))).toThrow(invalidSerialErrorMessage);
            expect(() => Array.from(creator.concatenate(identifier, [...serials, invalidSerial]))).toThrow(invalidSerialErrorMessage);
        });
    });
}
