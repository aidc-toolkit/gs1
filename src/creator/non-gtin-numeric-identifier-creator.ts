import type {
    NonSerializableNumericIdentifierCreator,
    NonSerializableNumericIdentifierCreators
} from "./non-serializable-numeric-identifier-creator.js";
import type {
    SerializableNumericIdentifierCreator,
    SerializableNumericIdentifierCreators
} from "./serializable-numeric-identifier-creator.js";

/**
 * Non-GTIN numeric identifier creator.
 */
export type NonGTINNumericIdentifierCreator = NonSerializableNumericIdentifierCreator | SerializableNumericIdentifierCreator;

/**
 * Non-GTIN numeric identifier creators indexed by identifier type.
 */
export type NonGTINNumericIdentifierCreators = NonSerializableNumericIdentifierCreators & SerializableNumericIdentifierCreators;
