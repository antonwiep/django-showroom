# Current Setup

This repository is a standalone Django Storybook template with 3 example components demonstrating the contract-first, multi-framework adapter pattern.

## Core source areas

- `apps/storybook/*` — Django host app (views, catalog, templates, icon infrastructure)
- `design-system/cotton/ds/*` — Example components (button, badge, text_field)
- `design-system/src/tokens.css` — Design tokens
- `design-system/src/icons/*` — Icon source files
- `static/js/*` — JS bundles (core Alpine + storybookReact)
- `static/css/output.css` — Compiled CSS
- `static/icons/design-system/*` — Icon SVGs and manifest
- `templates/includes/scripts.html` — Script loader
- `scripts/*` — Validation and generation scripts

## Django project wiring

- `manage.py`
- `storybook_config/settings.py`
- `storybook_config/urls.py`
- `storybook_config/wsgi.py`
- `storybook_config/asgi.py`
- `storybook_config/template_patches.py`

## Component filtering

You can limit which components appear in the sidebar by setting `STORYBOOK_COMPONENT_ALLOWLIST` in `storybook_config/settings.py`. Set it to `[]` or remove it to show all components.

## What is intentionally not included

- Database models or admin
- Authentication, sessions, or middleware beyond the basics
- Application-specific business logic
- External service dependencies (Postgres, Redis, Celery, etc.)

This keeps the repository focused on Storybook + design system workflows.
