import type { GTINBaseLength } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import type { LeaderTypes } from "./leader-type.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";

/**
 * GTIN descriptor.
 */
export interface GTINDescriptor extends NumericIdentifierDescriptor {
    /**
     * @inheritDoc
     */
    readonly identifierType: GTINType;

    /**
     * @inheritDoc
     */
    readonly length: GTINBaseLength;

    /**
     * @inheritDoc
     */
    readonly leaderType: typeof LeaderTypes.IndicatorDigit;
}
