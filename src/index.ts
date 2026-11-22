/*!
 * Copyright © 2024-2026 Dolphin Data Development Ltd. and AIDC Toolkit
 * contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export * from "./locale/i18n.js";

export * from "./character-set.js";

export * from "./check.js";

export * from "./prefix-type.js";
export type * from "./validator/prefix-provider.js";
export * from "./validator/prefix-validator.js";

export * from "./content-character-set.js";

export * from "./identifier-type.js";
export * from "./leader-type.js";
export * from "./numeric-identifier-type.js";
export * from "./gtin-type.js";
export * from "./non-gtin-numeric-identifier-type.js";
export * from "./non-serializable-numeric-identifier-type.js";
export * from "./serializable-numeric-identifier-type.js";
export * from "./non-numeric-identifier-type.js";

export type * from "./descriptor/identifier-descriptor.js";
export type * from "./descriptor/numeric-identifier-descriptor.js";
export * from "./gtin-length.js";
export type * from "./descriptor/gtin-descriptor.js";
export type * from "./descriptor/non-gtin-numeric-identifier-descriptor.js";
export type * from "./descriptor/non-serializable-numeric-identifier-descriptor.js";
export type * from "./descriptor/serializable-numeric-identifier-descriptor.js";
export type * from "./descriptor/non-numeric-identifier-descriptor.js";
export * from "./descriptor/identifier-descriptors.js";

export * from "./validator/identifier-validator.js";
export * from "./validator/numeric-identifier-validator.js";
export { GTINLevels, type GTINLevelKey, type GTINLevel, GTINValidator } from "./validator/gtin-validator.js";
export * from "./validator/non-gtin-numeric-identifier-validator.js";
export * from "./validator/non-serializable-numeric-identifier-validator.js";
export * from "./validator/serializable-numeric-identifier-validator.js";
export * from "./validator/non-numeric-identifier-validator.js";
export * from "./validator/identifier-validators.js";

export * from "./service/verified-by-gs1.js";

export type * from "./creator/identifier-creator.js";
export type * from "./creator/numeric-identifier-creator.js";
export * from "./creator/gtin-creator.js";
export type * from "./creator/non-gtin-numeric-identifier-creator.js";
export * from "./creator/non-serializable-numeric-identifier-creator.js";
export * from "./creator/serializable-numeric-identifier-creator.js";
export * from "./creator/non-numeric-identifier-creator.js";
export * from "./creator/identifier-creators.js";

export * from "./misc/variable-measure.js";

export * from "./creator/prefix-manager.js";

export * from "./service/gcp-length-data.js";
export * from "./service/gcp-length-cache.js";
export * from "./service/gcp-length.js";
