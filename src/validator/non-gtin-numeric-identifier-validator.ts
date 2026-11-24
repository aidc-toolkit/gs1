import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import {
    type NonSerializableNumericIdentifierValidator,
    NonSerializableNumericIdentifierValidators
} from "./non-serializable-numeric-identifier-validator.js";
import {
    type SerializableNumericIdentifierValidator,
    SerializableNumericIdentifierValidators
} from "./serializable-numeric-identifier-validator.js";

/**
 * Non-GTIN numeric identifier validator.
 */
export type NonGTINNumericIdentifierValidator = NonSerializableNumericIdentifierValidator | SerializableNumericIdentifierValidator;

/**
 * Non-GTIN numeric identifier validators indexed by identifier type.
 */
export const NonGTINNumericIdentifierValidators = {
    ...NonSerializableNumericIdentifierValidators,
    ...SerializableNumericIdentifierValidators
} as const;

/**
 * Non-GTIN numeric identifier validator by identifier type.
 */
export type NonGTINNumericIdentifierTypeValidator<TIdentifierType extends NonGTINNumericIdentifierType> =
    typeof NonGTINNumericIdentifierValidators[TIdentifierType];
