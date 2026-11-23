import type { IdentifierTypes } from "../identifier-type.js";
import type { LeaderTypes } from "../leader-type.js";
import type { NonSerializableNumericIdentifierTypes } from "../non-serializable-numeric-identifier-type.js";
import type {
    BaseNonSerializableNumericIdentifierCreator
} from "./base-non-serializable-numeric-identifier-creator.js";

/**
 * GLN creator.
 */
export type GLNCreator = BaseNonSerializableNumericIdentifierCreator<typeof IdentifierTypes.GLN, typeof LeaderTypes.None>;

/**
 * SSCC creator.
 */
export type SSCCCreator = BaseNonSerializableNumericIdentifierCreator<typeof IdentifierTypes.SSCC, typeof LeaderTypes.ExtensionDigit>;

/**
 * GSRN creator.
 */
export type GSRNCreator = BaseNonSerializableNumericIdentifierCreator<typeof IdentifierTypes.GSRN, typeof LeaderTypes.None>;

/**
 * GSIN creator.
 */
export type GSINCreator = BaseNonSerializableNumericIdentifierCreator<typeof IdentifierTypes.GSIN, typeof LeaderTypes.None>;

/**
 * Non-serializable numeric identifier creator.
 */
export type NonSerializableNumericIdentifierCreator = GLNCreator | SSCCCreator | GSRNCreator | GSINCreator;

/**
 * Non-serializable numeric identifier creators indexed by identifier type.
 */
export interface NonSerializableNumericIdentifierCreators {
    /**
     * GLN creator.
     */
    readonly [NonSerializableNumericIdentifierTypes.GLN]: GLNCreator;

    /**
     * SSCC creator.
     */
    readonly [NonSerializableNumericIdentifierTypes.SSCC]: SSCCCreator;

    /**
     * GSRN creator.
     */
    readonly [NonSerializableNumericIdentifierTypes.GSRN]: GSRNCreator;

    /**
     * GSIN creator.
     */
    readonly [NonSerializableNumericIdentifierTypes.GSIN]: GSINCreator;
}
