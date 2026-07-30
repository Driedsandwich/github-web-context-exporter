# Security Policy

## Supported status

The current `0.1.0` code is a maintainer-controlled OSS preview distributed
for local use through Chrome's **Load unpacked** workflow. There is no packaged
release or Chrome Web Store distribution.

Security fixes are made on the default branch. No long-term support promise is
made for earlier preview revisions.

## Report a vulnerability

Use GitHub Private Vulnerability Reporting from the repository's **Security**
tab and select **Report a vulnerability**.

Do not place credentials, private repository content, private logs, identifying
screenshots, or exploit details in a public Issue. If the private reporting
route is temporarily unavailable, open a public-safe Issue that contains no
sensitive details and asks the maintainer to restore a private contact route.

## Data boundary

The extension can export anything visible on the active GitHub page. Generated
Markdown may contain confidential project details, personal information, logs,
or credentials.

Review the Markdown before sharing it. The extension does not provide automatic
redaction, secret detection, or completeness guarantees.

## Runtime posture

The preview is designed to avoid:

- external server transmission
- GitHub API calls
- LLM API calls
- analytics or cloud sync
- GitHub write operations
- remote hosted executable code
- broad host permissions

The approved Manifest V3 permissions are:

- `activeTab`
- `scripting`
- `clipboardWrite`

Any permission or network expansion requires an explicit design decision and
review before implementation.

## Test and fixture policy

Examples, screenshots, fixtures, and documentation samples must be synthetic
or public-safe. Do not commit real private repository content or generated
exports containing sensitive information.
