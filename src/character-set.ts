import {
    CharacterSetCreator,
    type CharacterSetValidation,
    CharacterSetValidator,
    Exclusions, utilityNS
} from "@aidc-toolkit/utility";
import { i18nextGS1 } from "./locale/i18n.js";

/**
 * GS1 AI encodable character set 82 creator as defined in section 7.11 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Supports {@linkcode Exclusions.AllNumeric}.
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
], Exclusions.AllNumeric);

/**
 * GS1 AI encodable character set 82 validator as defined in section 7.11 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Supports {@linkcode Exclusions.AllNumeric}.
 */
export const AI82_VALIDATOR = AI82_CREATOR as CharacterSetValidator;

/**
 * GS1 AI encodable character set 39 creator as defined in section 7.11 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Supports {@linkcode Exclusions.AllNumeric}.
 */
export const AI39_CREATOR = new CharacterSetCreator([
    "#", "-", "/",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
], Exclusions.AllNumeric);

/**
 * GS1 AI encodable character set 39 validator as defined in section 7.11 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Supports {@linkcode Exclusions.AllNumeric}.
 */
export const AI39_VALIDATOR = AI39_CREATOR as CharacterSetValidator;

/**
 * GS1 AI encodable character set 64 validator with additional base64 validation of length (multiple of 4) and position
 * of equal sign (last or last two characters).
 */
class AI64CharacterSetValidator extends CharacterSetValidator {
    /**
     * Constructor.
     */
    constructor() {
        super(([
            "-",
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "=",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
            "_",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
        ]));
    }

    /**
     * @inheritDoc
     */
    override validate(s: string, validation?: CharacterSetValidation): void {
        super.validate(s, validation);

        const length = s.length;

        if (length % 4 !== 0) {
            throw new RangeError(i18nextGS1.t("AI64CharacterSetValidator.lengthMustBeMultipleOf4", {
                length
            }));
        }

        const equalIndex = s.search(/={1,2}/u);

        if (equalIndex !== -1 && equalIndex < length - 2) {
            throw new RangeError(i18nextGS1.t("CharacterSetValidator.invalidCharacterAtPosition", {
                ns: utilityNS,
                c: "=",
                position: equalIndex
            }));
        }
    }
}

/**
 * GS1 AI encodable character set 64 validator as defined in section 7.11 of the {@link
 * https://ref.gs1.org/standards/genspecs/ | GS1 General Specifications}. Doesn't support any exclusions.
 */
export const AI64_VALIDATOR = new AI64CharacterSetValidator();
