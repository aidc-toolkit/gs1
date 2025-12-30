import { expect, test } from "vitest";
import {
    ContentCharacterSets,
    isSerializableNumericIdentifierCreator,
    type SerializableNumericIdentifierCreator
} from "../src/index.js";
import { testNonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";

export function testSerializableNumericIdentifierCreator(creator: SerializableNumericIdentifierCreator): void {
    testNonGTINNumericIdentifierCreator(creator, () => {
        test("Mapping", () => {
            expect(isSerializableNumericIdentifierCreator(creator)).toBe(true);
        });
    }, () => {
        test("Serialization", () => {
            const baseIdentifier = creator.create(0, true);
            const serialComponent = "12345678";
            const serializedIdentifier = baseIdentifier + serialComponent;
            const serialComponents = [serialComponent, "23456789", "34567890", "456789012"];
            const serializedIdentifiers = serialComponents.map(serial => baseIdentifier + serial);

            expect(creator.split(baseIdentifier)).toStrictEqual({
                baseIdentifier,
                serialComponent: ""
            });

            expect(creator.createSerialized(0, serialComponent, true)).toBe(serializedIdentifier);
            expect(creator.split(creator.createSerialized(0, serialComponent, true))).toStrictEqual({
                baseIdentifier,
                serialComponent
            });
            expect(creator.concatenate(baseIdentifier, serialComponent)).toBe(serializedIdentifier);
            expect(creator.split(creator.concatenate(baseIdentifier, serialComponent))).toStrictEqual({
                baseIdentifier,
                serialComponent
            });
            expect(Array.from(creator.createSerialized(0, serialComponents, true))).toStrictEqual(serializedIdentifiers);
            expect(Array.from(creator.concatenate(baseIdentifier, serialComponents))).toStrictEqual(serializedIdentifiers);

            const fullLengthSerial = "0".repeat(creator.serialComponentLength);
            const fullLengthPlusOneSerial = fullLengthSerial + "0";
            const fullLengthPlusOneSerialErrorMessage = `Length ${creator.serialComponentLength + 1} of serial component must be less than or equal to ${creator.serialComponentLength}`;

            expect(() => creator.createSerialized(0, fullLengthSerial, true)).not.toThrow(RangeError);
            expect(() => creator.concatenate(baseIdentifier, fullLengthSerial)).not.toThrow(RangeError);
            expect(() => Array.from(creator.createSerialized(0, [...serialComponents, fullLengthSerial], true))).not.toThrow(RangeError);
            expect(() => Array.from(creator.concatenate(baseIdentifier, [...serialComponents, fullLengthSerial]))).not.toThrow(RangeError);
            expect(() => creator.createSerialized(0, fullLengthPlusOneSerial, true)).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => creator.concatenate(baseIdentifier, fullLengthPlusOneSerial)).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => Array.from(creator.createSerialized(0, [...serialComponents, fullLengthPlusOneSerial], true))).toThrow(fullLengthPlusOneSerialErrorMessage);
            expect(() => Array.from(creator.concatenate(baseIdentifier, [...serialComponents, fullLengthPlusOneSerial]))).toThrow(fullLengthPlusOneSerialErrorMessage);

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
            expect(() => creator.concatenate(baseIdentifier, invalidSerial)).toThrow(invalidSerialErrorMessage);
            expect(() => Array.from(creator.createSerialized(0, [...serialComponents, invalidSerial], true))).toThrow(invalidSerialErrorMessage);
            expect(() => Array.from(creator.concatenate(baseIdentifier, [...serialComponents, invalidSerial]))).toThrow(invalidSerialErrorMessage);
        });
    });
}
