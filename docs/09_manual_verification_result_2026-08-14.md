# Completed Manual-Flow Verification — 2026-08-14

This public-safe receipt records one completed verification run for the exact
revision below. It is evidence for the maintainer-controlled Load unpacked
preview, not a production-readiness or Chrome Web Store claim.

## Tested revision

- Repository: `Driedsandwich/github-web-context-exporter`
- Commit: `639031e038dd61c018f8a8f82556d78883e960cc`
- Tree: `6dccbd212674bee54f9405d79e49a21184848832`

## Verification environment

- Observed at: 2026-08-14 13:19 JST
- Browser: Chrome for Testing 151.0.7922.34
- OS: macOS 26.5.2 (build 25F84)
- Load method: `Load unpacked` through the Chrome DevTools Protocol
  `Extensions.loadUnpacked` command into a fresh isolated profile
- Popup activation: extension action triggered on each tested tab through the
  Chrome DevTools Protocol
- Verifier role: Codex acting as the maintainer-authorized verification agent
- Normal Chrome profile used: no

## Public-safe pages

- Issue: <https://github.com/cli/cli/issues/13891>
- Pull Request Conversation: <https://github.com/cli/cli/pull/13892>
- Unsupported repository root: <https://github.com/cli/cli>

## Completed results

| Check | Result | Observed behavior |
| --- | --- | --- |
| Load unpacked | Pass | The expected extension name and version loaded from the tested revision. |
| Issue metadata | Pass | Repository, type, number, title, canonical URL, body preview, and visible comments were present. |
| Issue Markdown boundary | Pass | The title used the `Untrusted Page Title` fence; body and two visible comments used balanced inert nested fences. |
| Issue Copy | Pass | The real clipboard content matched the preview; `Copied!` appeared and returned to `Copy Markdown`. |
| Issue local save | Pass | The saved Markdown content matched the preview. |
| Pull Request metadata | Pass | Repository, type, number, title, canonical URL, body preview, and visible comments were present. |
| Pull Request Markdown boundary | Pass | The title used the `Untrusted Page Title` fence; body and two visible comments used balanced inert nested fences. |
| Pull Request Copy | Pass | The real clipboard content matched the preview; `Copied!` appeared and returned to `Copy Markdown`. |
| Pull Request local save | Pass | The saved Markdown content matched the preview. |
| Unsupported page | Pass | No Markdown was generated and Copy and Download remained disabled. |
| Permissions | Pass | Permissions were exactly `activeTab`, `scripting`, and `clipboardWrite`; no host permissions were present. |

Both supported exports used canonical source URLs without query or fragment
data. Each generated preview included limitation and review-before-sharing
sections.

## Scope and limitations

- The run used public pages only. It did not inspect a private repository.
- The isolated headed browser flow was driven through Chrome DevTools Protocol
  commands; it was not an unaided human click-through.
- A temporary isolated-browser clipboard permission was used to exercise the
  real clipboard path. The manifest permission posture was checked separately,
  and the pre-run clipboard content was restored.
- The unsupported-page fail-safe was exercised. Injection-exception behavior
  remained covered by the automated test suite rather than being forced in the
  public GitHub pages.
- The run verifies this exact commit and tree only. Later GitHub DOM or browser
  changes require a fresh receipt.
- The preview remains deliberately incomplete and requires human review before
  sharing.

## Decision

Pass for the stated maintainer-controlled Load unpacked preview scope. No
blocking failure was observed in this exact-revision run.
