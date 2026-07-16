import test from "node:test";
import assert from "node:assert/strict";
import { classifyGitHubUrl } from "../src/shared/githubUrl.js";

test("classifies GitHub issue URLs", () => {
  assert.deepEqual(classifyGitHubUrl("https://github.com/octo-org/example/issues/123"), {
    supported: true,
    owner: "octo-org",
    repo: "example",
    kind: "issue",
    number: "123"
  });
});

test("classifies GitHub pull request conversation URLs", () => {
  assert.deepEqual(classifyGitHubUrl("https://github.com/octo-org/example/pull/456"), {
    supported: true,
    owner: "octo-org",
    repo: "example",
    kind: "pull request",
    number: "456"
  });
});

test("rejects pull request files pages", () => {
  assert.equal(classifyGitHubUrl("https://github.com/octo-org/example/pull/456/files").supported, false);
});

test("rejects pull request commits pages", () => {
  assert.equal(classifyGitHubUrl("https://github.com/octo-org/example/pull/456/commits").supported, false);
});

test("rejects non-GitHub URLs", () => {
  assert.equal(classifyGitHubUrl("https://example.com/octo-org/example/issues/123").supported, false);
});

test("rejects malformed URLs", () => {
  assert.equal(classifyGitHubUrl("not a url").supported, false);
});
