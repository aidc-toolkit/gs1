import type { IdentifierTypes } from "./identifier-type";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor";
import type { LeaderTypes } from "./numeric-identifier-type";

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
