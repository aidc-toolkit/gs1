import type { CharacterSetCreator } from "@aidc-toolkit/utility";
import type { IdentifierCreator } from "./identifier-creator.js";
import type { IdentifierDescriptor } from "./identifier-descriptor.js";
import type { IdentifierValidation } from "./identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider.js";

/**
 * Abstract identifier creator. Implements common functionality for an identifier creator, bound to a {@link
 * PrefixProvider | prefix provider}.
 *
 * @template TIdentifierDescriptor
 * Identifier descriptor type.
 *
 * @template TIdentifierValidation
 * Identifier validation type.
 */
export abstract class AbstractIdentifierCreator<TIdentifierDescriptor extends IdentifierDescriptor, TIdentifierValidation extends IdentifierValidation> implements IdentifierCreator<TIdentifierDescriptor, TIdentifierValidation> {
    /**
     * Prefix provider.
     */
    private _prefixProvider!: PrefixProvider;

    /**
     * Reference length.
     */
    private _referenceLength!: number;

    /**
     * Initialize the prefix provider. This method is in lieu of a constructor due to the mixin architecture.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param prefix
     * Prefix within prefix provider to use to calculate reference length.
     *
     * @param checkAllowance
     * Number of characters to allow for check digit or check character pair.
     */
    protected init(prefixProvider: PrefixProvider, prefix: string, checkAllowance: number): void {
        this._prefixProvider = prefixProvider;

        // Reference length allows for prefix and optionally check digit or check character pair.
        this._referenceLength = this.length - prefix.length - checkAllowance;
    }

    /**
     * @inheritDoc
     */
    abstract get identifierType(): TIdentifierDescriptor["identifierType"];

    /**
     * @inheritDoc
     */
    abstract get prefixType(): TIdentifierDescriptor["prefixType"];

    /**
     * @inheritDoc
     */
    abstract get length(): number;

    /**
     * @inheritDoc
     */
    abstract get referenceCharacterSet(): TIdentifierDescriptor["referenceCharacterSet"];

    /**
     * @inheritDoc
     */
    abstract get referenceCreator(): CharacterSetCreator;

    /**
     * @inheritDoc
     */
    get prefixProvider(): PrefixProvider {
        return this._prefixProvider;
    }

    /**
     * @inheritDoc
     */
    get prefix(): string {
        return this.prefixProvider.gs1CompanyPrefix;
    }

    /**
     * @inheritDoc
     */
    get referenceLength(): number {
        return this._referenceLength;
    }

    /**
     * @inheritDoc
     */
    abstract validate(identifier: string, validation?: TIdentifierValidation): void;
}
