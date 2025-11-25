import { type IdentifierType, type LeaderType, type NonGTINNumericIdentifierValidator, PrefixTypes } from "../src";
import { validateNumericIdentifierValidator } from "./numeric-identifier-validator.js";

export function validateNonGTINNumericIdentifierValidator(validator: NonGTINNumericIdentifierValidator, isCreator: boolean, identifierType: IdentifierType, length: number, leaderType: LeaderType): void {
    validateNumericIdentifierValidator(validator, isCreator, identifierType, PrefixTypes.GS1CompanyPrefix, length, leaderType);
}
