# Decisions

## Visible-page-only preview

Decision: export only content visible and extractable from the active GitHub
Issue or Pull Request Conversation page.

Reason: this keeps the preview small, browser-first, and honest about
completeness.

## Companion to Maintainer Context Kit

Decision: position this extension as a browser-side input companion to
[Maintainer Context Kit](https://github.com/Driedsandwich/maintainer-context-kit),
not as a replacement or complete task-packet generator.

## No GitHub API or external transmission

Decision: the `0.1.0` preview does not use GitHub API, external LLM APIs,
analytics, cloud sync, or external server transmission.

Reason: local-first behavior is the core trust boundary.

## Minimal permissions

Decision: use only `activeTab`, `scripting`, and `clipboardWrite`.

Reason: extraction is user-triggered for the active tab, and Copy Markdown is a
core action. No persistent host permission is required.

## Local save without Downloads API

Decision: save Markdown with a Blob URL and temporary anchor.

Reason: this avoids adding the Chrome Downloads API permission.

## Self-contained injection

Decision: every dependency used by the injected metadata extractor stays
inside the injected function.

Reason: `chrome.scripting.executeScript` serializes the supplied function
without its module lexical scope.

## Fail closed

Decision: an injection exception or missing result produces no Markdown and
keeps Copy and Download disabled.

Reason: recognizing a supported URL does not prove extraction succeeded.
Selector-level content absence remains a separate explicit fallback.

## Maintainer-controlled OSS preview

Decision: publish source under the MIT License as an unpacked-extension preview
without release, package, store-distribution, production-readiness, complete
export, redaction, or secret-scanner claims.

Reason: the tested local workflow is useful, while broader distribution and
support promises remain out of scope.
