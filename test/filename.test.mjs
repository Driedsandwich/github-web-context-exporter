import test from "node:test";
import assert from "node:assert/strict";
import { createMarkdownFilename } from "../src/shared/filename.js";

test("creates a markdown filename from page metadata", () => {
  assert.equal(
    createMarkdownFilename({
      page: { owner: "Octo Org", repo: "Example Repo", kind: "pull request", number: "123" },
      exportedAt: "2026-07-02T14:20:30.000Z"
    }),
    "octo-org-example-repo-pull-request-123-20260702142030.md"
  );
});

test("uses safe fallbacks", () => {
  assert.match(createMarkdownFilename({ exportedAt: "2026-07-02T14:20:30.000Z" }), /^github-context-page-unknown-20260702142030\.md$/);
});
