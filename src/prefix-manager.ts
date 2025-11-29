import { GTINCreator } from "./gtin-creator";
import { type GTINType, GTINTypes } from "./gtin-validator";
import type { IdentifierCreator } from "./identifier-creator";
import { type IdentifierType, IdentifierTypes } from "./identifier-type";
import { i18nextGS1 } from "./locale/i18n";
import { NonGTINNumericIdentifierCreator } from "./non-gtin-numeric-identifier-creator";
import {
    GLN_VALIDATOR,
    GSIN_VALIDATOR,
    GSRN_VALIDATOR,
    type NonGTINNumericIdentifierValidator,
    SSCC_VALIDATOR
} from "./non-gtin-numeric-identifier-validator";
import { NonNumericIdentifierCreator } from "./non-numeric-identifier-creator";
import {
    CPID_VALIDATOR,
    GIAI_VALIDATOR,
    GINC_VALIDATOR,
    GMN_VALIDATOR,
    type NonNumericIdentifierValidator
} from "./non-numeric-identifier-validator";
import type { AbstractNumericIdentifierCreator } from "./numeric-identifier-creator";
import type { NumericIdentifierType } from "./numeric-identifier-validator";
import type { PrefixProvider } from "./prefix-provider";
import { type PrefixType, PrefixTypes } from "./prefix-type";
import { PrefixValidator } from "./prefix-validator";
import { SerializableNumericIdentifierCreator } from "./serializable-numeric-identifier-creator";
import {
    GCN_VALIDATOR,
    GDTI_VALIDATOR,
    GRAI_VALIDATOR,
    type SerializableNumericIdentifierValidator
} from "./serializable-numeric-identifier-validator";

/**
 * Prefix manager. This is the core class for identifier creation.
 *
 * A prefix manager may be created for any {@link PrefixType | prefix type}. As most applications work with a limited
 * number of prefixes for creating identifiers, prefix managers are cached in memory and may be reused.
 *
 * Prefix managers are keyed by GS1 Company Prefix, so the prefix type that is requested may not match the prefix type
 * of the returned prefix manager. For example, the prefix manager for GS1 Company Prefix 0614141 is identical to the
 * one for U.P.C. Company Prefix 614141, with the prefix type equal to {@link PrefixTypes.UPCCompanyPrefix} and the
 * prefix equal to "614141".
 *
 * To support the creation of sparse identifiers, a prefix manager maintains a {@link tweakFactor | tweak
 * factor} which is used, along with a type-specific multiplier, as the tweak when creating numeric identifiers.
 * The default tweak factor is the numeric value of the GS1 Company Prefix representation of the prefix preceded by '1'
 * to ensure uniqueness (i.e., so that prefixes 0 N1 N2 N3... and N1 N2 N3... produce different tweak factors). This is
 * usually sufficient for obfuscation, but as the sparse creation algorithm is reversible and as the GS1 Company Prefix
 * is discoverable via {@link https://www.gs1.org/services/verified-by-gs1 | Verified by GS1}, a user-defined tweak
 * factor should be used if a higher degree of obfuscation is required. When using a tweak factor other than the
 * default, care should be taken to restore it when resuming the application. A tweak factor of 0 creates a straight
 * sequence.
 */
export class PrefixManager implements PrefixProvider {
    /**
     * Cached prefix managers, keyed by GS1 Company Prefix.
     */
    private static readonly PREFIX_MANAGERS_MAP = new Map<string, PrefixManager>();

