import type { GTINDescriptor } from "./gtin-descriptor.js";
import { type GTINType, GTINTypes } from "./gtin-type.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import type { IdentifierType } from "./identifier-type.js";
import type { NonGTINNumericIdentifierDescriptor } from "./non-gtin-numeric-identifier-descriptor.js";
import {
    type NonGTINNumericIdentifierType,
    NonGTINNumericIdentifierTypes
} from "./non-gtin-numeric-identifier-type.js";
import type { NonNumericIdentifierDescriptor } from "./non-numeric-identifier-descriptor.js";
import { type NonNumericIdentifierType, NonNumericIdentifierTypes } from "./non-numeric-identifier-type.js";
import type { NonSerializableNumericIdentifierDescriptor } from "./non-serializable-numeric-identifier-descriptor.js";
import {
    type NonSerializableNumericIdentifierType,
    NonSerializableNumericIdentifierTypes
} from "./non-serializable-numeric-identifier-type.js";
import type { NumericIdentifierDescriptor } from "./numeric-identifier-descriptor.js";
import { type NumericIdentifierType, NumericIdentifierTypes } from "./numeric-identifier-type.js";
import type { SerializableNumericIdentifierDescriptor } from "./serializable-numeric-identifier-descriptor.js";
import {
    type SerializableNumericIdentifierType,
    SerializableNumericIdentifierTypes
} from "./serializable-numeric-identifier-type.js";

/**
 * Identifier extension type based on identifier type type.
 *
 * @template TIdentifierType
 * Identifier type type.
 */
export type IdentifierTypeExtension<
    TIdentifierType extends IdentifierType,
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor,
    TGTINExtension extends TNumericIdentifierExtension & GTINDescriptor,
    TNonGTINNumericIdentifierExtension extends TNumericIdentifierExtension & NonGTINNumericIdentifierDescriptor,
    TNonSerializableNumericIdentifierExtension extends TNonGTINNumericIdentifierExtension & NonSerializableNumericIdentifierDescriptor,
    TSerializableNumericIdentifierExtension extends TNonGTINNumericIdentifierExtension & SerializableNumericIdentifierDescriptor,
    TNonNumericIdentifierExtension extends TIdentifierExtension & NonNumericIdentifierDescriptor
> =
    TIdentifierType extends NumericIdentifierType ?
        TIdentifierType extends GTINType ?
            TGTINExtension :
            TIdentifierType extends NonGTINNumericIdentifierType ?
                TIdentifierType extends NonSerializableNumericIdentifierType ?
                    TNonSerializableNumericIdentifierExtension :
                    TIdentifierType extends SerializableNumericIdentifierType ?
                        TSerializableNumericIdentifierExtension :
                        TNonGTINNumericIdentifierExtension :
                TNumericIdentifierExtension :
        TIdentifierType extends NonNumericIdentifierType ?
            TNonNumericIdentifierExtension :
            TIdentifierExtension;

/**
 * Determine if identifier extension is a numeric identifier extension.
 *
 * @param identifierDescriptor
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a numeric identifier extension.
 */
export function isNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor
>(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is TNumericIdentifierExtension {
    return identifierDescriptor.identifierType in NumericIdentifierTypes;
}

/**
 * Determine if identifier extension is a GTIN extension.
 *
 * @param identifierDescriptor
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a GTIN extension.
 */
export function isGTINExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor,
    TGTINExtension extends TNumericIdentifierExtension & GTINDescriptor
>(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is TGTINExtension {
    return identifierDescriptor.identifierType in GTINTypes;
}

/**
 * Determine if identifier extension is a non-GTIN numeric identifier extension.
 *
 * @param identifierDescriptor
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a non-GTIN numeric identifier extension.
 */
export function isNonGTINNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNumericIdentifierExtension extends TIdentifierExtension & NumericIdentifierDescriptor,
    TNonGTINNumericIdentifierExtension extends TNumericIdentifierExtension & NonGTINNumericIdentifierDescriptor
>(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is TNonGTINNumericIdentifierExtension {
    return identifierDescriptor.identifierType in NonGTINNumericIdentifierTypes;
}

/**
 * Determine if identifier extension is a non-serializable numeric identifier extension.
 *
 * @param identifierDescriptor
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
>(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is TNonSerializableNumericIdentifierExtension {
    return identifierDescriptor.identifierType in NonSerializableNumericIdentifierTypes;
}

/**
 * Determine if identifier extension is a serializable numeric identifier extension.
 *
 * @param identifierDescriptor
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
>(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is TSerializableNumericIdentifierExtension {
    return identifierDescriptor.identifierType in SerializableNumericIdentifierTypes;
}

/**
 * Determine if identifier extension is a non-numeric identifier extension.
 *
 * @param identifierDescriptor
 * Identifier extension.
 *
 * @returns
 * True if identifier extension is a non-numeric identifier extension.
 */
export function isNonNumericIdentifierExtension<
    TIdentifierExtension extends IdentifierDescriptor,
    TNonNumericIdentifierExtension extends TIdentifierExtension & NonNumericIdentifierDescriptor
>(identifierDescriptor: IdentifierDescriptor): identifierDescriptor is TNonNumericIdentifierExtension {
    return identifierDescriptor.identifierType in NonNumericIdentifierTypes;
}
