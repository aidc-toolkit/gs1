import { type IdentifierType, IdentifierTypes } from "../identifier-type.js";
import { i18nextGS1T } from "../locale/i18n.js";
import { isNonNumericIdentifierType } from "../non-numeric-identifier-type.js";
import { isNonSerializableNumericIdentifierType } from "../non-serializable-numeric-identifier-type.js";
import { PrefixTypes } from "../prefix-type.js";
import { isSerializableNumericIdentifierType } from "../serializable-numeric-identifier-type.js";
import type { PrefixProvider } from "../validator/index.js";
import { ConcreteGTINCreator } from "./concrete-gtin-creator.js";
import { ConcreteNonNumericIdentifierCreator } from "./concrete-non-numeric-identifier-creator.js";
import {
    ConcreteNonSerializableNumericIdentifierCreator
} from "./concrete-non-serializable-numeric-identifier-creator.js";
import { ConcreteSerializableNumericIdentifierCreator } from "./concrete-serializable-numeric-identifier-creator.js";
import type { IdentifierCreators } from "./identifier-creator.js";

/**
 * Identifier creator manager. Wraps around a {@linkcode PrefixProvider} to instantiate and cache identifier creators.
 */
export class IdentifierCreatorManager {
    /**
     * Prefix provider on which to base identifier creators.
     */
    readonly #prefixProvider: PrefixProvider;

    /**
     * Callback if any when identifier creator is instantiated or {@linkcode IdentifierCreatorManager.reinitializeAll}
     * is called.
     */
    readonly #initializationCallback: ((identifierCreator: IdentifierCreators[IdentifierType]) => void) | undefined;

    /**
     * Cached identifier creators.
     */
    readonly #identifierCreators: Partial<IdentifierCreators> = {};
    
    /**
     * Constructor.
     *
     * @param prefixProvider
     * Prefix provider on which to base identifier creators.
     *
     * @param initializationCallback
     * Callback if any when identifier creator is instantiated or {@linkcode IdentifierCreatorManager.reinitializeAll}
     * is called.
     */
    constructor(prefixProvider: PrefixProvider, initializationCallback?: (identifierCreator: IdentifierCreators[IdentifierType]) => void) {
        this.#prefixProvider = prefixProvider;
        this.#initializationCallback = initializationCallback;
    }

    /**
     * Get an identifier creator.
     *
     * @param identifierType
     * Identifier type for which to retrieve or construct identifier creator.
     *
     * @returns
     * Identifier creator.
     */
    get<TIdentifierType extends IdentifierType>(identifierType: TIdentifierType): IdentifierCreators[TIdentifierType] {
        let identifierCreator: IdentifierCreators[IdentifierType] | undefined = this.#identifierCreators[identifierType];

        if (identifierCreator === undefined) {
            const prefixProvider = this.#prefixProvider;

            if (identifierType === IdentifierTypes.GTIN) {
                identifierCreator = new ConcreteGTINCreator(prefixProvider);
            } else {
                if (prefixProvider.prefixType === PrefixTypes.GS18Prefix) {
                    throw new RangeError(i18nextGS1T("Prefix.identifierTypeNotSupportedByGS18Prefix", {
                        identifierType
                    }));
                }

                if (isNonSerializableNumericIdentifierType(identifierType)) {
                    identifierCreator = new ConcreteNonSerializableNumericIdentifierCreator(prefixProvider, identifierType);
                } else if (isSerializableNumericIdentifierType(identifierType)) {
                    identifierCreator = new ConcreteSerializableNumericIdentifierCreator(prefixProvider, identifierType);
                } else if (isNonNumericIdentifierType(identifierType)) {
                    identifierCreator = new ConcreteNonNumericIdentifierCreator(prefixProvider, identifierType);
                } else {
                    // Application error; no localization necessary.
                    throw new Error("Unknown identifier type");
                }
            }

            if (this.#initializationCallback !== undefined) {
                this.#initializationCallback(identifierCreator);
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Types are known to match.
            this.#identifierCreators[identifierType] = identifierCreator as IdentifierCreators[TIdentifierType];
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Types are known to match.
        return identifierCreator as IdentifierCreators[TIdentifierType];
    }

    /**
     * Reinitialize all instantiated identifier creators by calling the initialization callback if any.
     */
    reinitializeAll(): void {
        if (this.#initializationCallback !== undefined) {
            for (const identifierCreator of Object.values(this.#identifierCreators)) {
                this.#initializationCallback(identifierCreator);
            }
        }
    }
}
