# Recipe CSS System

## Purpose

Recipes provide a single source of truth for component styling semantics across all adapters.

## Requirements

- Recipe definitions are framework-agnostic.
- Output class names are deterministic.
- Variants and compound variants are explicit.
- Tokens map to CSS custom properties.

## Core model

- `base`: always-applied class rules.
- `variants`: named dimensions and values.
- `compoundVariants`: specific combinations.
- `defaultVariants`: baseline state.

## Naming and output policy

- Prefix generated classes consistently (example: `ds-`).
- Keep class generation stable across builds.
- Avoid framework-specific selectors in recipe definitions.

## Example recipe contract

```json
{
  "name": "button",
  "base": ["ds-button"],
  "variants": {
    "variant": {
      "primary": "ds-button--primary",
      "secondary": "ds-button--secondary"
    },
    "size": {
      "sm": "ds-button--sm",
      "md": "ds-button--md"
    }
  },
  "compoundVariants": [
    {
      "when": {"variant": "primary", "size": "sm"},
      "class": "ds-button--primary-sm"
    }
  ],
  "defaultVariants": {
    "variant": "primary",
    "size": "md"
  }
}
```

## Adapter usage

Adapters should:

- Resolve recipe classes from args.
- Merge with structural classes required by renderer.
- Never duplicate recipe semantics in adapter code.

## Validation

- Every recipe file should be schema-validated.
- Every component should include at least one recipe file.
- Every story default variant should map to valid recipe values.
