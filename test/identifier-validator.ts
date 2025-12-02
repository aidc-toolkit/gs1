import { expect } from "vitest";
import type { IdentifierType, IdentifierValidator, PrefixType } from "../src";

export function validateIdentifierValidator<TIdentifierType extends IdentifierType>(creator: IdentifierValidator<TIdentifierType>, identifierType: IdentifierType, prefixType: PrefixType, length: number): void {
    expect(creator.identifierType).toBe(identifierType);
    expect(creator.prefixType).toBe(prefixType);
    expect(creator.length).toBe(length);
}
