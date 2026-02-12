# story-core

> Part of [Django Showroom](../../README.md)

Framework-agnostic contracts and validation logic for component stories.

## What this package defines

- **`component.json` schema** – component metadata (slug, label, type, adapter paths)
- **`stories.json` schema** – story definitions with defaults and control references
- **`controls.json` schema** – control field definitions (type, options, defaults)
- **Validation** – JSON Schema validators for all contract files

## Key principle

No rendering logic belongs here. This package defines _what_ a component is and _what_ its stories look like. Adapters handle _how_ to render them.

## Schemas

- [`component.schema.json`](component.schema.json)
- [`stories.schema.json`](stories.schema.json)
