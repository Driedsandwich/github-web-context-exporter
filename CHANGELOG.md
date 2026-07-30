# Changelog

All notable product changes will be recorded in this file.

## Unreleased — 0.1.0 preview baseline

- Added a Chrome Manifest V3 popup for supported GitHub Issue and Pull Request conversation pages.
- Added visible title, source URL, body preview, and visible comment-snippet extraction.
- Added Markdown preview, Copy Markdown, and local Markdown save.
- Added fail-closed handling for metadata injection failures.
- Added unsupported-page safeguards and exact manifest-permission tests.
- Added immediate `Copied!` feedback with timed label restoration.
- Added public-safe manual verification guidance.
- Restricted body and comment extraction to visible `innerText` without hidden
  `textContent` fallback.
- Added page title provenance to Markdown output.
- Added structural blockquote boundaries for untrusted body and comment
  previews.
- Added regression checks for hidden content, Markdown structure, background
  runtime absence, and external communication primitives.

This entry describes the source preview. It is not a release, tag, package, or
Chrome Web Store publication record.
