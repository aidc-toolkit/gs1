import type { IdentifierTypes } from "./identifier-type.js";

/**
 * Serializable numeric identifier type.
 */
export type SerializableNumericIdentifierType =
    typeof IdentifierTypes.GRAI |
    typeof IdentifierTypes.GDTI |
    typeof IdentifierTypes.GCN;
