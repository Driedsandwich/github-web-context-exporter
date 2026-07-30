# Manual Verification Result Template

Use this template after following `docs/07_manual_verification.md`.

Do not expand extraction scope until this result is filled out and any blocking failures are fixed.

## Verification metadata

- Date:
- Verifier:
- Branch or commit:
- Browser name and version:
- OS:
- Extension load method: Load unpacked
- Test repositories/pages used:
  - Public-safe Issue page:
  - Public-safe Pull Request conversation page:
  - Unsupported page:

## Summary result

Choose one:

- [ ] Pass: current behavior is acceptable for the maintainer-controlled public preview.
- [ ] Conditional pass: minor issues recorded below; no privacy, permission, or misleading-output blocker.
- [ ] Fail: stop feature expansion and fix blockers first.

## Checklist

### Load unpacked

- [ ] Extension loads from repository root.
- [ ] Popup opens without crashing.
- [ ] Extension name is correct.

Notes:

```text

```

### Issue page

- [ ] Repository is shown.
- [ ] Type is `issue`.
- [ ] Number is shown.
- [ ] Page title is shown or clear fallback appears.
- [ ] Source includes the current document title and page URL.
- [ ] Body Preview appears or clear fallback appears.
- [ ] Visible Comments Preview appears or clear fallback appears.
- [ ] Body and comment snippets are blockquoted as untrusted content.
- [ ] Hidden or collapsed content is not included.
- [ ] A visible comment is not mislabeled as a missing body.
- [ ] Markdown preview includes limitation language.
- [ ] Markdown preview includes review-before-sharing language.

Notes:

```text

```

### Pull Request conversation page

- [ ] Repository is shown.
- [ ] Type is `pull request`.
- [ ] Number is shown.
- [ ] Page title is shown or clear fallback appears.
- [ ] Source includes the current document title and page URL.
- [ ] Body Preview appears or clear fallback appears.
- [ ] Visible Comments Preview appears or clear fallback appears.
- [ ] Body and comment snippets are blockquoted as untrusted content.
- [ ] Hidden or collapsed content is not included.
- [ ] A visible comment is not mislabeled as a missing body.
- [ ] Markdown preview does not claim Files changed, diffs, checks, or complete review threads.

Notes:

```text

```

### Unsupported pages

- [ ] Repository root page fails safely.
- [ ] Pull Request Files changed page fails safely.
- [ ] Unsupported page keeps Copy disabled.
- [ ] Unsupported page keeps Download disabled.

Notes:

```text

```

### Copy Markdown

- [ ] Copy button enables only when Markdown preview exists.
- [ ] Copy works on Issue page.
- [ ] Copy works on Pull Request conversation page.
- [ ] The button immediately shows `Copied!` after a successful copy.
- [ ] The button returns to `Copy Markdown` after about 1.5 seconds.
- [ ] Failure message is clear if clipboard copy is unavailable.

Notes:

```text

```

### Local save

- [ ] Download button enables only when Markdown preview exists.
- [ ] Local `.md` save works on Issue page.
- [ ] Local `.md` save works on Pull Request conversation page.
- [ ] Filename is usable and page-specific.

Notes:

```text

```

### Permission posture

- [ ] Manifest permissions are exactly `activeTab`, `scripting`, and `clipboardWrite`.
- [ ] No `host_permissions`.
- [ ] No `downloads`.
- [ ] No `tabs`.
- [ ] No `storage`.
- [ ] No `webRequest`.
- [ ] No `identity`.
- [ ] No service worker.

Notes:

```text

```

## Blocking failures

List any failures that must stop feature expansion.

```text

```

## Non-blocking issues

List issues that may be fixed later.

```text

```

## Decision

Choose one:

- [ ] Continue the maintainer-controlled public preview.
- [ ] Fix blockers before further development.
- [ ] Re-run manual verification after fixes.

Decision rationale:

```text

```
