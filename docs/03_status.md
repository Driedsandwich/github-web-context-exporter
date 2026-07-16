# Status

Last updated: 2026-07-16

## Current phase

Maintainer-controlled OSS preview candidate.

## Implemented

- Chrome Manifest V3 popup
- GitHub Issue and Pull Request Conversation URL classification
- self-contained visible-page metadata injection
- visible title, source URL, body preview, and visible comment snippets
- explicit selector fallbacks
- fail-closed injection-error behavior
- Markdown preview with limitation and review-before-sharing sections
- Copy Markdown with immediate `Copied!` feedback and timed restoration
- local Markdown save without the Chrome Downloads API
- exact manifest-permission regression tests
- public-safe manual verification guide and result template

## Not implemented

- Pull Request Files changed or diff extraction
- complete comment or review-thread extraction
- GitHub Enterprise support
- GitHub API fallback
- automatic redaction or secret detection
- service worker
- packaged release or Chrome Web Store distribution

## Current permissions

- `activeTab`
- `scripting`
- `clipboardWrite`

There are no host permissions.

## Known risks and limits

- GitHub DOM changes can invalidate selectors.
- Visible-page previews are intentionally incomplete.
- Local save depends on normal browser Blob/download behavior.
- Exported Markdown can contain sensitive content visible in the browser.
- A previously reported popup-open delay was not reproduced as a product-code issue.

## Verification baseline

- automated test suite: 29 tests
- public-safe Issue and Pull Request Conversation checks
- unsupported repository-root check
- Copy and Download checks
- manifest-permission check

Verification results describe the tested revision only and are not a
production-readiness guarantee.
