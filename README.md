# Django Storybook

A Django-native component development environment for building design systems. Develop, document, and test atomic UI components in isolation — with multi-framework rendering, shared story contracts, and side-by-side comparison.

## Why this project

Most teams with Django + frontend islands struggle with two recurring issues:

1. **Story drift** across rendering frameworks.
2. **Styling drift** across implementations.

This architecture solves both by making contracts and styling framework-agnostic first, then implementing thin adapters.

## How it differs from Storybook.js integrations

| | Django Storybook | storybook-django (Torchbox) |
|---|---|---|
| **Architecture** | Django-native — single server | Storybook.js wrapper — requires Django + Node servers |
| **Story format** | JSON contracts (`component.json`, `stories.json`) | JavaScript CSF (Component Story Format) |
| **Multi-framework** | Cotton, React, Alpine, HTML, vanilla JS — simultaneously | Django templates only (rendered via API) |
| **Split view** | Built-in side-by-side framework comparison | Not available |
| **Design tokens** | Built-in recipe engine for variants and CSS tokens | External (BYO) |
| **Focus** | Atomic design system components | Template previews |

## Architecture at a glance

1. **story-core** — normalized story and controls contracts (JSON schemas).
2. **recipe-engine** — token, variant, and class generation rules.
3. **Framework adapters** — map normalized contracts to framework-specific rendering.
4. **Django host app** — navigation, controls panel, mode switching, and split view.

For full details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Repository structure

```text
.
├── apps/
│   └── storybook/            # Django host app (views, catalog, templates)
├── packages/
│   ├── story-core/            # Metadata contracts and validation
│   ├── recipe-engine/         # CSS token and variant generation
│   ├── adapter-django/        # Django template adapter
│   ├── adapter-html/          # Static HTML adapter
│   ├── adapter-cotton/        # Cotton component adapter
│   ├── adapter-alpine/        # Alpine.js runtime adapter
│   ├── adapter-js/            # Vanilla JavaScript adapter
│   └── adapter-react/         # React preview adapter
├── design-system/
│   ├── cotton/ds/             # Example components (button, badge, text_field)
│   └── src/                   # Design tokens (CSS variables)
├── static/                    # CSS, JS bundles, icons
├── scripts/                   # Build and validation scripts
├── storybook_config/          # Django project settings
├── docs/                      # Architecture and contributor docs
└── .github/                   # CI workflows and issue templates
```

## Getting started

### 1. Install dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip3 install -e .
npm install
```

### 2. Build

```bash
npm run build
```

This validates component contracts, generates the React story registry, and bundles the JS.

### 3. Run Django checks and start the dev server

```bash
python3 manage.py check
python3 manage.py runserver
```

Open: `http://127.0.0.1:8000/storybook/`

## Example components

The repo ships with 3 example components demonstrating a complexity gradient:

- **Button** — simple, static component with variant/size controls
- **Badge** — medium complexity with data-attribute-driven styling
- **Text Field** — complex form input with label, icons, error states

Each component includes a `component.json` contract, stories, controls, a Cotton template, and a React preview — showing how one story definition renders identically across frameworks.

## Adding your own components

Create a new directory under `design-system/cotton/ds/your_component/` with:

```text
your_component/
├── component.json            # Metadata (slug, label, adapter paths)
├── stories.json              # Story definitions with defaults
├── stories/
│   ├── controls.json         # Control field definitions
│   ├── default.html          # Django/Cotton story template
│   └── react.preview.ts      # React story renderer (optional)
└── index.html                # Cotton component template
```

Then run `npm run build` to validate and regenerate the registry.

## Component scoping

Limit which components appear in the Storybook navigation by setting `STORYBOOK_COMPONENT_ALLOWLIST` in `storybook_config/settings.py`:

```python
STORYBOOK_COMPONENT_ALLOWLIST = ["button", "badge"]
```

Set it to `[]` or remove it to show all components.

## Project goals

- Keep story definitions reusable between all renderers.
- Keep component APIs stable across renderers.
- Minimize duplicated markup in story files.
- Make migrations incremental (component by component).
- Make contribution paths clear for external contributors.

## Non-goals (for v1)

- Replacing existing Storybook.js ecosystem entirely.
- Runtime compilation of templates in the browser.
- Supporting every frontend framework in initial release.

## Key docs

- [Architecture overview](docs/ARCHITECTURE.md)
- [Contract details](docs/CONTRACTS.md)
- [Adapter boundary](docs/ADAPTERS.md)
- [Recipe model](docs/RECIPES.md)
- [Split mode behavior](docs/SPLIT_VIEW.md)

## Community and support

- Usage and setup questions: GitHub Discussions
- Bug reports: GitHub Issues using bug template
- Security concerns: see [SECURITY.md](SECURITY.md)

## Status

Pre-1.0. API and directory contracts may evolve while adapters stabilize.
