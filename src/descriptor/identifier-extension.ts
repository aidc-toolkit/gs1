import { isGTINType } from "../gtin-type.js";
import { isNonGTINNumericIdentifierType } from "../non-gtin-numeric-identifier-type.js";
import { isNonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import { isNonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import { isNumericIdentifierType } from "../numeric-identifier-type.js";
import { isSerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import type { GTINDescriptor } from "./gtin-descriptor.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import type { NonNumericIdentifierDescriptor } from "./non-numeric-identifier-descriptor.js";
import type { NonSerializableNumericIdentifierDescriptor } from "./non-serializable-numeric-identifier-descriptor.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";

/**
 * Determine if identifier extension is a numeric identifier extension.
 *
 * @param identifierExtension
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a numeric identifier extension.
 */
export function isNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor
>(identifierExtension: TIdentifierExtension): identifierExtension is TNumericIdentifierExtension {
    return isNumericIdentifierType(identifierExtension.identifierType);
}

/**
 * Determine if identifier extension is a GTIN extension.
 *
 * @param identifierExtension
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a GTIN extension.
 */
export function isGTINExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor,
    TGTINExtension extends TNumericIdentifierExtension & GTINDescriptor
>(identifierExtension: TIdentifierExtension): identifierExtension is TGTINExtension {
    return isGTINType(identifierExtension.identifierType);
}

/**
 * Determine if identifier extension is a non-GTIN numeric identifier extension.
 *
 * @param identifierExtension
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a non-GTIN numeric identifier extension.
 */
export function isNonGTINNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor,
    TNonGTINNumericIdentifierExtension extends TNumericIdentifierExtension & NonGTINNumericIdentifierDescriptor
>(identifierExtension: TIdentifierExtension): identifierExtension is TNonGTINNumericIdentifierExtension {
    return isNonGTINNumericIdentifierType(identifierExtension.identifierType);
}

/**
 * Determine if identifier extension is a non-serializable numeric identifier extension.
 *
 * @param identifierExtension
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a non-serializable numeric identifier extension.
 */
export function isNonSerializableNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor,
    TNonGTINNumericIdentifierExtension extends TNumericIdentifierExtension & NonGTINNumericIdentifierDescriptor,
    TNonSerializableNumericIdentifierExtension extends TNonGTINNumericIdentifierExtension & NonSerializableNumericIdentifierDescriptor
>(identifierExtension: TIdentifierExtension): identifierExtension is TNonSerializableNumericIdentifierExtension {
    return isNonSerializableNumericIdentifierType(identifierExtension.identifierType);
}

/**
 * Determine if identifier extension is a serializable numeric identifier extension.
 *
 * @param identifierExtension
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a serializable numeric identifier extension.
 */
export function isSerializableNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor,
    TNonGTINNumericIdentifierExtension extends TNumericIdentifierExtension & NonGTINNumericIdentifierDescriptor,
    TSerializableNumericIdentifierExtension extends TNonGTINNumericIdentifierExtension & SerializableNumericIdentifierDescriptor
>(identifierExtension: TIdentifierExtension): identifierExtension is TSerializableNumericIdentifierExtension {
    return isSerializableNumericIdentifierType(identifierExtension.identifierType);
}

/**
 * Determine if identifier extension is a non-numeric identifier extension.
 *
 * @param identifierExtension
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a non-numeric identifier extension.
 */
export function isNonNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNonNumericIdentifierExtension extends TIdentifierExtension & NonNumericIdentifierDescriptor
>(identifierExtension: TIdentifierExtension): identifierExtension is TNonNumericIdentifierExtension {
    return isNonNumericIdentifierType(identifierExtension.identifierType);
}
