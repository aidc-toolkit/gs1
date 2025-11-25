import type { CharacterSetCreator } from "@aidc-toolkit/utility";
import type { IdentifierType } from "./identifier-type.js";
import type { ContentCharacterSet, IdentifierValidation, IdentifierValidator } from "./identifier-validator.js";
import type { PrefixProvider } from "./prefix-provider";
import type { PrefixType } from "./prefix-type.js";

/**
 * Identifier creator. Creates an identifier based on its definition in section 3 of the {@link
 * https://www.gs1.org/genspecs | GS1 General Specifications}.
 *
 * Keys are created based on a prefix defined in a prefix manager to which the identifier creator is bound.
 */
export interface IdentifierCreator extends IdentifierValidator {
    /**
     * Get the prefix provider to which this identifier creator is bound.
     */
    get prefixProvider(): PrefixProvider;

    /**
     * Get the prefix, equivalent to calling {@linkcode PrefixProvider.prefix | prefixProvider.prefix} for a GTIN or
     * {@linkcode PrefixProvider.gs1CompanyPrefix | prefixProvider.gs1CompanyPrefix} for all other identifier types.
     */
    get prefix(): string;

    /**
     * Get the reference length.
     */
    get referenceLength(): number;
}

/**
 * Abstract identifier creator. Implements common functionality for an identifier creator, bound to a
 * {@link PrefixProvider}.
 */
export abstract class AbstractIdentifierCreator implements IdentifierCreator {
    /**
     * Prefix provider.
     */
    private _prefixProvider!: PrefixProvider;

    /**
     * Reference length.
     */
    private _referenceLength!: number;

    /**
     * Initialize the prefix manager. This method is in lieu of a constructor due to the mixin architecture.
     *
     * @param prefixProvider
     * Prefix provider.
     *
     * @param prefix
     * Prefix within prefix manager to use to calculate reference length.
     *
     * @param checkAllowance
     * Number of characters to allow for check digit or check character pair.
     */
    protected init(prefixProvider: PrefixProvider, prefix: string, checkAllowance: number): void {
        this._prefixProvider = prefixProvider;

        // Reference length allows for prefix and optionally check digit or check character pair.
        this._referenceLength = this.length - prefix.length - checkAllowance;
    }

    abstract get identifierType(): IdentifierType;

    abstract get prefixType(): PrefixType;

    abstract get length(): number;

    abstract get referenceCharacterSet(): ContentCharacterSet;

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

    abstract validate(identifier: string, validation?: IdentifierValidation): void;
}
