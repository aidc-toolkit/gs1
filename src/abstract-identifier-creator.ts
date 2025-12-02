import type { CharacterSetCreator } from "@aidc-toolkit/utility";
import type { IdentifierCreator } from "./identifier-creator";
import type { IdentifierType } from "./identifier-type";
import type { ContentCharacterSet, IdentifierValidation } from "./identifier-validator";
import type { PrefixProvider } from "./prefix-provider";
import type { PrefixType } from "./prefix-type";

/**
 * Abstract identifier creator. Implements common functionality for an identifier creator, bound to a
 * {@link PrefixProvider}.
 */
export abstract class AbstractIdentifierCreator<TIdentifierType extends IdentifierType, TIdentifierValidation extends IdentifierValidation> implements IdentifierCreator<TIdentifierType, TIdentifierValidation> {
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
    abstract get identifierType(): TIdentifierType;

    /**
     * @inheritDoc
     */
    abstract get prefixType(): PrefixType;

    /**
     * @inheritDoc
     */
    abstract get length(): number;

    /**
     * @inheritDoc
     */
    abstract get referenceCharacterSet(): ContentCharacterSet;

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
    abstract validate(identifier: string, validation?: IdentifierValidation): void;
}
