import type { Hyperlink } from "@aidc-toolkit/core";
import { GTINValidator } from "./gtin-validator.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import { IdentifierValidators } from "./identifier-validators.js";

const VERIFIED_BY_GS1_REFERENCE_BASE = "https://www.gs1.org/services/verified-by-gs1/results?";

/**
 * Create a Verified by GS1 hyperlink.
 *
 * @param identifierType
 * Identifier type.
 *
 * @param identifier
 * Identifier.
 *
 * @param text
 * Text for hyperlink. If not provided, the identifier is used.
 *
 * @param details
 * Details to display when hovering over hyperlink.
 *
 * @returns
 * Verified by GS1 hyperlink.
 */
// eslint-disable-next-line @typescript-eslint/no-useless-default-assignment -- Undefined is necessary to allow bypass of text.
export function verifiedByGS1(identifierType: IdentifierType, identifier: string, text: string | undefined = undefined, details?: string): Hyperlink {
    let normalizedIdentifier: string;
    let useKeyTypeParameter: boolean;

    if (identifierType === IdentifierTypes.GTIN) {
        // Normalization will validate resulting GTIN.
        normalizedIdentifier = GTINValidator.normalize(identifier);

        useKeyTypeParameter = true;
    } else {
        const identifierValidator = IdentifierValidators[identifierType];

        identifierValidator.validate(identifier);

        normalizedIdentifier = identifier;
        useKeyTypeParameter = identifierType === IdentifierTypes.GLN;
    }

    const lowerCaseIdentifierType = identifierType.toLowerCase();

    const reference = useKeyTypeParameter ? `${VERIFIED_BY_GS1_REFERENCE_BASE}${lowerCaseIdentifierType}=${normalizedIdentifier}` : `${VERIFIED_BY_GS1_REFERENCE_BASE}key=${normalizedIdentifier}&key_type=${lowerCaseIdentifierType}`;

    return {
        reference,
        text: text ?? identifier,
        details
    };
}
