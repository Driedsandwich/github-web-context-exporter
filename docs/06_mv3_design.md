# Manifest V3 Design

## Runtime shape

```text
manifest.json
src/
  extractor/pageMetadata.js
  markdown/formatMarkdown.js
  popup/popup.html
  popup/popup.css
  popup/popup.js
  shared/filename.js
  shared/githubUrl.js
```

The extension has no service worker or content-script registration.

## Runtime flow

1. The user opens a supported GitHub Issue or Pull Request Conversation page.
2. The user opens the extension popup.
3. The popup classifies the active tab URL.
4. For a supported page, the popup injects a self-contained extractor with
   `chrome.scripting.executeScript`.
5. The extractor reads visible DOM content only.
6. The popup validates the injection result and fails closed if extraction did
   not execute successfully.
7. The formatter creates a visible-page-only Markdown preview.
   The page title remains in a separate `Untrusted Page Title` section inside
   a dynamically sized fenced code block. Page-derived body and comment
   previews remain inside blockquotes marked as untrusted content, with the
   same dynamic-fence rule preventing downstream Markdown renderers from
   activating page-supplied syntax.
8. The user can copy or locally save the Markdown.

## Supported URL patterns

```text
https://github.com/<owner>/<repo>/issues/<number>
https://github.com/<owner>/<repo>/pull/<number>
```

## Extraction principle

Prefer an explicit fallback or extraction failure over a misleading export.
Hidden, collapsed, paginated, dynamically unloaded, diff, check, and
files-changed content is outside the completeness claim.

The extractor uses visible `innerText` for page-derived body and comment
content. It does not fall back to hidden `textContent`.

In this contract, visible means CSS-rendered or potentially visible. Elements
hidden by `hidden` or `inert`, `display: none`, hidden or collapsed visibility,
or zero opacity are excluded. The extractor does not claim that retained
content is inside the viewport, unobscured, or currently on-screen. Viewport
clipping, IntersectionObserver-based checks, and occlusion detection remain
outside the runtime design.

## Rendering principle

Page-derived content is rendered through `textContent` or form-control
`value`, not HTML injection.

## Markdown contract

The output includes:

- Source, containing repository, number, type, canonical URL, export timestamp,
  exporter, and export mode
- Limitations
- Review Before Sharing
- Untrusted Page Title, containing the current title or explicit fallback in a
  dynamically sized Markdown-inert fence
- Body Preview
- Visible Comments Preview
- Suggested Next Use

The document states that it contains visible page content only.
