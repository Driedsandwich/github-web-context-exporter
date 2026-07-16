# Requirements

## Supported pages

```text
https://github.com/<owner>/<repo>/issues/<number>
https://github.com/<owner>/<repo>/pull/<number>
```

Pull Request support is limited to the Conversation page.

## Unsupported pages

- Pull Request Files changed pages
- Pull Request commits pages
- Issue and Pull Request list pages
- repository root pages
- GitHub Actions, Projects, and Discussions pages
- GitHub Enterprise domains

## Exported source fields

- repository owner and name
- Issue or Pull Request number
- page type
- source URL
- export timestamp
- exporter name

## Visible-page preview fields

- page title
- visible body preview or an explicit unavailable fallback
- visible comment snippets or an explicit unavailable fallback

The preview does not claim complete state, label, body, comment, review,
diff, check, or files-changed coverage.

## Markdown sections

- `# GitHub Issue Context` or `# GitHub Pull Request Context`
- `## Source`
- `## Limitations`
- `## Review Before Sharing`
- `## Body Preview`
- `## Visible Comments Preview`
- `## Suggested Next Use`

## User actions

- `Copy Markdown`
- `Download Markdown`

## Failure behavior

- Unsupported pages produce no Markdown and keep Copy and Download disabled.
- Metadata injection exceptions or missing results show an explicit extraction failure.
- Injection failures produce no Markdown and keep Copy and Download disabled.
- Missing selector content is an explicit fallback, not an injection failure.

## Privacy and network boundary

- no external transmission
- no GitHub API
- no external LLM API
- no analytics or cloud sync
- no GitHub write operation
- manual review required before sharing exported Markdown
