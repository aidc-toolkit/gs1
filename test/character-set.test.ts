import { DEFAULT_LANGUAGE } from "@aidc-toolkit/core";
import { type CharacterSetCreator, type CharacterSetValidator, type Exclusion, Exclusions, Sequence } from "@aidc-toolkit/utility";
import { describe, expect, test } from "vitest";
import { AI39_CREATOR, AI39_VALIDATOR, AI64_VALIDATOR, AI82_CREATOR, AI82_VALIDATOR } from "../src/index.js";

// Type is used to ensure that testCharacterSet() is not called with creator twice.
type ValidatorNotCreator<T extends CharacterSetValidator> = T extends CharacterSetCreator ? never : T;

// Copied from utility testing.
function testCharacterSet<T extends CharacterSetValidator>(name: string, characterSetCreator: CharacterSetCreator, characterSetValidator: ValidatorNotCreator<T>, characterSetSize: number, length: number, excludeFirstZero: boolean, excludeAllNumeric: boolean): void {
    describe(name, () => {
        test("Validator is creator", () => {
            expect(characterSetValidator).toBe(characterSetCreator);
        });

        test("Character set", () => {
            for (const [index, c] of characterSetCreator.characterSet.entries()) {
                expect(c).not.toBeUndefined();
                expect(characterSetCreator.characterIndex(c)).toBe(index);
            }

            let s = "";

            for (let index = 0; index < characterSetSize; index++) {
                const c = characterSetCreator.character(index);

                s += c;

                expect(c).not.toBeUndefined();
                expect(characterSetCreator.characterIndex(c)).toBe(index);
            }

            expect(characterSetCreator.character(characterSetSize)).toBeUndefined();

            const characterIndexes = characterSetCreator.characterIndexes(s);

            expect(characterIndexes.length).toBe(characterSetSize);

            for (const [index, characterIndex] of characterIndexes.entries()) {
                expect(characterIndex).toBe(index);
            }

            expect(characterSetCreator.exclusionSupport.includes(Exclusions.FirstZero)).toBe(excludeFirstZero);
            expect(characterSetCreator.exclusionSupport.includes(Exclusions.AllNumeric)).toBe(excludeAllNumeric);
        });

        function testCreate(exclusion: Exclusion): void {
            let domain: number;

            switch (exclusion) {
                case Exclusions.FirstZero:
                    expect(() => characterSetCreator.create(0, 0, Exclusions.FirstZero)).toThrow("Domain 0 must be greater than 0");
                    domain = (characterSetSize - 1) * characterSetSize ** (length - 1);
                    break;

                case Exclusions.AllNumeric:
                    expect(() => characterSetCreator.create(0, 0, Exclusions.AllNumeric)).toThrow("Domain 0 must be greater than 0");
                    domain = characterSetSize ** length - 10 ** length;
                    break;

                default:
                    domain = characterSetSize ** length;
                    break;
            }

            const sequence = characterSetCreator.create(length, new Sequence(0n, domain), exclusion);

            let previousS = "";

            let index = 0;

            for (const s of sequence) {
                expect(s > previousS).toBe(true);
                previousS = s;

                expect(s.length).toBe(length);

                expect(() => {
                    characterSetValidator.validate(s);
                }).not.toThrow(RangeError);
                expect(characterSetCreator.valueFor(s, exclusion)).toBe(BigInt(index));

                index++;
            }

            expect(index).toBe(domain);

            expect(() => characterSetCreator.create(length, domain, exclusion)).toThrow(`Value ${domain.toLocaleString(DEFAULT_LANGUAGE)} must be less than ${domain.toLocaleString(DEFAULT_LANGUAGE)}`);

            const sparseSequence = characterSetCreator.create(length, new Sequence(domain - 1, -domain), exclusion, 123456n);

            let sequential = true;
            previousS = "~";

            const sequenceSet = new Set<string>();

            index = 0;

            for (const s of sparseSequence) {
                sequential &&= s < previousS;
                previousS = s;

                expect(s.length).toBe(length);

                expect(sequenceSet.has(s)).toBe(false);
                sequenceSet.add(s);

                expect(() => {
                    characterSetValidator.validate(s);
                }).not.toThrow(RangeError);
                expect(characterSetCreator.valueFor(s, exclusion, 123456n)).toBe(BigInt(domain - index - 1));

                index++;
            }

            expect(sequential).toBe(false);
            expect(index).toBe(domain);

            const randomValues: bigint[] = [];
            const straightRandomValues: string[] = [];
            const sparseRandomValues: string[] = [];

            for (let i = 0; i < 1000; i++) {
                const randomValue = BigInt(Math.floor(Math.random() * domain));

                randomValues.push(randomValue);
                straightRandomValues.push(characterSetCreator.create(length, randomValue, exclusion));
                sparseRandomValues.push(characterSetCreator.create(length, randomValue, exclusion, 123456n));
            }

            expect(Array.from(characterSetCreator.create(length, randomValues, exclusion))).toStrictEqual(straightRandomValues);
            expect(Array.from(characterSetCreator.create(length, randomValues, exclusion, 123456n))).toStrictEqual(sparseRandomValues);

            expect(() => characterSetCreator.create(length, domain, exclusion, 123456n)).toThrow(`Value ${domain.toLocaleString(DEFAULT_LANGUAGE)} must be less than ${domain.toLocaleString(DEFAULT_LANGUAGE)}`);
        }

        test("Length", () => {
            expect(() => characterSetCreator.create(0, 0)).not.toThrow(RangeError);
            expect(() => characterSetCreator.create(-1, 0)).toThrow("Length -1 must be greater than or equal to 0");
            expect(() => characterSetCreator.create(40, 0)).not.toThrow(RangeError);
            expect(() => characterSetCreator.create(41, 0)).toThrow("Length 41 must be less than or equal to 40");
        });

        test("Create sequence", () => {
            testCreate(Exclusions.None);
        });

        if (excludeFirstZero) {
            test("Create sequence, exclude first zero", () => {
                testCreate(Exclusions.FirstZero);

                expect(() => characterSetCreator.valueFor("0000", Exclusions.FirstZero)).toThrow("Invalid character '0' at position 1");
                expect(() => characterSetCreator.valueFor("1000", Exclusions.FirstZero)).not.toThrow(RangeError);
            });
        }

        if (excludeAllNumeric) {
            test("Create sequence, exclude all numeric", () => {
                testCreate(Exclusions.AllNumeric);

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Nine is known to be present in the character set.
                const afterNine = characterSetCreator.character(characterSetCreator.characterIndex("9")! + 1);

                expect(() => characterSetCreator.valueFor("0000", Exclusions.AllNumeric)).toThrow("String must not be all numeric");
                expect(() => characterSetCreator.valueFor(`000${afterNine}`, Exclusions.AllNumeric)).not.toThrow(RangeError);
                expect(() => characterSetCreator.valueFor("9999", Exclusions.AllNumeric)).toThrow("String must not be all numeric");
                expect(() => characterSetCreator.valueFor(`999${afterNine}`, Exclusions.AllNumeric)).not.toThrow(RangeError);
            });
        }
    });
}

testCharacterSet("AI 82", AI82_CREATOR, AI82_VALIDATOR, 82, 2, false, true);
testCharacterSet("AI 39", AI39_CREATOR, AI39_VALIDATOR, 39, 3, false, true);

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
