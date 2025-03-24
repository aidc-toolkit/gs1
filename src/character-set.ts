import { CharacterSetCreator, type CharacterSetValidator, Exclusion } from "@aidc-toolkit/utility";

/**
 * GS1 AI encodable character set 82 creator as defined in section 7.11 of the {@link https://www.gs1.org/genspecs | GS1
 * General Specifications}. Supports {@linkcode Exclusion.AllNumeric}.
 */
export const AI82_CREATOR = new CharacterSetCreator([
    "!", "\"", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ":", ";", "<", "=", ">", "?",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "_",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
], Exclusion.AllNumeric);

/**
 * GS1 AI encodable character set 82 validator as defined in section 7.11 of the {@link https://www.gs1.org/genspecs |
 * GS1 General Specifications}. Supports {@linkcode Exclusion.AllNumeric}.
 */
export const AI82_VALIDATOR = AI82_CREATOR as CharacterSetValidator;

/**
 * GS1 AI encodable character set 39 creator as defined in section 7.11 of the {@link https://www.gs1.org/genspecs | GS1
 * General Specifications}. Supports {@linkcode Exclusion.AllNumeric}.
 */
export const AI39_CREATOR = new CharacterSetCreator([
    "#", "-", "/",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
], Exclusion.AllNumeric);

/**
 * GS1 AI encodable character set 39 validator as defined in section 7.11 of the {@link https://www.gs1.org/genspecs |
 * GS1 General Specifications}. Supports {@linkcode Exclusion.AllNumeric}.
 */
export const AI39_VALIDATOR = AI39_CREATOR as CharacterSetValidator;
