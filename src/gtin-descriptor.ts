import type { IdentifierTypes } from "./identifier-type.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import type { LeaderTypes } from "./numeric-identifier-type.js";

/**
 * GTIN descriptor.
 */
export interface GTINDescriptor extends NumericIdentifierDescriptor {
    /**
     * @inheritDoc
     */
    readonly identifierType: typeof IdentifierTypes.GTIN;

    /**
     * @inheritDoc
     */
    readonly leaderType: typeof LeaderTypes.IndicatorDigit;
}
