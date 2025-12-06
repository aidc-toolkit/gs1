import type { IdentifierValidation, IdentifierValidator } from "./identifier-validator.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";

/**
 * Numeric identifier validation parameters.
 */
export interface NumericIdentifierValidation extends IdentifierValidation {
    /**
     * Position offset within a larger string. Some numeric identifier types have the prefix offset by one.
     */
    positionOffset?: number | undefined;
}

/**
 * Numeric identifier validator.
 *
 * @template TNumericIdentifierDescriptor
 * Numeric identifier descriptor type.
 */
export interface NumericIdentifierValidator<TNumericIdentifierDescriptor extends NumericIdentifierDescriptor = NumericIdentifierDescriptor> extends IdentifierValidator<TNumericIdentifierDescriptor, NumericIdentifierValidation> {
    /**
     * Get the leader type.
     */
    get leaderType(): TNumericIdentifierDescriptor["leaderType"];
}
