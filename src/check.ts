import { NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { AI82_CREATOR } from "./character-set.js";
import i18next, { gs1NS } from "./locale/i18n.js";

/**
 * Results of multiplying digits by 3.
 */
const THREE_WEIGHT_RESULTS: readonly number[] = [
    0, 3, 6, 9, 12, 15, 18, 21, 24, 27
];

/**
 * Results of multiplying digits by 2, subtracting tens digit, and extracting units digit.
 */
const TWO_MINUS_WEIGHT_RESULTS: readonly number[] = [
    0, 2, 4, 6, 8, 9, 1, 3, 5, 7
];

/**
 * Results of multiplying digits by 5, adding tens digit, and extracting units digit.
 */
const FIVE_PLUS_WEIGHT_RESULTS: readonly number[] = [
    0, 5, 1, 6, 2, 7, 3, 8, 4, 9
];

/**
 * Results of multiplying digits by 5, subtracting tens digit, and extracting units digit.
 */
const FIVE_MINUS_WEIGHT_RESULTS: readonly number[] = [
    0, 5, 9, 4, 8, 3, 7, 2, 6, 1
];

/**
 * Inverse mapping of FIVE_MINUS_WEIGHT_RESULTS.
 */
const INVERSE_FIVE_MINUS_WEIGHT_RESULTS: readonly number[] = [
    0, 9, 7, 5, 3, 1, 8, 6, 4, 2
];

/**
 * Calculate the check digit sum for a numeric string as per section 7.9.1 of the {@link https://www.gs1.org/genspecs |
 * GS1 General Specifications}.
 *
 * @param exchangeWeights
 * If true, start the weights at 1 instead of 3 on the right.
 *
 * @param s
 * Numeric string.
 *
 * @returns
 * Accumulated sum of each digit multiplied by the weight at its position.
 */
export function checkDigitSum(exchangeWeights: boolean, s: string): number {
    // Initial setting will be the opposite of that used for first character because it gets flipped before being used.
    let weight3 = (s.length + Number(exchangeWeights)) % 2 === 0;

    // Calculate sum of each character value multiplied by the weight at its position.
    return NUMERIC_CREATOR.characterIndexes(s).reduce<number>((accumulator, characterIndex, index) => {
        if (characterIndex === undefined) {
            throw new RangeError(`Invalid character '${s.charAt(index)}' at position ${index + 1}`);
        }

        weight3 = !weight3;

        return accumulator + (weight3 ? THREE_WEIGHT_RESULTS[characterIndex] : characterIndex);
    }, 0);
}

/**
 * Calculate the check digit for a numeric string as per section 7.9.1 of the {@link https://www.gs1.org/genspecs | GS1
 * General Specifications}.
 *
 * @param s
 * Numeric string.
 *
 * @returns
 * Check digit 0-9 as a string.
 */
export function checkDigit(s: string): string {
    // Check digit is the difference from the equal or next of multiple of 10.
    return NUMERIC_CREATOR.character(9 - (checkDigitSum(false, s) + 9) % 10);
}

/**
 * Determine if a numeric string has a valid check digit.
 *
 * @param s
 * Numeric string with check digit.
 *
 * @returns
 * True if the check digit is valid.
 */
export function hasValidCheckDigit(s: string): boolean {
    // Check digit is valid if the check digit sum with the weights exchanged is a multiple of 10.
    return checkDigitSum(true, s) % 10 === 0;
}

/**
 * Calculate the price/weight sum for a numeric string.
 *
 * @param weightsResults
 * Array of weight results arrays to apply to each digit.
 *
 * @param s
 * Numeric string the same length as the weightsResults array.
 *
 * @returns
 * Accumulated sum of the weight result for each digit at the digit's position.
 */
function priceWeightSum(weightsResults: ReadonlyArray<readonly number[]>, s: string): number {
    if (s.length !== weightsResults.length) {
        throw new RangeError(`String for price or weight sum must be exactly ${weightsResults.length} characters`);
    }

    // The value of each character is its index in the character set.
    const characterIndexes = NUMERIC_CREATOR.characterIndexes(s);

    // Calculate sum of each weight result for each digit at its position.
    return characterIndexes.reduce<number>((accumulator, characterIndex, index) => {
        if (characterIndex === undefined) {
            throw new RangeError(`Invalid character '${s.charAt(index)}' at position ${index + 1}`);
        }

        // Add the weight result of the character index to the accumulator.
        return accumulator + weightsResults[index][characterIndex];
    }, 0);
}

/**
 * Calculate the price/weight check digit for a four-digit numeric string as per section 7.9.3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * @param s
 * Numeric string exactly four characters long.
 *
 * @returns
 * Check digit 0-9 as a string.
 */
export function fourDigitPriceWeightCheckDigit(s: string): string {
    return NUMERIC_CREATOR.character(priceWeightSum([TWO_MINUS_WEIGHT_RESULTS, TWO_MINUS_WEIGHT_RESULTS, THREE_WEIGHT_RESULTS, FIVE_MINUS_WEIGHT_RESULTS], s) * 3 % 10);
}

/**
 * Calculate the price/weight check digit for a five-digit numeric string as per section 7.9.3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * @param s
 * Numeric string exactly five characters long.
 *
 * @returns
 * Check digit 0-9 as a string.
 */
export function fiveDigitPriceWeightCheckDigit(s: string): string {
    return NUMERIC_CREATOR.character(INVERSE_FIVE_MINUS_WEIGHT_RESULTS[9 - (priceWeightSum([FIVE_PLUS_WEIGHT_RESULTS, TWO_MINUS_WEIGHT_RESULTS, FIVE_MINUS_WEIGHT_RESULTS, FIVE_PLUS_WEIGHT_RESULTS, TWO_MINUS_WEIGHT_RESULTS], s) + 9) % 10]);
}

/**
 * Weights for check character pair calculation.
 */
const CHECK_CHARACTER_WEIGHTS = [
    107, 103, 101, 97, 89, 83, 79, 73, 71, 67, 61, 59, 53, 47, 43, 41, 37, 31, 29, 23, 19, 17, 13, 11, 7, 5, 3, 2
];

/**
 * Characters used to build check character pair.
 */
const CHECK_CHARACTERS = [
    "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H",
    "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

/**
 * Calculate the check character for a GS1 AI encodable character set 82 string as per section 7.9.5 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * @param s
 * GS1 AI encodable character set 82 string.
 *
 * @returns
 * Check character pair.
 */
export function checkCharacterPair(s: string): string {
    // Weights are applied from right to left.
    const weightIndexStart = CHECK_CHARACTER_WEIGHTS.length - s.length;

    if (weightIndexStart < 0) {
        throw new RangeError(i18next.t("Check.lengthOfStringForCheckCharacterPairMustBeLessThanOrEqualTo", {
            ns: gs1NS,
            length: s.length,
            maximumLength: CHECK_CHARACTER_WEIGHTS.length
        }));
    }

    // Calculate sum of each character value multiplied by the weight at its position, mod 1021.
    const checkCharacterPairSum = AI82_CREATOR.characterIndexes(s).reduce<number>((accumulator, characterIndex, index) => {
        if (characterIndex === undefined) {
            throw new RangeError(`Invalid character '${s.charAt(index)}' at position ${index + 1}`);
        }

        return accumulator + characterIndex * CHECK_CHARACTER_WEIGHTS[weightIndexStart + index];
    }, 0) % 1021;

    const checkCharacterPairSumMod32 = checkCharacterPairSum % 32;

    // Check character pair is the concatenation of the character at position sum div 32 and the character at the position sum mod 32.
    return CHECK_CHARACTERS[(checkCharacterPairSum - checkCharacterPairSumMod32) / 32] + CHECK_CHARACTERS[checkCharacterPairSumMod32];
}

/**
 * Determine if a GS1 AI encodable character set 82 string has a valid check character pair.
 *
 * @param s
 * GS1 AI encodable character set 82 string with check character pair.
 *
 * @returns
 * True if the check character pair is valid.
 */
export function hasValidCheckCharacterPair(s: string): boolean {
    const checkCharacterPairIndex = s.length - 2;

    return checkCharacterPair(s.substring(0, checkCharacterPairIndex)) === s.substring(checkCharacterPairIndex);
}
