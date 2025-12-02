import {
    type IdentifierType, type LeaderType,
    type NonGTINNumericIdentifierType, type NonGTINNumericIdentifierValidator, PrefixTypes
} from "../src";
import { validateNumericIdentifierValidator } from "./numeric-identifier-validator";

export function validateNonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType extends NonGTINNumericIdentifierType>(validator: NonGTINNumericIdentifierValidator<TNonGTINNumericIdentifierType>, isCreator: boolean, identifierType: IdentifierType, length: number, leaderType: LeaderType): void {
    validateNumericIdentifierValidator(validator, isCreator, identifierType, PrefixTypes.GS1CompanyPrefix, length, leaderType);
}
