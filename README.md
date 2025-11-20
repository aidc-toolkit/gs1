# GS1 Package

**Copyright © 2024-2025 Dolphin Data Development Ltd. and AIDC Toolkit contributors**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Overview

> [!WARNING]
> 
> **This software is in beta**, with production release is scheduled for 2025Q4. To follow the status of this and other projects, go to the AIDC Toolkit [projects](https://github.com/orgs/aidc-toolkit/projects) page.

The AIDC Toolkit `gs1` package provides functionality related to the GS1 identification system. It builds on the `utility` package, providing validation and creation functions customized for GS1 identification keys (e.g., including check digit validation and creation). All logic in this package is as defined in the [GS1 General Specifications](https://www.gs1.org/genspecs).

## Check calculation and validation functions

The check calculation and validation functions are separate from the string validation and creation functions so that they may be used in other contexts. All the check calculation functions defined in the GS1 General Specifications are implemented.

### Check digit - GS1 identification key

The [`checkDigit`](https://aidc-toolkit.com/api/GS1/functions/checkDigit.html) function calculates the check digit for a numeric GS1 identification key.

The [`hasValidCheckDigit`](https://aidc-toolkit.com/api/GS1/functions/hasValidCheckDigit.html) function validates the check digit for a numeric GS1 identification key.

### Check digit - price or weight encoding

The [`priceOrWeightCheckDigit`](https://aidc-toolkit.com/api/GS1/functions/priceOrWeightCheckDigit.html) function calculates the check digit for a price or weight.

The [`isValidPriceOrWeightCheckDigit`](https://aidc-toolkit.com/api/GS1/functions/isValidPriceOrWeightCheckDigit.html) function validates the check digit for a price or weight.

These functions are seldom used directly, as there are no use cases for prices or weights on their own. They are used by the variable measure RCN functions if the RCN format requires a price or weight check digit.

### Check character pair - GS1 identification key

The [`checkCharacterPair`](https://aidc-toolkit.com/api/GS1/functions/checkCharacterPair.html) function calculates the check character pair for a non-numeric GS1 identification key, if supported.

The [`hasValidCheckCharacterPair`](https://aidc-toolkit.com/api/GS1/functions/hasValidCheckCharacterPair.html) function validates the check character pair for a non-numeric GS1 identification key, if supported.

## GS1 identification keys

At the core of the AIDC Toolkit `gs1` package is GS1 identification key validation and creation. All GS1 identification key types are supported. A working knowledge of the [GS1 General Specifications](https://www.gs1.org/genspecs) is highly recommended.

### Prefix manager

#### Prefix type

### GS1 identification key validation

### GS1 identification key creation
