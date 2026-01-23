# GS1 Package

**Copyright © 2024-2026 Dolphin Data Development Ltd. and AIDC Toolkit contributors**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Overview

The AIDC Toolkit `gs1` package provides functionality related to the GS1 identification system. It builds on the `utility` package, providing validation and creation functions customized for GS1 identifiers (e.g., including check digit validation and creation). All logic in this package is as defined in the [GS1 General Specifications](https://ref.gs1.org/standards/genspecs/).

## Character Sets

The GS1 system supports four character sets:

- Numeric
  - Digits '0' to '9'.
  - Required by most GS1 identifiers.
  - Required by many GS1 Application Identifiers.
  - [Validator](https://aidc-toolkit.com/v1.0/api/Utility/variables/NUMERIC_VALIDATOR.html) and [creator](https://aidc-toolkit.com/v1.0/api/Utility/variables/NUMERIC_CREATOR.html) defined in the Utility package.
- GS1 AI encodable character set 82
  - Equivalent to ISO/IEC 646 Table 1 - Unique graphic character allocations.
  - Required by all non-numeric GS1 identifiers except CPID.
  - Required by many GS1 Application Identifiers.
  - [Validator](https://aidc-toolkit.com/v1.0/api/GS1/variables/AI82_VALIDATOR.html) and [creator](https://aidc-toolkit.com/v1.0/api/GS1/variables/AI82_CREATOR.html) defined in this package.
- GS1 AI encodable character set 39
  - Digits '0' to '9', uppercase letters 'A' to 'Z', and the characters '#', '-', and '/'.
  - Required by the CPID GS1 identifier.
  - [Validator](https://aidc-toolkit.com/v1.0/api/GS1/variables/AI39_VALIDATOR.html) and [creator](https://aidc-toolkit.com/v1.0/api/GS1/variables/AI39_CREATOR.html) defined in this package.
- GS1 AI encodable character set 64
  - Characters that result from base 64 encoding [as described in RFC 4648](https://www.rfc-editor.org/rfc/rfc4648.html#section-4).
  - Required by GS1 Application Identifier 8030 Digital Signature.
  - [Validator](https://aidc-toolkit.com/v1.0/api/GS1/variables/AI64_VALIDATOR.html) defined in this package.
    - No creator is defined as creation is the base 64 process.

## Check Calculation and Validation Functions

The check calculation and validation functions are separate from the string validation and creation functions so that they may be used in other contexts. All the check calculation functions defined in the GS1 General Specifications are implemented.

### Check Digit - GS1 Identifier

The [`checkDigit()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/checkDigit.html) function calculates the check digit for a numeric GS1 identifier.

The [`hasValidCheckDigit()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/hasValidCheckDigit.html) function validates the check digit for a numeric GS1 identifier.

### Check Digit - Price or Weight Encoding

The [`priceOrWeightCheckDigit()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/priceOrWeightCheckDigit.html) function calculates the check digit for a price or weight.

The [`isValidPriceOrWeightCheckDigit()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isValidPriceOrWeightCheckDigit.html) function validates the check digit for a price or weight.

These functions are seldom used directly, as there are no use cases for prices or weights on their own. They are used by the variable measure RCN functions if the RCN format requires a price or weight check digit.

### Check Character Pair - GS1 Identifier

The [`checkCharacterPair()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/checkCharacterPair.html) function calculates the check character pair for a non-numeric GS1 identifier, if supported.

The [`hasValidCheckCharacterPair()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/hasValidCheckCharacterPair.html) function validates the check character pair for a non-numeric GS1 identifier, if supported.

## GS1 Identifiers

At the core of the AIDC Toolkit `gs1` package is GS1 identifier validation and creation. All GS1 identifier types are supported. A working knowledge of the [GS1 General Specifications](https://ref.gs1.org/standards/genspecs/) is highly recommended.

### Prefix Type

Before going into the identifiers themselves, it's necessary to understand the prefix types supported by the GS1 system.

- [GS1 Company Prefix](https://aidc-toolkit.com/v1.0/api/GS1/variables/PrefixTypes.html#gs1companyprefix)
  - This is the core prefix type and the one to which all others can be converted. Every GS1 identifier contains a GS1 Company Prefix.
    - For example, using GS1 Company Prefix 9521234 and item reference 99999, you can create the 13-digit GTIN 9521234999997. Similarly, using GS1 Company Prefix 9521234 and model reference ABCDEF, you can create the GMN 9521234ABCDEFK2. 
- [U.P.C. Company Prefix](https://aidc-toolkit.com/v1.0/api/GS1/variables/PrefixTypes.html#upccompanyprefix)
  - This is a special version of the GS1 Company Prefix used **only** to create 12-digit GTINs. All U.P.C. Company Prefixes are issued directly or indirectly by GS1 US to support the requirement for 12-digit GTINs in the North American marketplace.
    - For example, using U.P.C. Company Prefix 614141 and item reference 99999, you can create the 12-digit GTIN 614141999996.
  - A U.P.C. Company Prefix may be used to create other GS1 identifiers, but it must first be converted to a GS1 Company Prefix by prepending a zero.
    - For example, using U.P.C. Company Prefix 614141 and model reference ABCDEF, you can convert the prefix to GS1 Company Prefix 0614141 and create the GMN 0614141ABCDEF8P.
- [GS1-8 Prefix](https://aidc-toolkit.com/v1.0/api/GS1/variables/PrefixTypes.html#gs18prefix)
  - This is a special version of the GS1 Company Prefix used **only** to create 8-digit GTINs for special purpose applications where a trade item isn't large enough to support a 13-digit GTIN. GS1-8 Prefixes are managed by individual GS1 Member Organizations and, while they are supported within this library, they are not available to users directly.
  - A GS1-8 Prefix may **not** be used to create other GS1 identifiers.

In general:

- If you are based outside North America and you are not selling product in the North American marketplace, you most likely have a GS1 Company Prefix.
- If you are based outside North America and you are selling product in the North American marketplace, you may have a *separate* U.P.C. Company Prefix for that purpose. This is not necessarily true for newer companies or product lines as the North American marketplace now fully supports 13-digit GTINs.
- If you are based inside North America, you most likely have a U.P.C. Company Prefix.

Another way to tell is to look at your existing barcodes. If the text beneath the barcode is 13 digits long, you have a GS1 Company Prefix. If the text beneath the barcode is 12 digits long, you have a U.P.C. Company Prefix.

If you're unsure, contact your local [GS1 Member Organization](https://www.gs1.org/contact/overview).

### Identifier Types and Descriptors

All identifier types are supported. Constants are defined in [`IdentifierTypes`](https://aidc-toolkit.com/v1.0/api/GS1/variables/IdentifierTypes.html), which is used to define the type alias [`IdentifierType`](https://aidc-toolkit.com/v1.0/api/GS1/type-aliases/IdentifierType.html).

Internally, identifier types are broken down into categories. Each category builds on the one above by adding new properties, defined in a descriptor type:

- [Base identifier descriptor](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/IdentifierDescriptor.html)
  - [Numeric identifier descriptor](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NumericIdentifierDescriptor.html)
    - [GTIN descriptor](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/GTINDescriptor.html) - Global Trade Item Number
      - *GTIN-13*
      - *GTIN-12*
      - *GTIN-8*
    - [Non-GTIN numeric identifier descriptor](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NonGTINNumericIdentifierDescriptor.html)
      - [Non-serializable numeric identifier descriptor](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NonSerializableNumericIdentifierDescriptor.html)
        - *GLN* - Global Location Number
        - *SSCC* - Serial Shipping Container Code
        - *GSRN* - Global Service Relation Number
        - *GSIN* - Global Shipment Identification Number
      - [Serializable numeric identifier descriptor](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/SerializableNumericIdentifierDescriptor.html)
        - *GRAI* - Global Returnable Asset Identifier
        - *GDTI* - Global Document Type Identifier
        - *GCN* - Global Coupon Number
  - [Non-numeric identifier descriptor](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NonNumericIdentifierDescriptor.html)
    - *GIAI* - Global Individual Asset Identifier
    - *GINC* - Global Identification Number for Consignment
    - *CPID* - Component/Part Identifier
    - *GMN* - Global Model Number

The identifier descriptors are stored in a [record object](https://aidc-toolkit.com/v1.0/api/GS1/variables/IdentifierDescriptors.html), keyed on identifier type. The GTIN entry is an array (GTIN-13, GTIN-12, and GTIN-8); all others are singletons. To deal with an unknown identifier descriptor, there are typeguards available, aligned with the categories above:

- [`isGTINDescriptors()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isGTINDescriptors.html)
  - Special case to identify the GTIN descriptors array entry. 
- [`isNumericIdentifierDescriptor()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNumericIdentifierDescriptor.html)
  - [`isGTINDescriptor()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isGTINDescriptor.html)
  - [`isNonGTINNumericIdentifierDescriptor()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonGTINNumericIdentifierDescriptor.html)
    - [`isNonSerializableNumericIdentifierDescriptor()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonSerializableNumericIdentifierDescriptor.html)
    - [`isSerializableNumericIdentifierDescriptor()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isSerializableNumericIdentifierDescriptor.html)
- [`isNonNumericIdentifierDescriptor()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonNumericIdentifierDescriptor.html)

### Identifier Validation

Every identifier descriptor interface has a corresponding identifier validator class, which implements the interface and adds validation logic. The core method is [`validate()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/IdentifierValidator.html#validate), which takes an identifier string and either returns if valid or throws a [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) if not.

Validation is based on the string validation functions defined in the Utility package. As such, the `validate()` method can take additional validation parameters, depending on the identifier type.

- [Base identifier validator](https://aidc-toolkit.com/v1.0/api/GS1/classes/IdentifierValidator.html)
  - [Numeric identifier validator](https://aidc-toolkit.com/v1.0/api/GS1/classes/NumericIdentifierValidator.html)
    - Validation can include a position offset, but this is managed internally by derived classes.
    - [GTIN validator](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html)
    - [Non-GTIN numeric identifier validator](https://aidc-toolkit.com/v1.0/api/GS1/classes/NonGTINNumericIdentifierValidator.html)
      - [Non-serializable numeric identifier validator](https://aidc-toolkit.com/v1.0/api/GS1/classes/NonSerializableNumericIdentifierValidator.html)
      - [Serializable numeric identifier validator](https://aidc-toolkit.com/v1.0/api/GS1/classes/SerializableNumericIdentifierValidator.html)
  - [Non-numeric identifier validator](https://aidc-toolkit.com/v1.0/api/GS1/classes/NonNumericIdentifierValidator.html)
    - Validation can include exclusion of all-numeric references. The check character pair, if applicable, is not included in the all-numeric check (e.g., GMNs `9528888123423` and `952999912343X` both fail exclude all-numeric validation even though the latter has a non-numeric check character pair).

The identifier validators are stored in a [record object](https://aidc-toolkit.com/v1.0/api/GS1/variables/IdentifierValidators.html), keyed on identifier type. The GTIN entry is an array (GTIN-13, GTIN-12, and GTIN-8); all others are singletons. To deal with an unknown identifier validator, there are typeguards available, aligned with the categories above:

- [`isGTINValidators()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isGTINValidators.html)
  - Special case to identify the GTIN validators array entry.
- [`isNumericIdentifierValidator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNumericIdentifierValidator.html)
  - [`isGTINValidator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isGTINValidator.html)
  - [`isNonGTINNumericIdentifierValidator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonGTINNumericIdentifierValidator.html)
    - [`isNonSerializableNumericIdentifierValidator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonSerializableNumericIdentifierValidator.html)
    - [`isSerializableNumericIdentifierValidator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isSerializableNumericIdentifierValidator.html)
- [`isNonNumericIdentifierValidator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonNumericIdentifierValidator.html)

#### GTIN Validation

GTIN validation is special in that there are multiple lengths of GTINs and variations in use cases that limit what GTINs may be used for what purpose. To support this, there are static functions defined in the [`GTINValidator`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html) class:

- [`zeroSuppress()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html#zerosuppress) - Applies a special compression algorithm to certain GTIN-12s to suppress zeros and reduce the length to 8 digits for encoding in a UPC-E barcode.
- [`zeroExpand()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html#zeroexpand) - Expands a zero-suppressed GTIN-12 to its original form.
- [`convertToGTIN14()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html#converttogtin14) - Converts any GTIN to GTIN-14 form with an indicator digit. If the indicator digit is not provided, the default is "0", unless the input is already a GTIN-14, in which case the indicator digit is preserved.
- [`normalize()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html#normalize) - Normalizes a GTIN to the shortest form possible.
- [`validateAny()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html#validateany) - Validates a GTIN of any length and optionally against the [level at which it is used](https://aidc-toolkit.com/v1.0/api/GS1/variables/GTINLevels.html).
- [`validateGTIN14()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINValidator.html#validategtin14) - The GTIN-14 doesn't have its own instance of `GTINValidator` as it is subordinate to the other lengths, so this method specifically validates a GTIN-14.

### Identifier Creation

Every identifier validator class has an extending identifier creator class which adds creation logic. To create an identifier, **you must have a properly licensed GS1 Company Prefix or U.P.C. Company Prefix**. To acquire a licence, contact your local [GS1 Member Organization](https://www.gs1.org/contact/overview).

Creation is based on the string creation functions defined in the Utility package, with additional rules for prefixes and check digits and check character pairs. The constructor for every class takes a [`PrefixProvider`](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/PrefixProvider.html) object, which defines the prefix type and the prefix itself. Every class has one or more `create*()` methods whose parameters depend on the identifier type.

Architecturally, base functionality is defined via interfaces, with only concrete classes exposed.

- [Base identifier creator](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/IdentifierCreator.html)
  - [Numeric identifier creator](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NumericIdentifierCreator.html)
    - [`create()`](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NumericIdentifierCreator.html#create) - Create a single numeric identifier or a sequence of numeric identifiers.
    - [`createAll()`](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NumericIdentifierCreator.html#createall) - Create all numeric identifiers for a prefix.
    - [GTIN creator](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINCreator.html)
      - [`createGTIN14()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GTINCreator.html#creategtin14) - Create a single GTIN-14 or a sequence of GTIN-14s.
    - [Non-GTIN numeric identifier creator](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/NonGTINNumericIdentifierCreator.html)
      - [Non-serializable numeric identifier creator](https://aidc-toolkit.com/v1.0/api/GS1/classes/NonSerializableNumericIdentifierCreator.html)
      - [Serializable numeric identifier creator](https://aidc-toolkit.com/v1.0/api/GS1/classes/SerializableNumericIdentifierCreator.html)
        - [`createSerialized()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/SerializableNumericIdentifierCreator.html#createserialized) - Create a single serialized numeric identifier or a sequence of serialized numeric identifiers.
        - [`concatenate()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/SerializableNumericIdentifierCreator.html#concatenate) - Concatenate a base (non-serialized) with a single serialized component or a sequence of serialized components.
  - [Non-numeric identifier creator](https://aidc-toolkit.com/v1.0/api/GS1/classes/NonNumericIdentifierCreator.html)
    - [`create()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/NonNumericIdentifierCreator.html#create) - Create a single non-numeric identifier or a sequence of non-numeric i[numeric-identifier-creator.ts](src/numeric-identifier-creator.ts)dentifiers.

Because identifier creators depend on a prefix, there are no instantiations of them. To deal with an unknown identifier creator, there are typeguards available, aligned with the categories above:

- [`isNumericIdentifierCreator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNumericIdentifierCreator.html)
  - [`isGTINCreator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isGTINCreator.html)
  - [`isNonGTINNumericIdentifierCreator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonGTINNumericIdentifierCreator.html)
    - [`isNonSerializableNumericIdentifierCreator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonSerializableNumericIdentifierCreator.html)
    - [`isSerializableNumericIdentifierCreator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isSerializableNumericIdentifierCreator.html)
- [`isNonNumericIdentifierCreator()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/isNonNumericIdentifierCreator.html)

#### Sparse Creation

In some cases it may be necessary, or at least desirable, to obfuscate the sequence of identifiers. Suppose, for example, that a distributor is tracking a manufacturer's SSCCs (container identifiers), and that those identifiers are sequential. Not every container goes to the distributor, but over time the distributor infers, based only on the sequence, that the manufacturer is shipping 1,000 containers per day. A year later, that estimate is down to 800 per day. With nothing more than the SSCCs, the distributor can reasonably infer that the manufacturer's business is down 20%. This is market intelligence that can be used in contract negotiation or in stock trading.

Generating a sparse sequence of identifiers can obfuscate shipping volume, product breadth, and more. Sparse creation is supported directly for numeric identifier types and indirectly for non-numeric identifier types.

The `create()` method for numeric identifiers takes an optional `sparse` parameter:

```typescript
import { Sequence } from "@aidc-toolkit/utility";
import { PrefixManager } from "./prefix-manager.js";
import { PrefixTypes } from "./prefix-type.js";

const prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234");
const ssccCreator = prefixManager.ssccCreator;

// [
//   '095212340000000006',
//   '095212340000000013',
//   '095212340000000020',
//   '095212340000000037'
// ]
console.log(Array.from(ssccCreator.create(new Sequence(0, 4))));

// [
//   '695212348513196058',
//   '095212342385021768',
//   '895212341183340022',
//   '695212347219122989'
// ]
console.log(Array.from(ssccCreator.create(new Sequence(0, 4), true)));
```

Each call to `create()` returns the first four SSCCs in sequence, but the second call uses the [`EncryptionTransformer`](https://aidc-toolkit.com/v1.0/api/Utility/classes/EncryptionTransformer.html) to obfuscate the sequence.

The `create()` method for non-numeric identifiers works on a string or sequence of strings, so it doesn't support the `sparse` parameter. The obfuscation must applied to the strings before they are passed to the creator:

```typescript
import { ALPHANUMERIC_CREATOR, Exclusions, Sequence } from "@aidc-toolkit/utility";
import { PrefixManager } from "./prefix-manager.js";
import { PrefixTypes } from "./prefix-type.js";

const prefixManager = PrefixManager.get(PrefixTypes.GS1CompanyPrefix, "9521234");
const gmnCreator = prefixManager.gmnCreator;

// [
//   '9521234000000006X',
//   '9521234000000016Z',
//   '95212340000000273',
//   '95212340000000375'
// ]
console.log(Array.from(gmnCreator.create(
    ALPHANUMERIC_CREATOR.create(8, new Sequence(0, 4))
)));

// [
//   '9521234DYA4ZLUR26',
//   '9521234L89JPA7WKV',
//   '9521234G64FQHPSFR',
//   '9521234I5OZPGZL23'
// ]
console.log(Array.from(gmnCreator.create(
    ALPHANUMERIC_CREATOR.create(8, new Sequence(0, 4), Exclusions.None, 123456)
)));
```

Again, each call to `create()` returns the first four GMNs in sequence (indirectly via the alphanumeric string creator), but the second call uses the [`EncryptionTransformer`](https://aidc-toolkit.com/v1.0/api/Utility/classes/EncryptionTransformer.html) to obfuscate the sequence.

### Prefix Manager

The [`PrefixProvider`](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/PrefixProvider.html) required by every identifier creator is just an object. It has no validation logic, and the creator classes assume that its contents are correct. The  [`PrefixManager`](https://aidc-toolkit.com/v1.0/api/GS1/classes/PrefixManager.html) class implements the `PrefixProvider` interface and provides a convenient way to access the various identifier creators. It also manages the tweak values for sparse numeric identifier creation.

There are two ways to create a `PrefixManager`, both of which take a [prefix type](https://aidc-toolkit.com/v1.0/api/GS1/type-aliases/PrefixType.html) and a prefix:

- Directly via the constructor.
- Indirectly via the [`PrefixManager.get()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/PrefixManager.html#get) static method.

Using the static method is preferred because guarantees that only one instance of the prefix manager is maintained for each prefix and it preserves changes to the prefix manager, such as setting the tweak factor for sparse numeric identifier creation.

The default tweak factor for sparse numeric identifier creation is the numeric value of "1" plus the GS1 Company Prefix (e.g., 19521234 for GS1 Company Prefix 9521234, 10614141 for U.P.C. Company Prefix 614141). The tweak factor isn't used directly by the identifier creators; instead, it is used as a multiplier together with an internally-defined prime number per numeric identifier type so that each numeric identifier creator returns a different sequence of identifiers.

The prefix manager maintains a cache of identifier creators, each accessible by name (e.g., `prefixManager.ssccCreator` for the SSCC creator), as well as the method [`getIdentifierCreator()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/PrefixManager.html#getidentifiercreator) to get any identifier creator by identifier type.

### Additional Identifier Capability

#### Variable Measure

The [`VariableMeasure`](https://aidc-toolkit.com/v1.0/api/GS1/classes/VariableMeasure.html) class provides static methods to parse and create a variable measure identifiers:

- [`parseRCN()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/VariableMeasure.html#parsercn) - Parse a Restricted Circulation Number (RCN) into an item reference and price or weight.
- [`createRCN()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/VariableMeasure.html#creatercn) - Create a Restricted Circulation Number (RCN) from an item reference and price or weight.

### GS1 Services

GS1 provides a lookup service called [Verified by GS1](https://www.gs1.org/services/verified-by-gs1) that can be used to retrieve basic information about a product (GTIN) or party/location (GLN), as well as GS1 Company Prefix licence information for all identifier types. It also provides a barcode/EPC interoperability table (https://www.gs1.org/standards/bc-epc-interop) that can be used to determine the length of a GS1 Company Prefix for encoding GS1 identifiers as EPC URNs.

#### Verified by GS1

The [`verifiedByGS1()`](https://aidc-toolkit.com/v1.0/api/GS1/functions/verifiedByGS1.html) function creates a [`Hyperlink`](https://aidc-toolkit.com/v1.0/api/Core/interfaces/Hyperlink.html) object with the appropriate path to query any GS1 identifier. The link is to a user interface, so automated retrieval of the data is not supported.

#### GS1 Company Prefix Length Determination

GS1 Company Prefix length determination is required when encoding a GS1 identifier as an EPC URN. Though this is typically done by the GS1 Company Prefix licensee (who knows the length), it's occasionally required by downstream trading partners such as distributors.

This functionality part of the [`PrefixManager`](https://aidc-toolkit.com/v1.0/api/GS1/classes/PrefixManager.html) class.

The first step is to load the GS1 Company Prefix length data. This is done using [`loadGCPLengthData()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/PrefixManager.html#loadgcplengthdata) static method, which takes a [`GCPLengthCache`](https://aidc-toolkit.com/v1.0/api/GS1/classes/GCPLengthCache.html) object. The cache object is used to store the data so that it can be shared across multiple instances of the prefix manager.

The `loadGCPLengthData()` method works as follows:

- If the next check date/time is in the future, the method returns immediately, regardless of whether any data is available. It does this to prevent a large number of requests to the source in the event of a failure.
- Otherwise, if the cache date/time is undefined or less than the source date/time, it loads from the source, converts the data if necessary, and updates the cache.
- Otherwise, it continues with the cached data.
- The next check date/time is updated to the later of the source date/time plus one week and the current date/time plus one day.

The base class implementation of the `GCPLengthCache` manages only the cache itself, and it requires an application-provided [`AppDataStorage`](https://aidc-toolkit.com/v1.0/api/Core/classes/AppDataStorage.html) storage implementation. The source is expected to be either a [`GCPLengthData`](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/GCPLengthData.html) object (created via another cache implementation) or a [`GCPLengthSourceJSON`](https://aidc-toolkit.com/v1.0/api/GS1/interfaces/GCPLengthSourceJSON.html) object, which is the format of the file provided by GS1.

The [`RemoteGCPLengthCache`](https://aidc-toolkit.com/v1.0/api/GS1/classes/RemoteGCPLengthCache.html) class provides access to the data from a remote source, by default the AIDC Toolkit website. If any error occurs, the next check date/time is set to the current date/time plus ten minutes to prevent the network from being overloaded.

The data on the AIDC Toolkit website is updated regularly with the data provided by GS1, and it's stored in binary format for faster retrieval.

Once the data is loaded, the [`gcpLength()`](https://aidc-toolkit.com/v1.0/api/GS1/classes/PrefixManager.html#gcplength) method can be used to get the length of a GS1 Company Prefix for a given identifier type.
