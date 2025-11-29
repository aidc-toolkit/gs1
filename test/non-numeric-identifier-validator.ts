import { expect } from "vitest";
import {
    type ContentCharacterSet,
    type IdentifierType,
    type NonNumericIdentifierCreator,
    type NonNumericIdentifierValidator,
    PrefixTypes
} from "../src";
import { validateIdentifierValidator } from "./identifier-validator";
import { creatorFor } from "./utility";

export function validateNonNumericIdentifierValidator(validator: NonNumericIdentifierValidator, isCreator: boolean, identifierType: IdentifierType, length: number, referenceCharacterSet: ContentCharacterSet, requiresCheckCharacterPair: boolean): void {
    validateIdentifierValidator(validator, identifierType, PrefixTypes.GS1CompanyPrefix, length);

    const referenceCreator = creatorFor(referenceCharacterSet);

    expect(validator.referenceCharacterSet).toBe(referenceCharacterSet);
    expect(validator.referenceCreator).toBe(referenceCreator);
    expect(validator.requiresCheckCharacterPair).toBe(requiresCheckCharacterPair);

    if (isCreator) {
        expect((validator as NonNumericIdentifierCreator).referenceCreator).toBe(referenceCreator);
    }
}
