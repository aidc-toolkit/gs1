import { type CharacterSetCreator, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { AI39_CREATOR, AI82_CREATOR } from "./character-set.js";
import { type ContentCharacterSet, ContentCharacterSets } from "./content-character-set.js";

export const CONTENT_CHARACTER_SET_CREATORS: Record<ContentCharacterSet, CharacterSetCreator> = {
    [ContentCharacterSets.Numeric]: NUMERIC_CREATOR,
    [ContentCharacterSets.AI82]: AI82_CREATOR,
    [ContentCharacterSets.AI39]: AI39_CREATOR
};
