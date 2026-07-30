# Runbook

## Requirements

- Google Chrome
- Node.js 20 or later
- npm

No package installation is required because the project has no dependencies.

## Automated verification

```bash
npm test
```

The suite covers URL classification, Markdown formatting, filename generation,
manifest permissions, self-contained metadata injection, fail-closed behavior,
hidden-content exclusion, untrusted Markdown framing, runtime network
boundaries, unsupported pages, and Copy feedback.

## Load unpacked

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the repository root.
5. Confirm the extension is named **GitHub Web Context Exporter**.

## Minimum smoke test

Use public-safe pages:

1. Open a GitHub Issue and confirm title, URL, body preview, and visible comments.
2. Copy Markdown and confirm the button temporarily says `Copied!`.
3. Download Markdown and confirm a local page-specific `.md` file is saved.
4. Repeat on a Pull Request Conversation page.
5. Open a repository root page and confirm Markdown, Copy, and Download remain unavailable.

Use [07_manual_verification.md](07_manual_verification.md) for the complete
manual checklist.

## Failure triage

- If a supported URL is rejected, inspect `src/shared/githubUrl.js`.
- If extraction fails, inspect `src/extractor/pageMetadata.js` and keep the popup fail-closed.
- If selector content is absent, preserve the explicit unavailable fallback.
- Do not add host permissions, API fallbacks, or external transmission as a quick fix.
