import {
    type NonSerializableNumericIdentifierDescriptor,
    NonSerializableNumericIdentifierDescriptors
} from "../descriptor/index.js";
import {
    ConcreteNonSerializableNumericIdentifierValidator
} from "../validator/concrete-non-serializable-numeric-identifier-validator.js";
import type { NonSerializableNumericIdentifierValidator, PrefixProvider } from "../validator/index.js";
import type {
    BaseNonSerializableNumericIdentifierCreator
} from "./base-non-serializable-numeric-identifier-creator.js";
import { MixinAbstractNonGTINNumericIdentifierCreator } from "./mixin-abstract-non-gtin-numeric-identifier-creator.js";

/**
 * Concrete non-serializable numeric identifier creator.
 */
export class ConcreteNonSerializableNumericIdentifierCreator<
    TIdentifierDescriptor extends NonSerializableNumericIdentifierDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & NonSerializableNumericIdentifierValidator
// @ts-expect-error -- https://github.com/microsoft/TypeScript/issues/24122
> extends MixinAbstractNonGTINNumericIdentifierCreator<TIdentifierDescriptor, TIdentifierValidator, ConcreteNonSerializableNumericIdentifierValidator<TIdentifierDescriptor>>(ConcreteNonSerializableNumericIdentifierValidator)
    implements BaseNonSerializableNumericIdentifierCreator<TIdentifierValidator["identifierType"], TIdentifierValidator["leaderType"]> {
    /**
     * Constructor.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param identifierType
     * Identifier type.
     */
    constructor(prefixProvider: PrefixProvider, identifierType: TIdentifierValidator["identifierType"]) {
        super(prefixProvider, NonSerializableNumericIdentifierDescriptors[identifierType]);
    }
}
