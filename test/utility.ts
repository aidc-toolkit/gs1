import { type CharacterSetCreator, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { AI39_CREATOR, AI82_CREATOR, type ContentCharacterSet, ContentCharacterSets } from "../src";

export function creatorFor(characterSet: ContentCharacterSet): CharacterSetCreator {
    let creator: CharacterSetCreator;

    switch (characterSet) {
        case ContentCharacterSets.Numeric:
            creator = NUMERIC_CREATOR;
            break;

        case ContentCharacterSets.AI82:
            creator = AI82_CREATOR;
            break;

        case ContentCharacterSets.AI39:
            creator = AI39_CREATOR;
            break;
    }

    return creator;
}
