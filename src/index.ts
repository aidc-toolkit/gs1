/*!
 * Copyright © 2024-2025 Dolphin Data Development Ltd. and AIDC Toolkit
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
export type * from "./prefix-provider.js";
export * from "./prefix-validator.js";

export * from "./content-character-set.js";

export * from "./identifier-type.js";
export * from "./numeric-identifier-type.js";
export * from "./gtin-type.js";
export type * from "./non-gtin-numeric-identifier-type.js";
export type * from "./serializable-numeric-identifier-type.js";
export type * from "./non-numeric-identifier-type.js";

export type * from "./identifier-descriptor.js";
export type * from "./numeric-identifier-descriptor.js";
export type * from "./gtin-descriptor.js";
export type * from "./non-gtin-numeric-identifier-descriptor.js";
export type * from "./serializable-numeric-identifier-descriptor.js";
export type * from "./non-numeric-identifier-descriptor.js";
export * from "./descriptors.js";

export type * from "./identifier-validator.js";
export type * from "./numeric-identifier-validator.js";
export { GTINLevels, type GTINLevelKey, type GTINLevel, type RCNReference, GTINValidator } from "./gtin-validator.js";
export * from "./non-gtin-numeric-identifier-validator.js";
export * from "./serializable-numeric-identifier-validator.js";
export * from "./non-numeric-identifier-validator.js";
export * from "./validators.js";

export type * from "./identifier-creator.js";
export type * from "./numeric-identifier-creator.js";
export * from "./gtin-creator.js";
export * from "./non-gtin-numeric-identifier-creator.js";
export * from "./serializable-numeric-identifier-creator.js";
export * from "./non-numeric-identifier-creator.js";
export * from "./creators.js";

export * from "./prefix-manager.js";
