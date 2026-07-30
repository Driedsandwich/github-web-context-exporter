# Manual Verification Guide

Last updated: 2026-07-30

This guide verifies the current local extension behavior. It is not a release or store-publishing checklist.

## Current supported pages

- GitHub Issue page: `github.com/<owner>/<repo>/issues/<number>`
- GitHub Pull Request conversation page: `github.com/<owner>/<repo>/pull/<number>`

Unsupported in the current scope:

- Pull Request Files changed page
- Pull Request commits page
- repository root page
- GitHub Actions page
- GitHub Projects page
- GitHub Discussions page
- GitHub Enterprise domains

## Privacy rule before testing

Use public-safe or synthetic pages where possible.

If testing on private repository pages, do not paste, publish, screenshot, or share generated Markdown until you have reviewed it. The extension works from visible page content and can include sensitive material that is visible in the browser.

## Load the extension locally

1. Open Chrome or a Chromium-based browser.
2. Go to `chrome://extensions`.
3. Enable Developer mode.
4. Click `Load unpacked`.
5. Select the repository root.
6. Confirm the extension appears as `GitHub Web Context Exporter`.

## Verify an Issue page

1. Open a GitHub Issue page.
2. Open the extension popup.
3. Confirm the popup shows:
   - repository
   - type: issue
   - number
   - page title
   - visible preview
   - visible comments count or unavailable message
4. Confirm the Markdown preview includes:
   - `GitHub Issue Context`
   - `Source`
   - the current document title and page URL under `Source`
   - `Limitations`
   - `Review Before Sharing`
   - `Body Preview`
   - `Visible Comments Preview`
   - `Suggested Next Use`
5. Confirm body and comment snippets are blockquoted as untrusted page content.
6. Click `Copy Markdown`.
7. Confirm the button immediately changes to `Copied!`.
8. Confirm the button returns to `Copy Markdown` after about 1.5 seconds.
9. Paste into a local scratch document and confirm Markdown was copied.
10. Click `Download Markdown`.
11. Confirm a local `.md` file is saved with a repository/page-based filename.

## Verify a Pull Request conversation page

1. Open a GitHub Pull Request conversation page.
2. Open the extension popup.
3. Confirm the popup shows:
   - repository
   - type: pull request
   - number
   - page title
   - visible preview or unavailable message
   - visible comments count or unavailable message
4. Confirm the Markdown preview includes:
   - `GitHub Pull Request Context`
   - `Source`
   - the current document title and page URL under `Source`
   - `Limitations`
   - `Review Before Sharing`
   - `Body Preview`
   - `Visible Comments Preview`
   - `Suggested Next Use`
5. Confirm body and comment snippets are blockquoted as untrusted page content.
6. Confirm the preview does not claim to include Files changed, diffs, checks, hidden or collapsed content, or complete review threads.
7. Confirm Copy and Download behave the same as on Issue pages.

## Verify unsupported pages

1. Open a repository root page.
2. Open the extension popup.
3. Confirm the popup says to open a supported Issue or Pull Request conversation page.
4. Confirm Copy and Download remain disabled.
5. Repeat on a Pull Request Files changed page.

## Permission check

Open the extension details page and confirm the manifest permission posture remains:

```json
{
  "permissions": ["activeTab", "scripting", "clipboardWrite"]
}
```

Current exclusions:

- no host permissions
- no `downloads` permission
- no `tabs`
- no `storage`
- no `webRequest`
- no `identity`
- no service worker

## Pass criteria

Manual verification passes when:

- supported Issue pages produce a Markdown preview
- supported Pull Request conversation pages produce a Markdown preview
- Source records the current document title and page URL
- body and comment snippets remain inside blockquotes as untrusted content
- hidden or collapsed DOM content is not promoted into body or comment previews
- a visible comment is not promoted into a missing body preview
- unsupported pages fail safely
- Copy Markdown works, shows `Copied!`, and restores its label
- Download Markdown saves a local `.md` file
- generated Markdown includes limitation and review-before-sharing sections
- permissions remain unchanged

## Stop conditions

Stop and open a follow-up issue if:

- a supported page crashes the popup
- unsupported pages produce misleading Markdown
- the output claims completeness that is not implemented
- permissions expand unexpectedly
- generated Markdown omits the review-before-sharing warning
- hidden or collapsed DOM text appears in the generated preview
- a comment is mislabeled as the page body
- local save requires a new permission
