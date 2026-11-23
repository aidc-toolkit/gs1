import type { IdentifierType, LeaderType, NonSerializableNumericIdentifierValidator } from "../src/index.js";
import { validateNonGTINNumericIdentifierValidator } from "./non-gtin-numeric-identifier-validator.js";

export function validateNonSerializableNumericIdentifierValidator(validator: NonSerializableNumericIdentifierValidator, identifierType: IdentifierType, length: number, leaderType: LeaderType): void {
    validateNonGTINNumericIdentifierValidator(validator, identifierType, length, leaderType);
}
