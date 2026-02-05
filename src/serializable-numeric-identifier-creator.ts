// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in JSDoc.
import { mapIterable, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { MixinAbstractNonGTINNumericIdentifierCreator } from "./abstract-non-gtin-numeric-identifier-creator.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";
import { SerializableNumericIdentifierValidator } from "./serializable-numeric-identifier-validator.js";

/**
 * Serializable numeric identifier creator.
 */
export class SerializableNumericIdentifierCreator extends MixinAbstractNonGTINNumericIdentifierCreator<
    SerializableNumericIdentifierType
>(SerializableNumericIdentifierValidator) {
    /**
     * Concatenate a validated base identifier with a serial component.
     *
     * @param baseIdentifier
     * Base identifier.
     *
     * @param serialComponent
     * Serial component.
     *
     * @returns
     * Serialized identifier.
     */
    #concatenateValidated(baseIdentifier: string, serialComponent: string): string;

    /**
     * Concatenate a validated base identifier with serial components.
     *
     * @param baseIdentifier
     * Base identifier.
     *
     * @param serialComponents
     * Serial components.
     *
     * @returns
     * Serialized identifiers.
     */
    #concatenateValidated(baseIdentifier: string, serialComponents: Iterable<string>): Iterable<string>;

    // eslint-disable-next-line jsdoc/require-jsdoc -- Implementation of overloaded signatures.
    #concatenateValidated(baseIdentifier: string, serialComponentOrComponents: string | Iterable<string>): string | Iterable<string> {
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

        return typeof serialComponentOrComponents !== "object" ?
            validateAndConcatenate(serialComponentOrComponents) :
            mapIterable(serialComponentOrComponents, validateAndConcatenate);
    }

    /**
     * Create a serialized identifier with a reference based on a numeric value concatenated with a serial component.
     * The value is converted to a reference of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @param value
     * Numeric value of the reference.
     *
     * @param serialComponent
     * Serial component.
     *
     * @param sparse
     * If true, the value is mapped to a sparse sequence resistant to discovery.
     *
     * @returns
     * Serialized identifier.
     */
    createSerialized(value: number | bigint, serialComponent: string, sparse?: boolean): string;

    /**
     * Create serialized identifiers with a reference based on a numeric value concatenated with serial components. The
     * value is converted to a reference of the appropriate length using {@linkcode NUMERIC_CREATOR}.
     *
     * @param value
     * Numeric value of the reference.
     *
     * @param serialComponents
     * Serial components.
     *
     * @param sparse
     * If true, the value is mapped to a sparse sequence resistant to discovery.
     *
     * @returns
     * Serialized identifiers.
     */
    createSerialized(value: number | bigint, serialComponents: Iterable<string>, sparse?: boolean): Iterable<string>;

    // eslint-disable-next-line jsdoc/require-jsdoc -- Implementation of overloaded signatures.
    createSerialized(value: number | bigint, serialComponentOrComponents: string | Iterable<string>, sparse?: boolean): string | Iterable<string> {
        return this.#concatenateValidated(this.create(value, sparse), serialComponentOrComponents);
    }

    /**
     * Concatenate a base identifier with a serial component.
     *
     * @param baseIdentifier
     * Base identifier.
     *
     * @param serialComponent
     * Serial component.
     *
     * @returns
     * Serialized identifier.
     */
    concatenate(baseIdentifier: string, serialComponent: string): string;

    /**
     * Concatenate a base identifier with serial components.
     *
     * @param baseIdentifier
     * Base identifier.
     *
     * @param serialComponents
     * Serial components.
     *
     * @returns
     * Serialized identifiers.
     */
    concatenate(baseIdentifier: string, serialComponents: Iterable<string>): Iterable<string>;

    // eslint-disable-next-line jsdoc/require-jsdoc -- Implementation of overloaded signatures.
    concatenate(baseIdentifier: string, serialComponentOrComponents: string | Iterable<string>): string | Iterable<string> {
        this.validate(baseIdentifier);

        return this.#concatenateValidated(baseIdentifier, serialComponentOrComponents);
    }
}