    /**
     * Creator tweak factors. Different numeric identifier types have different tweak factors so that sparse creation
     * generates different sequences for each.
     */
    private static readonly CREATOR_TWEAK_FACTORS: Readonly<Record<NumericIdentifierType, bigint>> = {
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
    private readonly _prefixType: PrefixType;

    /**
     * Normalized prefix.
     */
    private readonly _prefix: string;

    /**
     * Prefix as GS1 Company Prefix.
     */
    private readonly _gs1CompanyPrefix: string;

    /**
     * U.P.C. Company Prefix if prefix type is {@link PrefixTypes.UPCCompanyPrefix}.
     */
    private readonly _upcCompanyPrefix: string | undefined;

    /**
     * GS1-8 Prefix if prefix type is {@link PrefixTypes.GS18Prefix}.
     */
    private readonly _gs18Prefix: string | undefined;

    /**
     * Default tweak factor.
     */
    private readonly _defaultTweakFactor: bigint;

    /**
     * Tweak factor.
     */
    private _tweakFactor = 0n;

    /**
     * Cached identifier creators.
     */
    private readonly _identifierCreators: Partial<Record<IdentifierType, IdentifierCreator>> = {};

    /**
     * Constructor.
     *
     * @param gs1CompanyPrefix
     * GS1 Company Prefix.
     */
    private constructor(gs1CompanyPrefix: string) {
        this._gs1CompanyPrefix = gs1CompanyPrefix;

        // Determine the prefix type and populate the remaining fields.
        if (!gs1CompanyPrefix.startsWith("0")) {
            this._prefixType = PrefixTypes.GS1CompanyPrefix;
            this._prefix = this._gs1CompanyPrefix;
        } else if (!gs1CompanyPrefix.startsWith("00000")) {
            this._prefixType = PrefixTypes.UPCCompanyPrefix;
            this._upcCompanyPrefix = gs1CompanyPrefix.substring(1);
            this._prefix = this._upcCompanyPrefix;
        } else {
            this._prefixType = PrefixTypes.GS18Prefix;
            this._gs18Prefix = gs1CompanyPrefix.substring(5);
            this._prefix = this._gs18Prefix;
        }

        // Default tweak factor is the numeric value of the GS1 Company Prefix preceded by '1'.
        this._defaultTweakFactor = BigInt(`1${this.gs1CompanyPrefix}`);

        this.resetTweakFactor();
    }

    /**
     * Get the prefix type.
     */
    get prefixType(): PrefixType {
        return this._prefixType;
    }

    /**
     * Get the prefix.
     */
    get prefix(): string {
        return this._prefix;
    }

    /**
     * Get the GS1 Company Prefix.
     */
    get gs1CompanyPrefix(): string {
        return this._gs1CompanyPrefix;
    }

    /**
     * Get the U.P.C. Company Prefix if prefix type is {@link PrefixTypes.UPCCompanyPrefix} or undefined if not.
     */
    get upcCompanyPrefix(): string | undefined {
        return this._upcCompanyPrefix;
    }

    /**
     * Get the GS1-8 Prefix if prefix type is {@link PrefixTypes.GS18Prefix} or undefined if not.
     */
    get gs18Prefix(): string | undefined {
        return this._gs18Prefix;
    }

    /**
     * Set the tweak for an identifier creator if it's a numeric identifier creator.
     *
     * @param creator
     * Identifier creator.
     */
    private setCreatorTweak(creator: IdentifierCreator): void {
        if (creator.identifierType in PrefixManager.CREATOR_TWEAK_FACTORS) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type is known by testing for presence in record.
            const creatorTweakFactor = PrefixManager.CREATOR_TWEAK_FACTORS[creator.identifierType as NumericIdentifierType];

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion,no-param-reassign -- Type is known by testing identifier type. Method purpose is to set the tweak.
            (creator as AbstractNumericIdentifierCreator).tweak = this.tweakFactor * creatorTweakFactor;
        }
    }

    /**
     * Get the tweak factor.
     */
    get tweakFactor(): bigint {
        return this._tweakFactor;
    }

    /**
     * Set the tweak factor.
     *
     * @param value
     * Tweak factor.
     */
    set tweakFactor(value: number | bigint) {
        const tweakFactor = BigInt(value);

        if (this._tweakFactor !== tweakFactor) {
            this._tweakFactor = tweakFactor;

            for (const creator of Object.values(this._identifierCreators)) {
                this.setCreatorTweak(creator);
            }
        }
    }

    /**
     * Reset the tweak factor to its default (numeric value of the GS1 Company Prefix preceded by '1').
     */
    resetTweakFactor(): void {
        this.tweakFactor = this._defaultTweakFactor;
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
        PrefixValidator.validate(prefixType, true, true, prefix);

        let gs1CompanyPrefix: string;

        switch (prefixType) {
            case PrefixTypes.GS1CompanyPrefix:
                gs1CompanyPrefix = prefix;
                break;

            case PrefixTypes.UPCCompanyPrefix:
                gs1CompanyPrefix = "0" + prefix;
                break;

            case PrefixTypes.GS18Prefix:
                gs1CompanyPrefix = "00000" + prefix;
                break;

            // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- Method may be called by unsafe means.
            default:
                throw new RangeError(i18nextGS1.t("Prefix.invalidPrefixType"));
        }

        let prefixManager = PrefixManager.PREFIX_MANAGERS_MAP.get(gs1CompanyPrefix);

        if (prefixManager === undefined) {
            prefixManager = new PrefixManager(gs1CompanyPrefix);
            PrefixManager.PREFIX_MANAGERS_MAP.set(gs1CompanyPrefix, prefixManager);
        }

        return prefixManager;
    }

    /**
     * Get an identifier creator.
     *
     * @param identifierType
     * Identifier type.
     *
     * @param constructorCallback
     * Constructor callback.
     *
     * @returns
     * Identifier creator.
     */
    private getIdentifierCreator<TIdentifierCreator extends IdentifierCreator>(identifierType: IdentifierType, constructorCallback: () => TIdentifierCreator): TIdentifierCreator {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Type is paired with constructor callback.
        let creator = this._identifierCreators[identifierType] as TIdentifierCreator | undefined;

        if (creator === undefined) {
            if (this.prefixType === PrefixTypes.GS18Prefix && identifierType !== IdentifierTypes.GTIN) {
                throw new RangeError(i18nextGS1.t("Prefix.identifierTypeNotSupportedByGS18Prefix", {
                    identifierType
                }));
            }

            creator = constructorCallback();

            this.setCreatorTweak(creator);

            this._identifierCreators[identifierType] = creator;
        }

        return creator;
    }

