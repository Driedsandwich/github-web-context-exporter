# AGENTS.md

Instructions for AI coding agents working in this repository.

## Product contract

Build and maintain GitHub Web Context Exporter: a local-first Chrome Manifest
V3 extension that exports a visible-page-only preview of one GitHub Issue or
Pull Request conversation page to Markdown.

The `0.1.0` line is a maintainer-controlled OSS preview. It is not a
repository packer, complete conversation crawler, task-packet generator,
browser automation agent, secret scanner, or GitHub write tool.

## Hard boundaries

Do not add without an explicit maintainer decision:

- GitHub API access
- external LLM API calls
- external server transmission
- analytics or cloud sync
- GitHub write operations
- repository-wide scraping
- complete diff, checks, or review-thread export
- remote hosted executable code
- broad host permissions
- Chrome Web Store publication work

## Local data boundary

The extension may export anything visible on the active GitHub page. Preserve
the review-before-sharing warning and use synthetic or public-safe examples
only.

If extraction fails, generate no Markdown and keep Copy and Download disabled.
Selector-level content absence must remain distinguishable from injection
failure.

## Permission boundary

The approved permissions are:

- `activeTab`
- `scripting`
- `clipboardWrite`

Do not add `host_permissions`, `downloads`, `tabs`, `storage`,
`webRequest`, `identity`, `<all_urls>`, or a service worker without a
separate reviewed decision.

## Work style

- Use one focused Issue and Pull Request per concern.
- Do not push directly to `main`.
- Do not merge, release, publish, or change visibility without explicit approval.
- Keep dependencies at zero unless a reviewed requirement proves otherwise.
- Update user-facing documentation when behavior, permissions, risk, or verification changes.
- Run `npm test` after implementation changes.
- Run the manual verification guide after popup or extraction behavior changes.

## Documentation

Keep these aligned with the implementation:

- `README.md`
- `SECURITY.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `docs/01_requirements.md`
- `docs/02_runbook.md`
- `docs/03_status.md`
- `docs/04_decisions.md`
