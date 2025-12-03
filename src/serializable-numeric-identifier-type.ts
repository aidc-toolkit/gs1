import type { IdentifierTypes } from "./identifier-type";

/**
 * Serializable numeric identifier type.
 */
export type SerializableNumericIdentifierType =
    typeof IdentifierTypes.GRAI |
    typeof IdentifierTypes.GDTI |
    typeof IdentifierTypes.GCN;
