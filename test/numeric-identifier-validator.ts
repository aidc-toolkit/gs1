import { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { expect } from "vitest";
import {
    ContentCharacterSets,
    type IdentifierType,
    type LeaderType,
    type NumericIdentifierValidator,
    type PrefixType
} from "../src/index.js";
import { validateIdentifierValidator } from "./identifier-validator.js";

export function validateNumericIdentifierValidator(validator: NumericIdentifierValidator, identifierType: IdentifierType, prefixType: PrefixType, length: number, leaderType: LeaderType): void {
    validateIdentifierValidator(validator, identifierType, prefixType, length);

    expect(validator.leaderType).toBe(leaderType);
    expect(validator.referenceCharacterSet).toBe(ContentCharacterSets.Numeric);
    expect(validator.referenceCreator).toBe(NUMERIC_CREATOR);
}
