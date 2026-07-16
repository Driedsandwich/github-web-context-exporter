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
  assert.match(markdown, /Export mode: visible-page-preview/);
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
  assert.match(markdown, /This is the visible body preview\./);
});

test("includes visible comments preview", () => {
  const markdown = formatVisibleContextMarkdown({ page: issuePage, metadata, exportedAt: "2026-07-02T00:00:00.000Z" });

  assert.match(markdown, /## Visible Comments Preview/);
  assert.match(markdown, /First visible comment\./);
  assert.match(markdown, /Second visible comment\./);
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
