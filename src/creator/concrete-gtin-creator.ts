import { type CharacterSetValidation, Exclusions, NUMERIC_CREATOR } from "@aidc-toolkit/utility";
import { checkDigit } from "../check.js";
import { type GTINDescriptor, GTINDescriptors } from "../descriptor/index.js";
import { GTINLengths } from "../gtin-length.js";
import { i18nextGS1T } from "../locale/i18n.js";
import { ConcreteGTINValidator } from "../validator/concrete-gtin-validator.js";
import type { GTINValidator, PrefixProvider } from "../validator/index.js";
import type { BaseGTINCreator } from "./base-gtin-creator.js";
import { MixinAbstractNumericIdentifierCreator } from "./mixin-abstract-numeric-identifier-creator.js";

/**
 * GTIN creator. Applicable to GTIN-13, GTIN-12, and GTIN-8 types; not applicable to GTIN-14 type.
 */
export class ConcreteGTINCreator<
    TIdentifierDescriptor extends GTINDescriptor,
    TIdentifierValidator extends TIdentifierDescriptor & GTINValidator
// @ts-expect-error -- https://github.com/microsoft/TypeScript/issues/24122
> extends MixinAbstractNumericIdentifierCreator<TIdentifierDescriptor, TIdentifierValidator, ConcreteGTINValidator<TIdentifierDescriptor>>(ConcreteGTINValidator)
    implements BaseGTINCreator<TIdentifierValidator["prefixType"]> {
    /**
     * Validation parameters for required indicator digit.
     */
    static readonly #REQUIRED_INDICATOR_DIGIT_VALIDATION: CharacterSetValidation = {
        minimumLength: 1,
        maximumLength: 1,
        component: () => i18nextGS1T("Identifier.indicatorDigit")
    };

    /**
     * Constructor.
     *
     * @param prefixProvider
     * Prefix provider.
     */
    constructor(prefixProvider: PrefixProvider) {
        super(prefixProvider, prefixProvider.prefix, GTINDescriptors[prefixProvider.prefixType]);
    }

    /**
     * @inheritDoc
     */
    override get prefix(): string {
        return this.prefixProvider.prefix;
    }

    /**
     * @inheritDoc
     */
    createGTIN14(indicatorDigit: string, value: number | bigint, sparse?: boolean): string;

    /**
     * @inheritDoc
     */
    createGTIN14(indicatorDigit: string, values: Iterable<number | bigint>, sparse?: boolean): Iterable<string>;

    createGTIN14(indicatorDigit: string, valueOrValues: number | bigint | Iterable<number | bigint>, sparse?: boolean): string | Iterable<string> {
        NUMERIC_CREATOR.validate(indicatorDigit, ConcreteGTINCreator.#REQUIRED_INDICATOR_DIGIT_VALIDATION);

        return NUMERIC_CREATOR.create(GTINLengths.GTIN13 - this.prefixProvider.gs1CompanyPrefix.length - 1, valueOrValues, Exclusions.None, sparse === true ? this.tweak : undefined, (reference) => {
            const partialIdentifier = indicatorDigit + this.prefixProvider.gs1CompanyPrefix + reference;

            return partialIdentifier + checkDigit(partialIdentifier);
        });
    }
}
