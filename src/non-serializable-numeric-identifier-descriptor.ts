import type { LeaderTypes } from "./leader-type.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";

/**
 * Non-serializable numeric identifier descriptor.
 */
export interface NonSerializableNumericIdentifierDescriptor extends NonGTINNumericIdentifierDescriptor {
    /**
     * @inheritDoc
     */
    readonly leaderType: typeof LeaderTypes.None | typeof LeaderTypes.ExtensionDigit;
}
