# Contracts

This document defines baseline schemas and evolution rules for core metadata contracts.

## Contract philosophy

- Contracts are user-facing API.
- Adapter behavior depends on contract stability.
- Breaking changes require deprecation and migration notes.

## `component.json` (v1)

### Required keys

- `slug` (string): unique component ID
- `label` (string): display label
- `type` (string): usually `component`
- `order` (number): sorting priority
- `stories` (string or array): story definitions
- `cotton` (object): cotton adapter metadata

### Optional keys

- `react` (object): react preview metadata

### `cotton` object

- `template` (string, required)
- `controls` (string or object, optional)

### `react` object

- `preview` (string, optional)

## `stories.json` (v1)

Array of story objects.

Each story object:

- `slug` (string, required)
- `name` (string, required)
- `template` (string, required)
- `defaults` (object, optional)
- `controls` (array of strings, optional)

## Controls schema (v1)

Object keyed by control key. Example control object:

- `name` (string)
- `label` (string)
- `type` (`text` | `textarea` | `number` | `boolean` | `select`)
- Optional type-specific fields (`min`, `max`, `step`, `options`, `rows`)

## React preview contract

File path referenced by `react.preview` should export:

```ts
export const stories = {
  default: {
    render(context) {
      return ...;
    }
  }
}
```

Allowed forms:

- `stories.<slug> = function(context) {}`
- `stories.<slug> = { render(context) {} }`

## Validation expectations

Validation should fail when:

- Required keys are missing.
- Unsupported keys are present (strict mode).
- Story template path shape is invalid.
- Referenced files do not exist.
- React story keys do not match story slugs.

Validation may warn when:

- React preview is missing for a story.
- Optional controls are missing.

## Compatibility and deprecation

- Additive changes: allowed in minor releases.
- Key removals/renames: major release only.
- Deprecated keys should stay supported for at least one minor release window.
