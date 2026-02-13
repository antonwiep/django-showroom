# Django Showroom

A Django-native Storybook JS alternative for building design systems. Develop, document, and test atomic UI components in isolation – with multi-framework rendering, shared story contracts, and side-by-side comparison.

![Django Showroom demo](https://raw.githubusercontent.com/antonwiep/django-showroom/main/docs/assets/demo.gif)

## Why this project

Most teams with Django + frontend islands struggle with two recurring issues:

1. **Story drift** across rendering frameworks.
2. **Styling drift** across implementations.

This architecture solves both by making contracts and styling framework-agnostic first, then implementing thin adapters.

Works with any Django template approach — the included examples use [Django Cotton](https://django-cotton.com/) and [Alpine.js](https://alpinejs.dev/) for component encapsulation and interactivity, but plain Django templates and vanilla HTML work just as well.

## Installation

```bash
pip install django-showroom
```

Then add it to your Django project:

```python
# settings.py
INSTALLED_APPS = [
    ...
    "django_cotton",
    "showroom",
]
```

```python
# urls.py
from django.urls import include, path

urlpatterns = [
    path("showroom/", include("showroom.urls")),
]
```

You'll also need Node.js (>=20) for the build step:

```bash
npm install
npm run build
```

Then start your Django dev server and open `/showroom/`.

## How it differs from Storybook.js

| | Django Showroom | storybook-django (Torchbox) |
|---|---|---|
| **Architecture** | Django-native – single server | Storybook.js wrapper – requires Django + Node servers |
| **Story format** | JSON contracts (`component.json`, `stories.json`) | JavaScript CSF (Component Story Format) |
| **Multi-framework** | Cotton, React, Alpine, HTML, vanilla JS – simultaneously | Django templates only (rendered via API) |
| **Split view** | Built-in side-by-side framework comparison | Not available |
| **Design tokens** | Built-in recipe engine for variants and CSS tokens | External (BYO) |
| **Focus** | Atomic design system components | Template previews |

## Adding components

Create a new directory under `components/cotton/ds/your_component/` with:

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

## Example components

The repo ships with 3 example components demonstrating a complexity gradient:

- **Button** – simple, static component with variant/size controls
- **Badge** – medium complexity with data-attribute-driven styling
- **Text Field** – complex form input with label, icons, error states

Each component includes a `component.json` contract, stories, controls, a Cotton template, and a React preview – showing how one story definition renders identically across frameworks.

## Development setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip3 install -e ".[dev]"
npm install
npm run build
python3 manage.py runserver
```

Open: `http://127.0.0.1:8000/showroom/`

## Docs

Full documentation is on [GitHub](https://github.com/antonwiep/django-showroom/tree/main/docs).

## License

[MIT](https://github.com/antonwiep/django-showroom/blob/main/LICENSE)
