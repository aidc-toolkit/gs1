import { CharacterSetCreator, Sequence } from "@aidc-toolkit/utility";
import { expect, test } from "vitest";
import { type GTINCreator, GTINTypes, GTINValidator, hasValidCheckDigit, PrefixTypes } from "../src";
import { testNumericIdentifierCreator } from "./numeric-identifier-creator.js";

export function testGTINCreator(creator: GTINCreator): void {
    testNumericIdentifierCreator(creator, () => {
        test("Length", () => {
            switch (creator.prefixType) {
                case PrefixTypes.GS1CompanyPrefix:
                    expect(creator.length).toBe(13);
                    break;

                case PrefixTypes.UPCCompanyPrefix:
                    expect(creator.length).toBe(12);
                    break;

                case PrefixTypes.GS18Prefix:
                    expect(creator.length).toBe(8);
                    break;
            }
        });
    }, () => {
        const gs1CompanyPrefix = creator.prefixProvider.gs1CompanyPrefix;
        const prefix = creator.prefix;
        const prefixLength = prefix.length;
        const prefixSubstringStart = 14 - creator.length;
        const prefixSubstringEnd = prefixSubstringStart + prefixLength;
        const referenceLength = creator.length - prefixLength - 1;
        const referenceCount = Number(CharacterSetCreator.powerOf10(referenceLength));
        const referenceSubstringStart = prefixSubstringEnd;
        const referenceSubstringEnd = referenceSubstringStart + referenceLength;

        function validate(gtin: string, index: number, sparse: boolean): void {
            expect(() => {
                GTINValidator.validateGTIN14(gtin);
            }).not.toThrow(RangeError);
            expect(gtin).toBe(creator.createGTIN14("5", index, sparse));

            expect(gtin.length).toBe(14);
            expect(gtin.charAt(0)).toBe("5");
            expect(gtin.substring(1, prefixSubstringEnd)).toBe(gs1CompanyPrefix);
            expect(gtin.substring(prefixSubstringStart, prefixSubstringEnd)).toBe(prefix);
            expect(hasValidCheckDigit(gtin)).toBe(true);
        }

        test("GTIN-14 straight", () => {
            let index = 0;

            for (const gtin of creator.createGTIN14("5", new Sequence(0, referenceCount))) {
                expect(Number(gtin.substring(referenceSubstringStart, referenceSubstringEnd))).toBe(index);

                validate(gtin, index, false);

                index++;
            }

            expect(index).toBe(referenceCount);

            const randomValues = new Array<number>();
            const identifiers = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identifiers.push(creator.createGTIN14("5", randomValue));
            }

            expect(Array.from(creator.createGTIN14("5", randomValues))).toStrictEqual(identifiers);
        });

        test("GTIN-14 sparse", () => {
            const sparseReferenceCount = Math.min(referenceCount, 1000);

            // Reference count of 1 is neither sequential nor sparse so treat it as sparse.
            let sequential = sparseReferenceCount !== 1;

            const sequenceSet = new Set<string>();

            let index = 0;

            for (const gtin of creator.createGTIN14("5", new Sequence(0, sparseReferenceCount), true)) {
                sequential &&= Number(gtin.substring(referenceSubstringStart, referenceSubstringEnd)) === index;

                validate(gtin, index, true);

                expect(sequenceSet.has(gtin)).toBe(false);
                sequenceSet.add(gtin);

                index++;
            }

            expect(sequential).toBe(false);
            expect(index).toBe(sparseReferenceCount);

            const randomValues = new Array<number>();
            const identifiers = new Array<string>();

            for (let i = 0; i < 1000; i++) {
                const randomValue = Math.floor(Math.random() * creator.capacity);

                randomValues.push(randomValue);
                identifiers.push(creator.createGTIN14("5", randomValue, true));
            }

            expect(Array.from(creator.createGTIN14("5", randomValues, true))).toStrictEqual(identifiers);
        });

        if (creator.gtinType === GTINTypes.GTIN12) {
            test("Zero-suppress GTIN-12 rule 1", () => {
                expect(GTINValidator.zeroSuppress("012345000058")).toBe("01234558");
                expect(GTINValidator.zeroSuppress("012345000065")).toBe("01234565");
                expect(GTINValidator.zeroSuppress("012345000072")).toBe("01234572");
                expect(GTINValidator.zeroSuppress("012345000089")).toBe("01234589");
                expect(GTINValidator.zeroSuppress("012345000096")).toBe("01234596");
            });

            test("Zero-suppress GTIN-12 rule 2", () => {
                expect(GTINValidator.zeroSuppress("045670000080")).toBe("04567840");
            });

            test("Zero-suppress GTIN-12 rule 3", () => {
                expect(GTINValidator.zeroSuppress("034000005673")).toBe("03456703");
                expect(GTINValidator.zeroSuppress("034100005672")).toBe("03456712");
                expect(GTINValidator.zeroSuppress("034200005671")).toBe("03456721");
            });

            test("Zero-suppress GTIN-12 rule 4", () => {
                expect(GTINValidator.zeroSuppress("098300000752")).toBe("09837532");
                expect(GTINValidator.zeroSuppress("098400000751")).toBe("09847531");
                expect(GTINValidator.zeroSuppress("098500000750")).toBe("09857530");
                expect(GTINValidator.zeroSuppress("098600000759")).toBe("09867539");
                expect(GTINValidator.zeroSuppress("098700000758")).toBe("09877538");
                expect(GTINValidator.zeroSuppress("098800000757")).toBe("09887537");
                expect(GTINValidator.zeroSuppress("098900000756")).toBe("09897536");
            });

            test("Non-zero-suppressible GTIN-12 rule 1", () => {
                expect(() => GTINValidator.zeroSuppress("012345100055")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("012345010057")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("012345001055")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("012345000157")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("012345000041")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("012345000003")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Non-zero-suppressible GTIN-12 rule 2", () => {
                expect(() => GTINValidator.zeroSuppress("045670100087")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("045670010089")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("045670001087")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("045670000189")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Non-zero-suppressible GTIN-12 rule 3", () => {
                expect(() => GTINValidator.zeroSuppress("034010005670")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("034001005672")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("034000105670")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("034000015672")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Non-zero-suppressible GTIN-12 rule 4", () => {
                expect(() => GTINValidator.zeroSuppress("098310000759")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("098301000751")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("098300100759")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("098300010751")).toThrow("GTIN-12 not zero-suppressible");
                expect(() => GTINValidator.zeroSuppress("098300001759")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Zero-suppress other error", () => {
                expect(() => GTINValidator.zeroSuppress("0012345000059")).toThrow("GTIN must be 12 digits long");
                expect(() => GTINValidator.zeroSuppress("012345000059")).toThrow("Invalid check digit");
                expect(() => GTINValidator.zeroSuppress("112345000055")).toThrow("GTIN-12 not zero-suppressible");
            });

            test("Zero-expand GTIN-12 rule 1", () => {
                expect(GTINValidator.zeroExpand("01234558")).toBe("012345000058");
                expect(GTINValidator.zeroExpand("01234565")).toBe("012345000065");
                expect(GTINValidator.zeroExpand("01234572")).toBe("012345000072");
                expect(GTINValidator.zeroExpand("01234589")).toBe("012345000089");
                expect(GTINValidator.zeroExpand("01234596")).toBe("012345000096");
                expect(() => GTINValidator.zeroExpand("00000154")).toThrow("U.P.C. Company Prefix can't start with \"0000\"");
            });

            test("Zero-expand GTIN-12 rule 2", () => {
                expect(GTINValidator.zeroExpand("04567840")).toBe("045670000080");
                expect(() => GTINValidator.zeroExpand("00001047")).toThrow("U.P.C. Company Prefix can't start with \"0000\"");
            });

            test("Zero-expand GTIN-12 rule 3", () => {
                expect(GTINValidator.zeroExpand("03456703")).toBe("034000005673");
                expect(GTINValidator.zeroExpand("03456712")).toBe("034100005672");
                expect(GTINValidator.zeroExpand("03456721")).toBe("034200005671");
                expect(() => GTINValidator.zeroExpand("00000028")).not.toThrow(RangeError);
            });

            test("Zero-expand GTIN-12 rule 4", () => {
                expect(GTINValidator.zeroExpand("09837532")).toBe("098300000752");
                expect(GTINValidator.zeroExpand("09847531")).toBe("098400000751");
                expect(GTINValidator.zeroExpand("09857530")).toBe("098500000750");
                expect(GTINValidator.zeroExpand("09867539")).toBe("098600000759");
                expect(GTINValidator.zeroExpand("09877538")).toBe("098700000758");
                expect(GTINValidator.zeroExpand("09887537")).toBe("098800000757");
                expect(GTINValidator.zeroExpand("09897536")).toBe("098900000756");
                expect(() => GTINValidator.zeroExpand("00030037")).not.toThrow(RangeError);
            });

            test("Zero-expand error", () => {
                expect(() => GTINValidator.zeroExpand("001234505")).toThrow("Length 9 must be less than or equal to 8");
                expect(() => GTINValidator.zeroExpand("01234506")).toThrow("Invalid check digit");
                expect(() => GTINValidator.zeroExpand("11234506")).toThrow("Invalid zero-suppressed GTIN-12");
                expect(() => GTINValidator.zeroExpand("09800037")).toThrow("Invalid zero-suppressed GTIN-12");
                expect(() => GTINValidator.zeroExpand("09800047")).toThrow("Invalid zero-suppressed GTIN-12");
                expect(() => GTINValidator.zeroExpand("09800052")).toThrow("Invalid zero-suppressed GTIN-12");
            });
        }

        test("GTIN-14", () => {
            const gtin = creator.create(0, true);

            expect(gtin.length).toBe(creator.length);

            let gtin14 = GTINValidator.convertToGTIN14("0", gtin);

            expect(gtin14.length).toBe(14);
            expect(GTINValidator.normalize(gtin14)).toBe(gtin);

            gtin14 = GTINValidator.convertToGTIN14("1", gtin);

            expect(gtin14.length).toBe(14);
            expect(GTINValidator.normalize(gtin14)).not.toBe(gtin);

            gtin14 = GTINValidator.convertToGTIN14("2", gtin14);

            expect(gtin14.length).toBe(14);
            expect(GTINValidator.normalize(gtin14)).not.toBe(gtin);
        });
    });
}
