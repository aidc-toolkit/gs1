import { GTINCreator } from "./gtin-creator.js";
import type { GTINBaseLength } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import type { IdentifierCreator } from "./identifier-creator.js";
import {
    type IdentifierTypeExtension,
    isGTINExtension,
    isNonGTINNumericIdentifierExtension,
    isNonNumericIdentifierExtension,
    isNonSerializableNumericIdentifierExtension,
    isNumericIdentifierExtension,
    isSerializableNumericIdentifierExtension
} from "./identifier-extension.js";
import type { IdentifierType } from "./identifier-type.js";
import type { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";
import { NonNumericIdentifierCreator } from "./non-numeric-identifier-creator.js";
import { NonSerializableNumericIdentifierCreator } from "./non-serializable-numeric-identifier-creator.js";
import type { NumericIdentifierCreator } from "./numeric-identifier-creator.js";
import type { PrefixProvider } from "./prefix-provider.js";
import { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator.js";

/**
 * Identifier creator type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierTypeCreator<TIdentifierType extends IdentifierType> = IdentifierTypeExtension<
    TIdentifierType,
    IdentifierCreator,
    NumericIdentifierCreator,
    GTINCreator,
    NonGTINNumericIdentifierCreator,
    NonSerializableNumericIdentifierCreator,
    SerializableNumericIdentifierCreator,
    NonNumericIdentifierCreator
>;

/**
 * Identifier creators entry type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierCreatorsEntry<TIdentifierType extends IdentifierType> = IdentifierTypeCreator<TIdentifierType>;

/**
 * Identifier creators record type.
 */
export type IdentifierCreatorsRecord = {
    [TIdentifierType in IdentifierType]: IdentifierCreatorsEntry<TIdentifierType>;
};

/**
 * GTIN creator constructor type.
 */
export type GTINCreatorConstructor =
    new (prefixProvider: PrefixProvider, gtinBaseLength: GTINBaseLength) => GTINCreator;

/**
 * Non-GTIN creator constructor type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type NonGTINCreatorConstructor<TIdentifierType extends Exclude<IdentifierType, GTINType>> =
    new (prefixProvider: PrefixProvider, identifierType: TIdentifierType) => IdentifierCreatorsRecord[TIdentifierType];

/**
 * Identifier creator constructors entry type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierCreatorConstructorsEntry<TIdentifierType extends IdentifierType> = TIdentifierType extends GTINType ?
    GTINCreatorConstructor :
    NonGTINCreatorConstructor<Exclude<TIdentifierType, GTINType>>;

/**
 * Identifier creator constructors record type.
 */
export type IdentifierCreatorConstructorsRecord = {
    readonly [TIdentifierType in IdentifierType]: IdentifierCreatorConstructorsEntry<TIdentifierType>;
};

export const IdentifierCreatorConstructors: IdentifierCreatorConstructorsRecord = {
    GTIN: GTINCreator,
    GLN: NonSerializableNumericIdentifierCreator,
    SSCC: NonSerializableNumericIdentifierCreator,
    GRAI: SerializableNumericIdentifierCreator,
    GIAI: NonNumericIdentifierCreator,
    GSRN: NonSerializableNumericIdentifierCreator,
    GDTI: SerializableNumericIdentifierCreator,
    GINC: NonNumericIdentifierCreator,
    GSIN: NonSerializableNumericIdentifierCreator,
    GCN: SerializableNumericIdentifierCreator,
    CPID: NonNumericIdentifierCreator,
    GMN: NonNumericIdentifierCreator
};

/**
 * Determine if identifier creator is a numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a numeric identifier creator.
 */
export function isNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NumericIdentifierCreator {
    return isNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a GTIN creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a GTIN creator.
 */
export function isGTINCreator(identifierCreator: IdentifierCreator): identifierCreator is GTINCreator {
    return isGTINExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a non-GTIN numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a non-GTIN numeric identifier creator.
 */
export function isNonGTINNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NonGTINNumericIdentifierCreator {
    return isNonGTINNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a non-serializable numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a non-serializable numeric identifier creator.
 */
export function isNonSerializableNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NonSerializableNumericIdentifierCreator {
    return isNonSerializableNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a serializable numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a serializable numeric identifier creator.
 */
export function isSerializableNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is SerializableNumericIdentifierCreator {
    return isSerializableNumericIdentifierExtension(identifierCreator);
}

/**
 * Determine if identifier creator is a non-numeric identifier creator.
 *
 * @param identifierCreator
 * Identifier creator.
 *
 * @returns
 * True if identifier creator is a non-numeric identifier creator.
 */
export function isNonNumericIdentifierCreator(identifierCreator: IdentifierCreator): identifierCreator is NonNumericIdentifierCreator {
    return isNonNumericIdentifierExtension(identifierCreator);
}
