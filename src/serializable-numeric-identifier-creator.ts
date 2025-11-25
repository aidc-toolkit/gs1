import { mapIterable, type TransformerInput, type TransformerOutput } from "@aidc-toolkit/utility";
import { Mixin } from "ts-mixer";
import type { IdentifierType } from "./identifier-type.js";
import type { ContentCharacterSet } from "./identifier-validator.js";
import { AbstractNumericIdentifierCreator } from "./numeric-identifier-creator.js";
import type { PrefixProvider } from "./prefix-provider";
import { SerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator.js";

/**
 * Serializable numeric identifier creator.
 */
export class SerializableNumericIdentifierCreator extends Mixin(SerializableNumericIdentifierValidator, AbstractNumericIdentifierCreator) {
    /**
     * Constructor. Typically called internally by a prefix manager but may be called by other code with another prefix
     * provider type.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param length
     * Length.
     *
     * @param serialComponentLength
     * Serial component length.
     *
     * @param serialComponentCharacterSet
     * Serial component character set.
     */
    constructor(prefixProvider: PrefixProvider, identifierType: IdentifierType, length: number, serialComponentLength: number, serialComponentCharacterSet: ContentCharacterSet) {
        super(identifierType, length, serialComponentLength, serialComponentCharacterSet);

        this.init(prefixProvider, prefixProvider.gs1CompanyPrefix);
    }

    /**
     * Concatenate a validated base identifier with serial component(s).
     *
     * @template TTransformerInput
     * Transformer input type.
     *
     * @param baseIdentifier
     * Base identifier.
     *
     * @param serialComponentOrComponents
     * Serial component(s).
     *
     * @returns
     * Serialized identifier(s).
     */
    private concatenateValidated<TTransformerInput extends TransformerInput<string>>(baseIdentifier: string, serialComponentOrComponents: TTransformerInput): TransformerOutput<TTransformerInput, string> {
        // TODO Refactor type when https://github.com/microsoft/TypeScript/pull/56941 released.
        let result: string | Iterable<string>;

        const serialComponentCreator = this.serialComponentCreator;
        const serialComponentValidation = this.serialComponentValidation;

        /**
         * Validate a serial component and concatenate it to the base identifier.
         *
         * @param serialComponent
         * Serial component.
         *
         * @returns
         * Serialized identifier.
         */
        function validateAndConcatenate(serialComponent: string): string {
            serialComponentCreator.validate(serialComponent, serialComponentValidation);

            return baseIdentifier + serialComponent;
        }

        if (typeof serialComponentOrComponents !== "object") {
            result = validateAndConcatenate(serialComponentOrComponents);
        } else {
            result = mapIterable(serialComponentOrComponents, validateAndConcatenate);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type determination is handled above.
        return result as TransformerOutput<TTransformerInput, string>;
    }

    /**
     * Create serialized identifier(s) with a reference based on a numeric value concatenated with serial
     * component(s). The value is converted to a reference of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @template TTransformerInput
     * Transformer input type.
     *
     * @param value
     * Numeric value of the reference.
     *
     * @param serialComponentOrComponents
     * Serial component(s).
     *
     * @param sparse
     * If true, the value is mapped to a sparse sequence resistant to discovery. Default is false.
     *
     * @returns
     * Serialized identifiers.
     */
    createSerialized<TTransformerInput extends TransformerInput<string>>(value: number, serialComponentOrComponents: TTransformerInput, sparse?: boolean): TransformerOutput<TTransformerInput, string> {
        return this.concatenateValidated(this.create(value, sparse), serialComponentOrComponents);
    }

    /**
     * Concatenate a base identifier with serial component(s).
     *
     * @template TTransformerInput
     * Transformer input type.
     *
     * @param baseIdentifier
     * Base identifier.
     *
     * @param serialComponentOrComponents
     * Serial component(s).
     *
     * @returns
     * Serialized identifier(s).
     */
    concatenate<TTransformerInput extends TransformerInput<string>>(baseIdentifier: string, serialComponentOrComponents: TTransformerInput): TransformerOutput<TTransformerInput, string> {
        this.validate(baseIdentifier);

        return this.concatenateValidated(baseIdentifier, serialComponentOrComponents);
    }
}
