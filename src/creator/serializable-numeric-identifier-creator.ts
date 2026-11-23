import type { ContentCharacterSets } from "../content-character-set.js";
import type { IdentifierTypes } from "../identifier-type.js";
import type { SerializableNumericIdentifierTypes } from "../serializable-numeric-identifier-type.js";
import type { BaseSerializableNumericIdentifierCreator } from "./base-serializable-numeric-identifier-creator.js";

/**
 * GRAI creator.
 */
export type GRAICreator = BaseSerializableNumericIdentifierCreator<typeof IdentifierTypes.GRAI, typeof ContentCharacterSets.AI82>;

/**
 * GDTI creator.
 */
export type GDTICreator = BaseSerializableNumericIdentifierCreator<typeof IdentifierTypes.GDTI, typeof ContentCharacterSets.AI82>;

/**
 * GCN creator.
 */
export type GCNCreator = BaseSerializableNumericIdentifierCreator<typeof IdentifierTypes.GCN, typeof ContentCharacterSets.Numeric>;

/**
 * Serializable numeric identifier creator. Validates both serialized and non-serialized forms of numeric identifiers
 * that support serialization.
 */
export type SerializableNumericIdentifierCreator = GRAICreator | GDTICreator | GCNCreator;

/**
 * Serializable numeric identifier creators indexed by identifier type.
 */
export interface SerializableNumericIdentifierCreators {
    /**
     * GRAI creator.
     */
    readonly [SerializableNumericIdentifierTypes.GRAI]: GRAICreator;

    /**
     * GDTI creator.
     */
    readonly [SerializableNumericIdentifierTypes.GDTI]: GDTICreator;

    /**
     * GCN creator.
     */
    readonly [SerializableNumericIdentifierTypes.GCN]: GCNCreator;
}
