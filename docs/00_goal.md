# Goal

Build and maintain a local-first Chrome Manifest V3 extension that exports a
visible-page-only preview of the current GitHub Issue or Pull Request
conversation page to Markdown.

## Product name

`github-web-context-exporter`

## Public posture

The `0.1.0` source is a maintainer-controlled OSS preview for Chrome's
**Load unpacked** workflow. It is not a production-ready package or Chrome Web
Store release.

## Positioning

The extension is a browser-side companion to
[Maintainer Context Kit](https://github.com/Driedsandwich/maintainer-context-kit).
It captures the currently visible GitHub page context. It does not perform
repository-wide discovery or generate a complete maintainer task packet.

## Success criteria

- Supported GitHub Issue pages produce a visible-page Markdown preview.
- Supported Pull Request conversation pages produce a visible-page Markdown preview.
- Copy Markdown and local Markdown save work.
- Unsupported pages and injection failures generate no misleading Markdown.
- Output includes source, limitations, review-before-sharing, body-preview, and visible-comment sections.
- Permissions remain minimal and documented.
- No GitHub API, external LLM API, analytics, cloud sync, or external transmission is used.

## Non-goals

The preview is not a GitHub API client, repository packer, diff exporter,
complete review-thread crawler, secret scanner, redaction tool, or publishing
pipeline.
