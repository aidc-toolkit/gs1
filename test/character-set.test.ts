import { describe, expect, test } from "vitest";
import { AI64_VALIDATOR } from "../src/index.js";

describe("AI 64 character set validator", () => {
    test("Character set", () => {
        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz");
        }).not.toThrow(RangeError);

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxy");
        }).toThrow("Length 63 must be a multiple of 4");

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwx");
        }).toThrow("Length 62 must be a multiple of 4");

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvw");
        }).toThrow("Length 61 must be a multiple of 4");

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyzABC=");
        }).not.toThrow(RangeError);

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyzAB==");
        }).not.toThrow(RangeError);

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyzA===");
        }).toThrow("Invalid character '=' at position 65");

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz====");
        }).toThrow("Invalid character '=' at position 64");

        expect(() => {
            AI64_VALIDATOR.validate("=-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxy");
        }).toThrow("Invalid character '=' at position 0");

        expect(() => {
            AI64_VALIDATOR.validate("-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ=_abcdefghijklmnopqrstuvwxy");
        }).toThrow("Invalid character '=' at position 37");
    });
});
