import type { NonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import type { NonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import type { SerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import {
    type NonSerializableNumericIdentifierTypeValidator,
    type NonSerializableNumericIdentifierValidator,
    NonSerializableNumericIdentifierValidators
} from "./non-serializable-numeric-identifier-validator.js";
import {
    type SerializableNumericIdentifierTypeValidator,
    type SerializableNumericIdentifierValidator,
    SerializableNumericIdentifierValidators
} from "./serializable-numeric-identifier-validator.js";

/**
 * Non-GTIN numeric identifier validator.
 */
export type NonGTINNumericIdentifierValidator = NonSerializableNumericIdentifierValidator | SerializableNumericIdentifierValidator;

/**
 * Non-GTIN numeric identifier validator by identifier type.
 */
export type NonGTINNumericIdentifierTypeValidator<TIdentifierType extends NonGTINNumericIdentifierType> =
    TIdentifierType extends NonSerializableNumericIdentifierType ?
        NonSerializableNumericIdentifierTypeValidator<TIdentifierType> :
        TIdentifierType extends SerializableNumericIdentifierType ?
            SerializableNumericIdentifierTypeValidator<TIdentifierType> :
            never;

/**
 * Non-GTIN numeric identifier validators indexed by identifier type.
 */
export const NonGTINNumericIdentifierValidators = {
    ...NonSerializableNumericIdentifierValidators,
    ...SerializableNumericIdentifierValidators
} as const;
