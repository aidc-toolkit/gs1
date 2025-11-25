import { expect } from "vitest";
import type {
    ContentCharacterSet,
    IdentifierType,
    LeaderType,
    SerializableNumericIdentifierCreator,
    SerializableNumericIdentifierValidator
} from "../src";
import { validateNonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";
import { creatorFor } from "./utility.js";

export function validateSerializableNumericIdentifierValidator(validator: SerializableNumericIdentifierValidator, isCreator: boolean, identifierType: IdentifierType, length: number, leaderType: LeaderType, serialLength: number, serialCharacterSet: ContentCharacterSet): void {
    validateNonGTINNumericIdentifierValidator(validator, isCreator, identifierType, length, leaderType);

    const serialCreator = creatorFor(serialCharacterSet);

    expect(validator.serialComponentLength).toBe(serialLength);
    expect(validator.serialComponentCharacterSet).toBe(serialCharacterSet);
    expect(validator.serialComponentCreator).toBe(serialCreator);

    if (isCreator) {
        expect((validator as SerializableNumericIdentifierCreator).serialComponentCreator).toBe(serialCreator);
    }
}
