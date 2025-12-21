import * as GCPLength from "./gcp-length.js";
import type { GTINCreator } from "./gtin-creator.js";
import { GTIN_BASE_TYPES } from "./gtin-length.js";
import type { GTINType } from "./gtin-type.js";
import type { IdentifierCreator } from "./identifier-creator.js";
import {
    IdentifierCreatorConstructors,
    type IdentifierCreatorsRecord,
    isNumericIdentifierCreator,
    type NonGTINCreatorConstructor
} from "./identifier-creators.js";
import { type IdentifierType, IdentifierTypes } from "./identifier-type.js";
import { i18nextGS1 } from "./locale/i18n.js";
import type { NonNumericIdentifierCreator } from "./non-numeric-identifier-creator.js";
import type { NonSerializableNumericIdentifierCreator } from "./non-serializable-numeric-identifier-creator.js";
import type { NumericIdentifierType } from "./numeric-identifier-type.js";
import type { PrefixProvider } from "./prefix-provider.js";
import { type PrefixType, PrefixTypes } from "./prefix-type.js";
import { PrefixValidator } from "./prefix-validator.js";
import type { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator.js";
import type { GCPLengthCache } from "./gcp-length-cache.js";

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
     * GS1 Company Prefix length root.
     */
    static #gcpLengthRoot: GCPLength.Root | undefined = undefined;

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
     * Identifier type for which to retrieve or construct identifier creator.
     *
     * @returns
     * Identifier creator.
     */
    getIdentifierCreator<TIdentifierType extends IdentifierType>(identifierType: TIdentifierType): IdentifierCreatorsRecord[TIdentifierType] {
        let creator: IdentifierCreatorsRecord[TIdentifierType] | undefined = this.#identifierCreators[identifierType];

        if (creator === undefined) {
            if (identifierType === IdentifierTypes.GTIN) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Types are known to match.
                creator = new IdentifierCreatorConstructors.GTIN(this, GTIN_BASE_TYPES[this.prefixType]) as IdentifierCreatorsRecord[TIdentifierType];
            } else {
                if (this.prefixType === PrefixTypes.GS18Prefix) {
                    throw new RangeError(i18nextGS1.t("Prefix.identifierTypeNotSupportedByGS18Prefix", {
                        identifierType
                    }));
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Types are known to match.
                creator = new (IdentifierCreatorConstructors[identifierType] as unknown as NonGTINCreatorConstructor<Exclude<TIdentifierType, GTINType>>)(this, identifierType as Exclude<TIdentifierType, GTINType>);
            }

            this.#setCreatorTweak(creator);

            this.#identifierCreators[identifierType] = creator;
        }

        return creator;
    }

    /**
     * Get GTIN creator.
     */
    get gtinCreator(): GTINCreator {
        return this.getIdentifierCreator(IdentifierTypes.GTIN);
    }

    /**
     * Get GLN creator.
     */
    get glnCreator(): NonSerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GLN);
    }

    /**
     * Get SSCC creator.
     */
    get ssccCreator(): NonSerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.SSCC);
    }

    /**
     * Get GRAI creator.
     */
    get graiCreator(): SerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GRAI);
    }

    /**
     * Get GIAI creator.
     */
    get giaiCreator(): NonNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GIAI);
    }

    /**
     * Get GSRN creator.
     */
    get gsrnCreator(): NonSerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GSRN);
    }

    /**
     * Get GDTI creator.
     */
    get gdtiCreator(): SerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GDTI);
    }

    /**
     * Get GINC creator.
     */
    get gincCreator(): NonNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GINC);
    }

    /**
     * Get GSIN creator.
     */
    get gsinCreator(): NonSerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GSIN);
    }

    /**
     * Get GCN creator.
     */
    get gcnCreator(): SerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GCN);
    }

    /**
     * Get CPID creator.
     */
    get cpidCreator(): NonNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.CPID);
    }

    /**
     * Get GMN creator.
     */
    get gmnCreator(): NonNumericIdentifierCreator {
        return this.getIdentifierCreator(IdentifierTypes.GMN);
    }

    /**
     * Load GS1 Company Prefix length data.
     *
     * @param gcpLengthCache
     * GS1 Company Prefix length cache.
     */
    static async loadGCPLengthData(gcpLengthCache: GCPLengthCache): Promise<void> {
        PrefixManager.#gcpLengthRoot = await GCPLength.loadData(gcpLengthCache);
    }

    /**
     * Get the length of a GS1 Company Prefix for an identifier.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param identifier
     * Identifier.
     *
     * @returns
     * Length of GS1 Company Prefix, 0 if not a GS1 Company Prefix, or -1 if not found.
     */
    static getGCPLengthFor(identifierType: IdentifierType, identifier: string): number {
        if (PrefixManager.#gcpLengthRoot === undefined) {
            throw new RangeError(i18nextGS1.t("Prefix.gs1CompanyPrefixLengthDataNotLoaded"));
        }

        return GCPLength.getFor(PrefixManager.#gcpLengthRoot, identifierType, identifier);
    }

    /**
     * Get the date/time the GS1 Company Prefix length data was last updated.
     *
     * @returns
     * Date/time the GS1 Company Prefix length data was last updated.
     */
    static getGCPLengthDateTime(): Date {
        if (PrefixManager.#gcpLengthRoot === undefined) {
            throw new RangeError(i18nextGS1.t("Prefix.gs1CompanyPrefixLengthDataNotLoaded"));
        }

        return PrefixManager.#gcpLengthRoot.dateTime;
    }
}
