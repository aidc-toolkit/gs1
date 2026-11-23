import type { CharacterSetCreator, StringValidation, StringValidator } from "@aidc-toolkit/utility";
import type { ContentCharacterSet } from "../content-character-set.js";
import type { BaseIdentifierDescriptor } from "../descriptor/base-identifier-descriptor.js";
import type { IdentifierType } from "../identifier-type.js";
import type { PrefixType } from "../prefix-type.js";

/**
 * Identifier validation parameters.
 */
export interface IdentifierValidation extends StringValidation {
}

/**
 * Base identifier validator.
 */
export interface BaseIdentifierValidator<
    TIdentifierType extends IdentifierType,
    TPrefixType extends PrefixType,
    TLength extends number,
    TReferenceCharacterSet extends ContentCharacterSet,
    TIdentifierValidation extends IdentifierValidation
> extends BaseIdentifierDescriptor<TIdentifierType, TPrefixType, TLength, TReferenceCharacterSet>, StringValidator<TIdentifierValidation> {
    /**
     * Reference creator.
     */
    readonly referenceCreator: CharacterSetCreator;
}
