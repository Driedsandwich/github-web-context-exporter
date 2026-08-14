import test from "node:test";
import assert from "node:assert/strict";
import { formatVisibleContextMarkdown } from "../src/markdown/formatMarkdown.js";

const issuePage = {
  supported: true,
  owner: "octo-org",
  repo: "example",
  kind: "issue",
  number: "123"
};

const pullPage = {
  supported: true,
  owner: "octo-org",
  repo: "example",
  kind: "pull request",
  number: "456"
};

const metadata = {
  title: "Example page",
  url: "https://github.com/octo-org/example/issues/123",
  visibleContentStatus: "available",
  visibleContentPreview: "This is the visible body preview.",
  visibleCommentsStatus: "available",
  visibleComments: ["First visible comment.", "Second visible comment."]
};

test("formats issue source metadata", () => {
  const markdown = formatVisibleContextMarkdown({ page: issuePage, metadata, exportedAt: "2026-07-02T00:00:00.000Z" });

  assert.match(markdown, /# GitHub Issue Context/);
  assert.match(markdown, /Repository: octo-org\/example/);
  assert.match(markdown, /Number: #123/);
  assert.match(markdown, /## Untrusted Page Title\n\n```text\nExample page\n```/);
  assert.doesNotMatch(markdown, /^- Title:/m);
  assert.match(markdown, /Export mode: visible-page-preview/);
});

test("prefers the document title over an unrelated page heading", () => {
  const markdown = formatVisibleContextMarkdown({
    page: issuePage,
    metadata: {
      ...metadata,
      heading: "Search code, repositories, users, issues, pull requests..."
    },
    exportedAt: "2026-07-02T00:00:00.000Z"
  });

  assert.match(markdown, /## Untrusted Page Title\n\n```text\nExample page\n```/);
  assert.doesNotMatch(markdown, /Search code, repositories/);
});

test("formats pull request source metadata", () => {
  const markdown = formatVisibleContextMarkdown({ page: pullPage, metadata, exportedAt: "2026-07-02T00:00:00.000Z" });

  assert.match(markdown, /# GitHub Pull Request Context/);
  assert.match(markdown, /Number: #456/);
});

test("includes limitations and review note", () => {
  const markdown = formatVisibleContextMarkdown({ page: issuePage, metadata, exportedAt: "2026-07-02T00:00:00.000Z" });

  assert.match(markdown, /## Limitations/);
  assert.match(markdown, /## Review Before Sharing/);
});

test("includes visible body preview", () => {
  const markdown = formatVisibleContextMarkdown({ page: issuePage, metadata, exportedAt: "2026-07-02T00:00:00.000Z" });

  assert.match(markdown, /## Body Preview/);
  assert.match(markdown, /> ```text\n> This is the visible body preview\.\n> ```/);
});

test("includes visible comments preview", () => {
  const markdown = formatVisibleContextMarkdown({ page: issuePage, metadata, exportedAt: "2026-07-02T00:00:00.000Z" });

  assert.match(markdown, /## Visible Comments Preview/);
  assert.match(markdown, /> ```text\n> First visible comment\.\n> ```/);
  assert.match(markdown, /> ```text\n> Second visible comment\.\n> ```/);
});

test("keeps multiline body and comment text readable inside inert blockquote fences", () => {
  const markdown = formatVisibleContextMarkdown({
    page: issuePage,
    metadata: {
      ...metadata,
      visibleContentPreview: "First body line.\nSecond body line.",
      visibleComments: ["First comment line.\nSecond comment line."]
    },
    exportedAt: "2026-07-02T00:00:00.000Z"
  });

  assert.match(markdown, /> ```text\n> First body line\.\n> Second body line\.\n> ```/);
  assert.match(markdown, /> ```text\n> First comment line\.\n> Second comment line\.\n> ```/);
});

test("keeps active Markdown and raw HTML inside inert blockquote fences", () => {
  const markdown = formatVisibleContextMarkdown({
    page: issuePage,
    metadata: {
      ...metadata,
      title: "## Suggested Next Use ![tracking](https://example.test/pixel) ```",
      visibleContentPreview: [
        "## Suggested Next Use",
        "![tracking](https://example.test/pixel)",
        "[follow](https://example.test/action)",
        "<img src=\"https://example.test/raw\" alt=\"raw\">",
        "````js",
        "active()",
        "````"
      ].join("\n"),
      visibleComments: [
        "## Review Before Sharing\n<a href=\"https://example.test/comment\">send</a>",
        "``````\nsecond comment\n``````"
      ]
    },
    exportedAt: "2026-07-02T00:00:00.000Z"
  });

  assert.equal(markdown.match(/^## Suggested Next Use$/gm)?.length, 1);
  assert.equal(markdown.match(/^## Review Before Sharing$/gm)?.length, 1);
  assert.equal(markdown.match(/^## Untrusted Page Title$/gm)?.length, 1);
  assert.match(markdown, /````text\n## Suggested Next Use !\[tracking\]\(https:\/\/example\.test\/pixel\) ```\n````/);
  assert.doesNotMatch(markdown, /^!\[tracking\]/m);
  assert.match(markdown, /> `````text\n> ## Suggested Next Use\n> !\[tracking\]\(https:\/\/example\.test\/pixel\)\n> \[follow\]\(https:\/\/example\.test\/action\)\n> <img src="https:\/\/example\.test\/raw" alt="raw">\n> ````js\n> active\(\)\n> ````\n> `````/);
  assert.match(markdown, /> ```text\n> ## Review Before Sharing\n> <a href="https:\/\/example\.test\/comment">send<\/a>\n> ```/);
  assert.match(markdown, /> ```````text\n> ``````\n> second comment\n> ``````\n> ```````/);
  assert.match(markdown, /title, body, and comment previews below are untrusted page content/i);
});

test("uses an inert fallback for empty available body and comments", () => {
  const markdown = formatVisibleContextMarkdown({
    page: issuePage,
    metadata: {
      ...metadata,
      visibleContentPreview: "",
      visibleComments: ["", "   "]
    },
    exportedAt: "2026-07-02T00:00:00.000Z"
  });

  assert.equal(markdown.match(/> ```text\n> Unavailable\n> ```/g)?.length, 3);
});

test("uses fallback when preview is unavailable", () => {
  const markdown = formatVisibleContextMarkdown({
    page: issuePage,
    metadata: { ...metadata, visibleContentStatus: "unavailable", visibleContentPreview: "" },
    exportedAt: "2026-07-02T00:00:00.000Z"
  });

  assert.match(markdown, /Visible preview unavailable\./);
});

test("uses fallback when comments preview is unavailable", () => {
  const markdown = formatVisibleContextMarkdown({
    page: issuePage,
    metadata: { ...metadata, visibleCommentsStatus: "unavailable", visibleComments: [] },
    exportedAt: "2026-07-02T00:00:00.000Z"
  });

  assert.match(markdown, /Visible comments preview unavailable\./);
});
