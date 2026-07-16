# GitHub Web Context Exporter

GitHub Web Context Exporter is a local-first Chrome Manifest V3 extension that
turns the currently visible GitHub Issue or Pull Request conversation page into
a Markdown preview.

## Status

This repository is a maintainer-controlled OSS preview. The extension is
intended for local use through Chrome's **Load unpacked** workflow.

It is not a production-ready browser extension, a Chrome Web Store package, or
a complete GitHub conversation exporter.

## What it does

- recognizes GitHub Issue pages
- recognizes GitHub Pull Request conversation pages
- extracts the visible title, source URL, body preview, and visible comment snippets
- creates a Markdown preview with explicit limitations and a review-before-sharing warning
- copies the Markdown to the clipboard
- saves the Markdown as a local `.md` file
- fails closed when metadata injection fails
- rejects unsupported GitHub page shapes without generating misleading Markdown

The export is deliberately incomplete. Hidden, collapsed, paginated,
dynamically unloaded, diff, checks, files-changed, and complete review-thread
content may be omitted.

## Install locally

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the repository root.
6. Open a supported GitHub Issue or Pull Request conversation page.
7. Open the extension from the toolbar.

See [the manual verification guide](docs/07_manual_verification.md) for the
full supported-page and failure-mode checklist.

## Permissions

```json
{
  "permissions": ["activeTab", "scripting", "clipboardWrite"]
}
```

The extension has no `host_permissions`, Downloads API permission, service
worker, GitHub API integration, external LLM API integration, analytics, cloud
sync, or external server transmission.

## Privacy and safety

The extension reads content visible in the active GitHub tab after the user
opens the popup. Generated Markdown can contain private repository content,
personal data, logs, credentials, or other sensitive information visible on
the page.

Always review the Markdown before sharing it with an AI tool or another person.
This project does not claim automatic redaction or secret-scanner capability.

See [SECURITY.md](SECURITY.md) for the security policy and reporting route.

## Relationship to Maintainer Context Kit

[Maintainer Context Kit](https://github.com/Driedsandwich/maintainer-context-kit)
defines reusable maintainer handoff and task-packet structures. GitHub Web
Context Exporter is a smaller browser-side entry point that captures only the
currently visible GitHub page context. It does not replace repository-aware
context gathering or generate a complete task packet.

## Development

Requirements:

- Node.js 20 or later
- npm

Run the test suite:

```bash
npm test
```

The repository intentionally has no runtime or development package
dependencies.

## Contributing

This preview is maintainer-controlled. Public-safe bug reports are welcome.
See [CONTRIBUTING.md](CONTRIBUTING.md) before opening an Issue or Pull Request.

## License

MIT. See [LICENSE](LICENSE).
