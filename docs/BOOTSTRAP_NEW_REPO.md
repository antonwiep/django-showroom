# Bootstrap Into a New Repository

## 1. Create repository

- Create an empty GitHub repo.
- Clone or fork this template repository.

## 2. Replace placeholders

Update:

- `conduct@your-project-domain.example`
- `security@your-project-domain.example`
- GitHub links in `.github/ISSUE_TEMPLATE/config.yml`
- `CODEOWNERS`
- Maintainers list

## 3. Customize

The template contains a working setup out of the box:

- Storybook Django host app (`apps/storybook`)
- 3 example Cotton components (`design-system/cotton/ds/`)
- Build scripts (`scripts/`)
- Django project wiring (`manage.py`, `storybook_config/*`)

Replace example components with your own and update design tokens in `design-system/src/tokens.css`.

## 4. Add build/test infrastructure

- Python dependencies and lockfile
- Node dependencies and lockfile
- CI secrets and cache strategy

## 5. Enable CI checks

- lint
- tests
- django system check
- storybook registry validation

## 6. Publish first alpha

Suggested first tag: `v0.1.0-alpha.1`

Include:

- scope
- known limitations
- contribution guidelines
