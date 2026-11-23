import type { NonGTINNumericIdentifierDescriptor } from "../descriptor/index.js";
import { AbstractNumericIdentifierValidator } from "./abstract-numeric-identifier-validator.js";
import type { BaseNonGTINNumericIdentifierValidator } from "./base-non-gtin-numeric-identifier-validator.js";

/**
 * Non-GTIN numeric identifier validator.
 */
export abstract class AbstractNonGTINNumericIdentifierValidator<
    TIdentifierDescriptor extends NonGTINNumericIdentifierDescriptor
> extends AbstractNumericIdentifierValidator<TIdentifierDescriptor> implements BaseNonGTINNumericIdentifierValidator<
    TIdentifierDescriptor["identifierType"],
    TIdentifierDescriptor["leaderType"]
> {
}
