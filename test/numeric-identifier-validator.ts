import { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { expect } from "vitest";
import {
    ContentCharacterSets,
    type IdentifierType,
    type IdentifierTypeValidator,
    type LeaderType,
    type NumericIdentifierType,
    type PrefixType
} from "../src/index.js";
import { validateIdentifierValidator } from "./identifier-validator.js";

export function validateNumericIdentifierValidator<TNumericIdentifierType extends NumericIdentifierType>(validator: IdentifierTypeValidator<TNumericIdentifierType>, identifierType: IdentifierType, prefixType: PrefixType, length: number, leaderType: LeaderType): void {
    validateIdentifierValidator(validator, identifierType, prefixType, length);

    expect(validator.leaderType).toBe(leaderType);
    expect(validator.referenceCharacterSet).toBe(ContentCharacterSets.Numeric);
    expect(validator.referenceCreator).toBe(NUMERIC_CREATOR);
}
