import { hasValidCheckDigit } from "../check.js";
import type { NumericIdentifierDescriptor } from "../descriptor/index.js";
import { LeaderTypes } from "../leader-type.js";
import { i18nextGS1T } from "../locale/i18n.js";
import { AbstractIdentifierValidator } from "./abstract-identifier-validator.js";
import type {
    BaseNumericIdentifierValidator,
    NumericIdentifierValidation
} from "./base-numeric-identifier-validator.js";

/**
 * Abstract numeric identifier validator.
 */
export abstract class AbstractNumericIdentifierValidator<
    TIdentifierDescriptor extends NumericIdentifierDescriptor
> extends AbstractIdentifierValidator<TIdentifierDescriptor, NumericIdentifierValidation> implements BaseNumericIdentifierValidator<
    TIdentifierDescriptor["identifierType"],
    TIdentifierDescriptor["prefixType"],
    TIdentifierDescriptor["length"],
    TIdentifierDescriptor["leaderType"]
> {
    /**
     * Prefix position, determined by the leader type.
     */
    readonly #prefixPosition: number;

    /**
     * Constructor.
     *
     * @param identifierDescriptor
     * Identifier descriptor.
     */
    constructor(identifierDescriptor: TIdentifierDescriptor) {
        super(identifierDescriptor);

        this.#prefixPosition = Number(identifierDescriptor.leaderType === LeaderTypes.ExtensionDigit);
    }

    /**
     * @inheritDoc
     */
    get leaderType(): TIdentifierDescriptor["leaderType"] {
        return this.identifierDescriptor.leaderType;
    }

    /**
     * @inheritDoc
     */
    override validate(identifier: string, validation?: NumericIdentifierValidation): void {
        // Validate the prefix, with care taken for its position within the identifier.
        if (this.#prefixPosition === 0) {
            super.validatePrefix(identifier);
        } else {
            super.validatePrefix(identifier.substring(this.#prefixPosition));
        }

        // Validate the length.
        if (identifier.length !== this.length) {
            throw new RangeError(i18nextGS1T("Identifier.identifierTypeLength", {
                identifierType: this.identifierType,
                length: this.length
            }));
        }

        // Validating the check digit will also validate the characters.
        if (!hasValidCheckDigit(this.padIdentifier(identifier, validation?.positionOffset))) {
            throw new RangeError(i18nextGS1T("Identifier.invalidCheckDigit"));
        }
    }
}
