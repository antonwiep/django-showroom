# Getting Started

## Installation

Install the package from PyPI:

```bash
pip install django-showroom
```

## Django configuration

Add `showroom` and `django_cotton` to your installed apps:

```python
# settings.py
INSTALLED_APPS = [
    ...
    "django_cotton",
    "showroom",
]
```

Add the URL configuration:

```python
# urls.py
from django.urls import include, path

urlpatterns = [
    path("showroom/", include("showroom.urls")),
]
```

## Build step

You'll need Node.js (>=20) for the frontend build:

```bash
npm install
npm run build
```

Then start your Django dev server and open `/showroom/`.

## Adding your first component

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

See [Adding Components](ADDING_COMPONENTS.md) for a full migration guide.

## Development setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip3 install -e ".[dev]"
npm install
npm run build
```

Open: `http://127.0.0.1:8000/showroom/`
