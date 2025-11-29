import { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { expect } from "vitest";
import {
    ContentCharacterSets,
    type IdentifierType,
    type LeaderType,
    type NumericIdentifierCreator,
    type NumericIdentifierValidator,
    type PrefixType
} from "../src";
import { validateIdentifierValidator } from "./identifier-validator";

export function validateNumericIdentifierValidator(validator: NumericIdentifierValidator, isCreator: boolean, identifierType: IdentifierType, prefixType: PrefixType, length: number, leaderType: LeaderType): void {
    validateIdentifierValidator(validator, identifierType, prefixType, length);

    expect(validator.leaderType).toBe(leaderType);
    expect(validator.referenceCharacterSet).toBe(ContentCharacterSets.Numeric);
    expect(validator.referenceCreator).toBe(NUMERIC_CREATOR);

    if (isCreator) {
        expect((validator as NumericIdentifierCreator).referenceCreator).toBe(NUMERIC_CREATOR);
    }
}
