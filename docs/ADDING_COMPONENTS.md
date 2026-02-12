# Adding Components From an Existing Codebase

This guide describes how to migrate components from an existing Django project into Django Showroom.

## Per-component migration

For each component you want to add:

1. Create `design-system/cotton/ds/<component>/component.json` with metadata.
2. Create `stories.json` with story definitions and defaults.
3. Create `stories/controls.json` with control field definitions.
4. Copy or create the Cotton template as `index.html`.
5. Add story templates under `stories/*.html`.
6. Optionally add a React preview as `stories/react.preview.ts`.

## After adding components

Run `npm run build` to:

- Validate all component contracts.
- Regenerate the React story registry.
- Rebuild JS bundles.

## Compatibility strategy

Keep initial compatibility with existing contracts to reduce migration risk:

- Preserve existing metadata keys.
- Preserve story slug conventions.
- Preserve React preview export shape.

Evolve contracts only after baseline parity is proven.
