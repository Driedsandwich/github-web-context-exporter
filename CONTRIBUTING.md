# Contributing

GitHub Web Context Exporter is currently a maintainer-controlled OSS preview.

## Bug reports

Public-safe bug reports are welcome. Use the Bug report Issue form and include:

- the affected GitHub page shape
- Chrome and operating-system versions
- exact reproduction steps
- expected and actual behavior

Do not include private repository content, credentials, personal data, private
logs, or identifying screenshots.

Security concerns must follow [SECURITY.md](SECURITY.md), not a public Issue.

## Pull Requests

The project is not currently accepting unsolicited feature Pull Requests.
Discuss a proposed change with the maintainer before starting implementation.
The maintainer may close uncoordinated Pull Requests without review.

Accepted work follows:

```text
1 Issue -> 1 branch -> 1 focused Pull Request -> CI -> maintainer review
```

Each Pull Request must describe its scope, verification, privacy impact,
permission impact, and dependency impact. Do not push directly to `main`.

## Product boundaries

Do not add these without an explicit maintainer decision:

- GitHub API access
- external transmission
- external LLM API calls
- analytics or cloud sync
- GitHub write operations
- broad host permissions
- remote hosted executable code
- complete diff or review-thread export claims
- Chrome Web Store publication work

## Verification

Run:

```bash
npm test
```

When popup behavior changes, also follow
[docs/07_manual_verification.md](docs/07_manual_verification.md) with
public-safe pages.