    /**
     * Get non-GTIN numeric identifier creator.
     *
     * @param validator
     * Validator on which identifier creator is based.
     *
     * @returns
     * Identifier creator.
     */
    private getNonGTINNumericIdentifierCreator(validator: NonGTINNumericIdentifierValidator): NonGTINNumericIdentifierCreator {
        return this.getIdentifierCreator(validator.identifierType, () => new NonGTINNumericIdentifierCreator(this, validator.identifierType, validator.length, validator.leaderType));
    }

    /**
     * Get serialized numeric identifier creator.
     *
     * @param validator
     * Validator on which identifier creator is based.
     *
     * @returns
     * Identifier creator.
     */
    private getSerializableNumericIdentifierCreator(validator: SerializableNumericIdentifierValidator): SerializableNumericIdentifierCreator {
        return this.getIdentifierCreator(validator.identifierType, () => new SerializableNumericIdentifierCreator(this, validator.identifierType, validator.length, validator.serialComponentLength, validator.serialComponentCharacterSet));
    }

    /**
     * Get non-numeric identifier creator.
     *
     * @param validator
     * Validator on which identifier creator is based.
     *
     * @returns
     * Identifier creator.
     */
    private getNonNumericIdentifierCreator(validator: NonNumericIdentifierValidator): NonNumericIdentifierCreator {
        return this.getIdentifierCreator(validator.identifierType, () => new NonNumericIdentifierCreator(this, validator.identifierType, validator.length, validator.referenceCharacterSet, validator.requiresCheckCharacterPair));
    }

    /**
     * Get GTIN creator.
     */
    get gtinCreator(): GTINCreator {
        return this.getIdentifierCreator(IdentifierTypes.GTIN, () => {
            let gtinType: GTINType;

            switch (this.prefixType) {
                case PrefixTypes.GS1CompanyPrefix:
                    gtinType = GTINTypes.GTIN13;
                    break;

                case PrefixTypes.UPCCompanyPrefix:
                    gtinType = GTINTypes.GTIN12;
                    break;

                case PrefixTypes.GS18Prefix:
                    gtinType = GTINTypes.GTIN8;
                    break;
            }

            return new GTINCreator(this, gtinType);
        });
    }

    /**
     * Get GLN creator.
     */
    get glnCreator(): NonGTINNumericIdentifierCreator {
        return this.getNonGTINNumericIdentifierCreator(GLN_VALIDATOR);
    }

    /**
     * Get SSCC creator.
     */
    get ssccCreator(): NonGTINNumericIdentifierCreator {
        return this.getNonGTINNumericIdentifierCreator(SSCC_VALIDATOR);
    }

    /**
     * Get GRAI creator.
     */
    get graiCreator(): SerializableNumericIdentifierCreator {
        return this.getSerializableNumericIdentifierCreator(GRAI_VALIDATOR);
    }

    /**
     * Get GIAI creator.
     */
    get giaiCreator(): NonNumericIdentifierCreator {
        return this.getNonNumericIdentifierCreator(GIAI_VALIDATOR);
    }

    /**
     * Get GSRN creator.
     */
    get gsrnCreator(): NonGTINNumericIdentifierCreator {
        return this.getNonGTINNumericIdentifierCreator(GSRN_VALIDATOR);
    }

    /**
     * Get GDTI creator.
     */
    get gdtiCreator(): SerializableNumericIdentifierCreator {
        return this.getSerializableNumericIdentifierCreator(GDTI_VALIDATOR);
    }

    /**
     * Get GINC creator.
     */
    get gincCreator(): NonNumericIdentifierCreator {
        return this.getNonNumericIdentifierCreator(GINC_VALIDATOR);
    }

    /**
     * Get GSIN creator.
     */
    get gsinCreator(): NonGTINNumericIdentifierCreator {
        return this.getNonGTINNumericIdentifierCreator(GSIN_VALIDATOR);
    }

    /**
     * Get GCN creator.
     */
    get gcnCreator(): SerializableNumericIdentifierCreator {
        return this.getSerializableNumericIdentifierCreator(GCN_VALIDATOR);
    }

    /**
     * Get CPID creator.
     */
    get cpidCreator(): NonNumericIdentifierCreator {
        return this.getNonNumericIdentifierCreator(CPID_VALIDATOR);
    }

    /**
     * Get GMN creator.
     */
    get gmnCreator(): NonNumericIdentifierCreator {
        return this.getNonNumericIdentifierCreator(GMN_VALIDATOR);
    }
}
