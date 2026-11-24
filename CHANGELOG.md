# Changelog

## 2.0.0

- Refactoring of `*IdentifierDescriptor` types.
  - Every identifier type now has a corresponding identifier descriptor type (e.g., `IdentifierTypes.GMN` -> `GMNDescriptor`).
  - What was previously a base interface (e.g., `interface NumericIdentifierDescriptor extends IdentifierDescriptor` is now a union type (e.g., `type NonNumericIdentifierDescriptor = GIAIDescriptor | GINCDescriptor | CPIDDescriptor | GMNDescriptor`).
- Refactoring of `*IdentifierValidator` types.
  - Every identifier type now has a corresponding identifier validator type (e.g., `IdentifierTypes.GMN` -> `GMNValidator`). 
  - What was previously a base class (e.g., `class NonNumericIdentifierValidator extends IdentifierValidator` is now a union type (e.g., `type NonNumericIdentifierValidator = GIAIValidator | GINCValidator | CPIDValidator | GMNValidator`) of interfaces.
  - Implementing classes are no longer exposed. As validators were pre-constructed, this should not be an issue.
- Refactoring of `*IdentifierCreator` types.
  - Every identifier type now has a corresponding identifier creator type (e.g., `IdentifierTypes.GMN` -> `GMNCreator`). 
  - What was previously a base class (e.g., `class NonNumericIdentifierCreator extends MixinAbstractIdentifierCreator` is now a union type (e.g., `type NonNumericIdentifierCreator = GIAICreator | GINCCreator | CPIDCreator | GMNCreator`) of interfaces.
  - Implementing classes are no longer exposed. As creators were and still are constructed via the `PrefixManager` class, this should not be an issue.
  - If construction via another `PrefixProvider` implementation is required, use the `IdentifierCreatorManager` class. This class contains the caching code previously present in `PrefixManager`, which now delegates to this class.
