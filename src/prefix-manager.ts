import { type IdentifierCreatorsRecord, isNumericIdentifierCreator } from "./creators.js";
import { GTINCreator } from "./gtin-creator.js";
import { GTIN_BASE_TYPES } from "./gtin-type.js";
import type { IdentifierCreator } from "./identifier-creator.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import { i18nextGS1 } from "./locale/i18n.js";
import { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator.js";
import type { NonGTINNumericIdentifierType } from "./non-gtin-numeric-identifier-type.js";
import { NonNumericIdentifierCreator } from "./non-numeric-identifier-creator.js";
import type { NonNumericIdentifierType } from "./non-numeric-identifier-type.js";
import type { NumericIdentifierType } from "./numeric-identifier-type.js";
import type { PrefixProvider } from "./prefix-provider.js";
import { type PrefixType, PrefixTypes } from "./prefix-type.js";
import { PrefixValidator } from "./prefix-validator.js";
import { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator.js";
import type { SerializableNumericIdentifierType } from "./serializable-numeric-identifier-type.js";

/**
 * Prefix manager. This is the core class for identifier creation.
 *
 * A prefix manager may be constructed for any {@link PrefixType | prefix type}. Construction may be done directly or
 * via the static {@linkcode PrefixManager.get | get()} method, which allows for caching and reuse. As most applications
 * work with a limited number of prefixes for creating identifiers, caching and reuse may be a more efficient option.
 *
 * The prefix type and prefix are normalized before the prefix manager is constructed, so they may not match the input
 * values. For example, the GS1 Company Prefix 0614141 is equivalent to U.P.C. Company Prefix 614141; both result in a
 * prefix manager with prefix type equal to {@linkcode PrefixTypes.UPCCompanyPrefix} and prefix equal to "614141".
 *
 * To support the creation of sparse identifiers, a prefix manager maintains a {@link tweakFactor | tweak factor} which
 * is used, along with a type-specific multiplier, as the tweak when creating numeric identifiers. The default tweak
 * factor is the numeric value of the GS1 Company Prefix representation of the prefix preceded by '1' to ensure
 * uniqueness (i.e., so that prefixes 0 N1 N2 N3... and N1 N2 N3... produce different tweak factors). This is usually
 * sufficient for obfuscation, but as the sparse creation algorithm is reversible and as the GS1 Company Prefix is
 * discoverable via {@link https://www.gs1.org/services/verified-by-gs1 | Verified by GS1}, a user-defined tweak factor
 * should be used if a higher degree of obfuscation is required. When using a tweak factor other than the default, care
 * should be taken to restore it when resuming the application. A tweak factor of 0 creates a straight sequence.
 */
export class PrefixManager implements PrefixProvider {
    /**
     * Cached prefix managers, keyed by GS1 Company Prefix.
     */
    static readonly #PREFIX_MANAGERS_MAP = new Map<string, PrefixManager>();

    /**
     * Creator tweak factors. Different numeric identifier types have different tweak factors so that sparse creation
     * generates different sequences for each.
     */
    static readonly #CREATOR_TWEAK_FACTORS: Readonly<Record<NumericIdentifierType, bigint>> = {
        GTIN: 1987n,
        GLN: 4241n,
        SSCC: 8087n,
        GRAI: 3221n,
        GSRN: 2341n,
        GDTI: 7333n,
        GSIN: 5623n,
        GCN: 6869n
    };

    /**
     * Normalized prefix type.
     */
    readonly #prefixType: PrefixType;

    /**
     * Normalized prefix.
     */
    readonly #prefix: string;

    /**
     * Prefix as GS1 Company Prefix.
     */
    readonly #gs1CompanyPrefix: string;

    /**
     * U.P.C. Company Prefix if prefix type is {@linkcode PrefixTypes.UPCCompanyPrefix}.
     */
    readonly #upcCompanyPrefix: string | undefined;

    /**
     * GS1-8 Prefix if prefix type is {@linkcode PrefixTypes.GS18Prefix}.
     */
    readonly #gs18Prefix: string | undefined;

    /**
     * Default tweak factor.
     */
    readonly #defaultTweakFactor: bigint;

    /**
     * Tweak factor.
     */
    #tweakFactor = 0n;

    /**
     * Cached identifier creators.
     */
    readonly #identifierCreators: Partial<IdentifierCreatorsRecord> = {};

    /**
     * Constructor.
     *
     * @param prefixType
     * Prefix type.
     *
     * @param prefix
     * Prefix.
     */
    constructor(prefixType: PrefixType, prefix: string) {
        const normalizedPrefixProvider = PrefixValidator.normalize(prefixType, prefix);

        this.#prefixType = normalizedPrefixProvider.prefixType;
        this.#prefix = normalizedPrefixProvider.prefix;
        this.#gs1CompanyPrefix = normalizedPrefixProvider.gs1CompanyPrefix;
        this.#upcCompanyPrefix = normalizedPrefixProvider.upcCompanyPrefix;
        this.#gs18Prefix = normalizedPrefixProvider.gs18Prefix;

        // Default tweak factor is the numeric value of the GS1 Company Prefix preceded by '1'.
        this.#defaultTweakFactor = BigInt(`1${this.gs1CompanyPrefix}`);

        this.resetTweakFactor();
    }

    /**
     * Get the prefix type.
     */
    get prefixType(): PrefixType {
        return this.#prefixType;
    }

    /**
     * Get the prefix.
     */
    get prefix(): string {
        return this.#prefix;
    }

    /**
     * Get the GS1 Company Prefix.
     */
    get gs1CompanyPrefix(): string {
        return this.#gs1CompanyPrefix;
    }

    /**
     * Get the U.P.C. Company Prefix if prefix type is {@linkcode PrefixTypes.UPCCompanyPrefix} or undefined if not.
     */
    get upcCompanyPrefix(): string | undefined {
        return this.#upcCompanyPrefix;
    }

    /**
     * Get the GS1-8 Prefix if prefix type is {@linkcode PrefixTypes.GS18Prefix} or undefined if not.
     */
    get gs18Prefix(): string | undefined {
        return this.#gs18Prefix;
    }

    /**
     * Set the tweak for an identifier creator if it's a numeric identifier creator.
     *
     * @param identifierCreator
     * Identifier creator.
     */
    #setCreatorTweak(identifierCreator: IdentifierCreator): void {
        if (isNumericIdentifierCreator(identifierCreator)) {
            // eslint-disable-next-line no-param-reassign -- Method purpose is to set the tweak.
            identifierCreator.tweak = this.tweakFactor * PrefixManager.#CREATOR_TWEAK_FACTORS[identifierCreator.identifierType];
        }
    }

    /**
     * Get the tweak factor.
     */
    get tweakFactor(): bigint {
        return this.#tweakFactor;
    }

    /**
     * Set the tweak factor.
     *
     * @param value
     * Tweak factor.
     */
    set tweakFactor(value: number | bigint) {
        const tweakFactor = BigInt(value);

        if (this.#tweakFactor !== tweakFactor) {
            this.#tweakFactor = tweakFactor;

            for (const creator of Object.values(this.#identifierCreators)) {
                this.#setCreatorTweak(creator);
            }
        }
    }

    /**
     * Reset the tweak factor to its default (numeric value of the GS1 Company Prefix preceded by '1').
     */
    resetTweakFactor(): void {
        this.tweakFactor = this.#defaultTweakFactor;
    }

    /**
     * Get a prefix manager.
     *
     * @param prefixType
     * Prefix type.
     *
     * @param prefix
     * Prefix.
     *
     * @returns
     * Prefix manager with normalized prefix type and prefix.
     */
    static get(prefixType: PrefixType, prefix: string): PrefixManager {
        // Normalization will occur in constructor as well, but it's necessary here for the map.
        const normalizedPrefixProvider = PrefixValidator.normalize(prefixType, prefix);

        let prefixManager = PrefixManager.#PREFIX_MANAGERS_MAP.get(normalizedPrefixProvider.gs1CompanyPrefix);

        if (prefixManager === undefined) {
            prefixManager = new PrefixManager(normalizedPrefixProvider.prefixType, normalizedPrefixProvider.prefix);
            PrefixManager.#PREFIX_MANAGERS_MAP.set(normalizedPrefixProvider.gs1CompanyPrefix, prefixManager);
        }

        return prefixManager;
    }

    /**
     * Get an identifier creator.
     *
     * @template TIdentifierType
     * Identifier type type.
     *
     * @param identifierType
     * Identifier type used to construct identifier creator.
     *
     * @param constructorParameter
     * Second constructor parameter passed to constructor callback alongside this.
     *
     * @param ConstructorCallback
     * Constructor callback.
     *
     * @returns
     * Identifier creator.
     */
    #getIdentifierCreator<TIdentifierType extends IdentifierType, TConstructorParameter>(identifierType: TIdentifierType, constructorParameter: TConstructorParameter, ConstructorCallback: new (prefixProvider: PrefixProvider, constructorParameter: TConstructorParameter) => IdentifierCreatorsRecord[TIdentifierType]): IdentifierCreatorsRecord[TIdentifierType] {
        let creator: IdentifierCreatorsRecord[TIdentifierType] | undefined = this.#identifierCreators[identifierType];

        if (creator === undefined) {
            if (this.prefixType === PrefixTypes.GS18Prefix && identifierType !== IdentifierTypes.GTIN) {
                throw new RangeError(i18nextGS1.t("Prefix.identifierTypeNotSupportedByGS18Prefix", {
                    identifierType
                }));
            }

            creator = new ConstructorCallback(this, constructorParameter);

            this.#setCreatorTweak(creator);

            this.#identifierCreators[identifierType] = creator;
        }

        return creator;
    }

    /**
     * Get non-GTIN numeric identifier creator.
     *
     * @param identifierType
     * Identifier type used to construct identifier creator.
     *
     * @returns
     * Identifier creator.
     */
    #getNonGTINNumericIdentifierCreator(identifierType: Exclude<NonGTINNumericIdentifierType, SerializableNumericIdentifierType>): NonGTINNumericIdentifierCreator {
        return this.#getIdentifierCreator(identifierType, identifierType, NonGTINNumericIdentifierCreator);
    }

    /**
     * Get serialized numeric identifier creator.
     *
     * @param identifierType
     * Identifier type used to construct identifier creator.
     *
     * @returns
     * Identifier creator.
     */
    #getSerializableNumericIdentifierCreator(identifierType: SerializableNumericIdentifierType): SerializableNumericIdentifierCreator {
        return this.#getIdentifierCreator(identifierType, identifierType, SerializableNumericIdentifierCreator);
    }

    /**
     * Get non-numeric identifier creator.
     *
     * @param identifierType
     * Identifier type used to construct identifier creator.
     *
     * @returns
     * Identifier creator.
     */
    #getNonNumericIdentifierCreator(identifierType: NonNumericIdentifierType): NonNumericIdentifierCreator {
        return this.#getIdentifierCreator(identifierType, identifierType, NonNumericIdentifierCreator);
    }

    /**
     * Get GTIN creator.
     */
    get gtinCreator(): GTINCreator {
        return this.#getIdentifierCreator(IdentifierTypes.GTIN, GTIN_BASE_TYPES[this.prefixType], GTINCreator);
    }

    /**
     * Get GLN creator.
     */
    get glnCreator(): NonGTINNumericIdentifierCreator {
        return this.#getNonGTINNumericIdentifierCreator(IdentifierTypes.GLN);
    }

    /**
     * Get SSCC creator.
     */
    get ssccCreator(): NonGTINNumericIdentifierCreator {
        return this.#getNonGTINNumericIdentifierCreator(IdentifierTypes.SSCC);
    }

    /**
     * Get GRAI creator.
     */
    get graiCreator(): SerializableNumericIdentifierCreator {
        return this.#getSerializableNumericIdentifierCreator(IdentifierTypes.GRAI);
    }

    /**
     * Get GIAI creator.
     */
    get giaiCreator(): NonNumericIdentifierCreator {
        return this.#getNonNumericIdentifierCreator(IdentifierTypes.GIAI);
    }

    /**
     * Get GSRN creator.
     */
    get gsrnCreator(): NonGTINNumericIdentifierCreator {
        return this.#getNonGTINNumericIdentifierCreator(IdentifierTypes.GSRN);
    }

    /**
     * Get GDTI creator.
     */
    get gdtiCreator(): SerializableNumericIdentifierCreator {
        return this.#getSerializableNumericIdentifierCreator(IdentifierTypes.GDTI);
    }

    /**
     * Get GINC creator.
     */
    get gincCreator(): NonNumericIdentifierCreator {
        return this.#getNonNumericIdentifierCreator(IdentifierTypes.GINC);
    }

    /**
     * Get GSIN creator.
     */
    get gsinCreator(): NonGTINNumericIdentifierCreator {
        return this.#getNonGTINNumericIdentifierCreator(IdentifierTypes.GSIN);
    }

    /**
     * Get GCN creator.
     */
    get gcnCreator(): SerializableNumericIdentifierCreator {
        return this.#getSerializableNumericIdentifierCreator(IdentifierTypes.GCN);
    }

    /**
     * Get CPID creator.
     */
    get cpidCreator(): NonNumericIdentifierCreator {
        return this.#getNonNumericIdentifierCreator(IdentifierTypes.CPID);
    }

    /**
     * Get GMN creator.
     */
    get gmnCreator(): NonNumericIdentifierCreator {
        return this.#getNonNumericIdentifierCreator(IdentifierTypes.GMN);
    }
}
