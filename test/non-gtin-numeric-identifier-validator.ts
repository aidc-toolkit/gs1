import { type IdentifierType, type LeaderType, type NonGTINNumericIdentifierValidator, PrefixTypes } from "../src/index.js";
import { validateNumericIdentifierValidator } from "./numeric-identifier-validator.js";

export function validateNonGTINNumericIdentifierValidator(validator: NonGTINNumericIdentifierValidator, isCreator: boolean, identifierType: IdentifierType, length: number, leaderType: LeaderType): void {
    validateNumericIdentifierValidator(validator, identifierType, PrefixTypes.GS1CompanyPrefix, length, leaderType);
}
