import { type CharacterSetCreator, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { AI39_CREATOR, AI82_CREATOR, type ContentCharacterSet, ContentCharacterSets } from "../src/index.js";

export function characterSetCreatorFor(characterSet: ContentCharacterSet): CharacterSetCreator {
    let characterSetCreator: CharacterSetCreator;

    switch (characterSet) {
        case ContentCharacterSets.Numeric:
            characterSetCreator = NUMERIC_CREATOR;
            break;

        case ContentCharacterSets.AI82:
            characterSetCreator = AI82_CREATOR;
            break;

        case ContentCharacterSets.AI39:
            characterSetCreator = AI39_CREATOR;
            break;
    }

    return characterSetCreator;
}
