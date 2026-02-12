# Storybook App

Django-native Storybook at `/storybook/`.

It renders:

- Django/Cotton stories (`stories/*.html`)
- React stories (`stories/react.preview.ts`)
- Split comparison mode with shared controls state

## Core Files

- `apps/storybook/views.py`
- `apps/storybook/catalog/components.py`
- `apps/storybook/catalog/registry.py`
- `apps/storybook/templates/storybook/index.html`
- `apps/storybook/storybookReact.runtime.js`
- `apps/storybook/storybookReact.registry.generated.js`
- `scripts/validate-storybook-components.mjs`
- `scripts/generate-storybook-react-registry.mjs`

## Component Inputs

For each component under `design-system/cotton/ds/<component>/`:

- `component.json`
- `stories.json`
- `stories/*.html`
- `stories/controls.json` (optional)
- `stories/react.preview.ts` (optional)

Required metadata shape:

```json
{
  "stories": "stories.json",
  "react": { "preview": "stories/react.preview.ts" },
  "cotton": {
    "template": "ds/<component>/index.html",
    "controls": "stories/controls.json"
  }
}
```

## Runtime Flow

1. Route resolves component/story.
2. `component.json` + `stories.json` are loaded.
3. Story defaults are injected as Alpine `args`.
4. Controls read/write `args`.
5. Mode switch:
   - `Django`: render story template
   - `React`: render React preview for same slug
   - `Split`: render both with shared args

React registry flow:

1. `npm run build:js` runs `scripts/validate-storybook-components.mjs`.
2. Then it runs `scripts/generate-storybook-react-registry.mjs`.
3. Generated registry imports all component `react.preview` files.
4. Runtime mounts `stories[storySlug].render(context)`.

## React Preview Contract (`stories/react.preview.ts`)

- Export `stories` object keyed by `stories.json` slug.
- Each story entry exposes `render(context)`.
- Use `context.args` for shared state.
- Use `context.onArgsChange` to update controls state.
- Use `context.portalContainer` for tooltips/popovers so split + zoom work correctly.

## `args` Rule

`args.*` is allowed only in `stories/*.html` templates.

Do not use `args.*` inside reusable Cotton component templates (`index.html`, `item.html`).

## Validation

- `npm run build:js`
- `npm run build:css`
- `.venv/bin/python -m py_compile apps/storybook/views.py apps/storybook/catalog/*.py`
