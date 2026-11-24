import type { ContentCharacterSets } from "../content-character-set.js";
import { GCN_DESCRIPTOR, GDTI_DESCRIPTOR, GRAI_DESCRIPTOR } from "../descriptor/index.js";
import {
    type SerializableNumericIdentifierType,
    SerializableNumericIdentifierTypes
} from "../serializable-numeric-identifier-type.js";
import type {
    BaseSerializableNumericIdentifierValidator,
    SerializableNumericIdentifierSplit
} from "./base-serializable-numeric-identifier-validator.js";
import {
    ConcreteSerializableNumericIdentifierValidator
} from "./concrete-serializable-numeric-identifier-validator.js";

export type { SerializableNumericIdentifierSplit };

/**
 * GRAI validator.
 */
export type GRAIValidator = BaseSerializableNumericIdentifierValidator<typeof SerializableNumericIdentifierTypes.GRAI, typeof ContentCharacterSets.AI82>;

/**
 * GRAI validator.
 */
export const GRAI_VALIDATOR: GRAIValidator = new ConcreteSerializableNumericIdentifierValidator(GRAI_DESCRIPTOR);

/**
 * GDTI validator.
 */
export type GDTIValidator = BaseSerializableNumericIdentifierValidator<typeof SerializableNumericIdentifierTypes.GDTI, typeof ContentCharacterSets.AI82>;

/**
 * GDTI validator.
 */
export const GDTI_VALIDATOR: GDTIValidator = new ConcreteSerializableNumericIdentifierValidator(GDTI_DESCRIPTOR);

/**
 * GCN validator.
 */
export type GCNValidator = BaseSerializableNumericIdentifierValidator<typeof SerializableNumericIdentifierTypes.GCN, typeof ContentCharacterSets.Numeric>;

/**
 * GCN validator.
 */
export const GCN_VALIDATOR: GCNValidator = new ConcreteSerializableNumericIdentifierValidator(GCN_DESCRIPTOR);

/**
 * Serializable numeric identifier validator. Validates both serialized and non-serialized forms of numeric identifiers
 * that support serialization.
 */
export type SerializableNumericIdentifierValidator = GRAIValidator | GDTIValidator | GCNValidator;

/**
 * Serializable numeric identifier validators indexed by identifier type.
 */
export const SerializableNumericIdentifierValidators = {
    [SerializableNumericIdentifierTypes.GRAI]: GRAI_VALIDATOR,
    [SerializableNumericIdentifierTypes.GDTI]: GDTI_VALIDATOR,
    [SerializableNumericIdentifierTypes.GCN]: GCN_VALIDATOR
} as const;

/**
 * Serializable numeric identifier validator by identifier type.
 */
export type SerializableNumericIdentifierTypeValidator<TIdentifierType extends SerializableNumericIdentifierType> =
    typeof SerializableNumericIdentifierValidators[TIdentifierType];
