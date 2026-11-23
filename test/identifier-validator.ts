import { expect } from "vitest";
import type { IdentifierType, IdentifierValidator, PrefixType } from "../src/index.js";

export function validateIdentifierValidator(validator: IdentifierValidator, identifierType: IdentifierType, prefixType: PrefixType, length: number): void {
    expect(validator.identifierType).toBe(identifierType);
    expect(validator.prefixType).toBe(prefixType);
    expect(validator.length).toBe(length);
}
