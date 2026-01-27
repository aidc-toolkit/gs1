import { expect } from "vitest";
import type { IdentifierType, IdentifierTypeValidator, PrefixType } from "../src/index.js";

export function validateIdentifierValidator<TIdentifierType extends IdentifierType>(creator: IdentifierTypeValidator<TIdentifierType>, identifierType: IdentifierType, prefixType: PrefixType, length: number): void {
    expect(creator.identifierType).toBe(identifierType);
    expect(creator.prefixType).toBe(prefixType);
    expect(creator.length).toBe(length);
}
