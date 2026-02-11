# Contributing

Thanks for contributing. This project is contract-first: changes should preserve or intentionally evolve shared contracts before adapter-specific behavior.

## Before opening a pull request

1. Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
2. Check open issues for overlap.
3. For larger work, open a proposal issue first.

## Ways to contribute

- Bug fixes
- Adapter parity improvements
- Documentation and examples
- Contract validation improvements
- Test coverage for split mode and controls syncing

## Local development (recommended baseline)

- Python 3.11+
- Node 20+
- npm 10+

Suggested command contract for this repo:

```bash
make setup
make lint
make test
make typecheck
make django-check
make build-storybook
```

If `make` is not used in your setup, provide equivalent `npm` and `python` commands in the root README.

## Development principles

- Keep story metadata framework-neutral.
- Keep recipe styling logic framework-neutral.
- Prefer adapter thinness over adapter-specific behavior.
- Avoid duplicating component markup in story files.
- Put story-only wiring in story files, not component templates.

## Adding or updating a component contract

1. Update `component.json` and `stories.json`.
2. Ensure controls schema is complete and deterministic.
3. Validate contract.
4. Ensure adapters render the same story slugs.
5. Add/extend parity tests.

## Adding a new framework adapter

1. Add adapter package under `packages/adapter-<framework>/`.
2. Implement adapter interface from `docs/ADAPTERS.md`.
3. Add parity test fixtures for existing components.
4. Document unsupported features explicitly.
5. Add adapter status to roadmap.

## Pull request expectations

- Small, focused PRs are preferred.
- Include reasoning in PR description.
- Include before/after screenshots for UI-impacting changes.
- Include migration notes for breaking contract changes.

## Commit style

Conventional Commits are recommended:

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`

## Review and merge policy

- At least one maintainer approval required.
- Contract changes require two maintainer approvals.
- CI must pass before merge.

## Questions

Open a discussion if you are unsure where a change belongs.
