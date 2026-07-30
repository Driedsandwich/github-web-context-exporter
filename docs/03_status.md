# Status

Last updated: 2026-07-30

## Current phase

Maintainer-controlled public OSS preview.

## Implemented

- Chrome Manifest V3 popup
- GitHub Issue and Pull Request Conversation URL classification
- self-contained visible-page metadata injection
- visible title, source URL, body preview, and visible comment snippets
- rendered-visibility checks that reject hidden, inert, transparent, or
  non-rendered body/comment elements
- explicit body selectors that do not promote the first comment into a
  missing body preview
- fail-closed injection-error behavior
- Markdown preview with limitation and review-before-sharing sections
- title provenance and blockquoted untrusted body/comment previews
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

- automated test suite: 38 tests in this local candidate
- exact local candidate loaded with `Load unpacked` in an isolated Chrome for
  Testing profile on 2026-07-30
- public-safe Issue check covering title, canonical URL, visible body, and
  visible comments
- public-safe Pull Request Conversation check covering title, canonical URL,
  visible body, and an explicit no-visible-comments fallback
- unsupported repository-root check with no Markdown and disabled Copy/save
- successful user-gesture Copy check, including `Copied!` feedback and timed
  restoration
- successful local Markdown save for both the Issue and Pull Request
- manifest-permission check for `activeTab`, `scripting`, and `clipboardWrite`,
  with no host permissions

Verification results describe the tested revision only and are not a
production-readiness guarantee.

## Current product interpretation

The extension is a short orientation snapshot, not a faithful full-conversation
export. Body and comment previews are deliberately capped. State, labels,
complete bodies, full comment history, review threads, diffs, and check results
remain outside the current scope.

Maintainer Context Kit is a separate repository-aware workflow. There is no
automatic file import, stdin bridge, or shared runtime schema between the
projects.
