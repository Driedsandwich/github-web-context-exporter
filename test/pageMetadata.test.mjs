import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { extractVisiblePageMetadata } from "../src/extractor/pageMetadata.js";

function element(text) {
  return { innerText: text, textContent: text };
}

function createDocument({ kind, title, heading, url, body, comments = [], legacyComments = true }) {
  const bodyElement = element(body);
  const commentElements = comments.map(element);
  const pathname = kind === "issue"
    ? "/octo-org/example/issues/123"
    : "/octo-org/example/pull/456";

  return {
    title,
    location: { pathname, href: url },
    querySelector(selector) {
      if (selector === "h1") {
        return element(heading);
      }

      if (selector === ".js-issue-body") {
        return bodyElement;
      }

      return null;
    },
    querySelectorAll(selector) {
      if (selector === ".js-comment-body") {
        return legacyComments ? [bodyElement, ...commentElements] : [];
      }

      if (selector === '.react-issue-comment [data-testid="markdown-body"]') {
        return commentElements;
      }

      return [];
    }
  };
}

function runAsInjectedFunction(document) {
  return vm.runInNewContext(
    `(${extractVisiblePageMetadata.toString()})()`,
    { document }
  );
}

test("runs as a self-contained injected function for an Issue page", () => {
  const result = runAsInjectedFunction(createDocument({
    kind: "issue",
    title: "Example issue · GitHub",
    heading: "Example issue",
    url: "https://github.com/octo-org/example/issues/123",
    body: "Visible issue body",
    comments: ["First visible comment"]
  }));

  assert.equal(result.title, "Example issue · GitHub");
  assert.equal(result.url, "https://github.com/octo-org/example/issues/123");
  assert.equal(result.visibleContentStatus, "available");
  assert.equal(result.visibleContentPreview, "Visible issue body");
  assert.deepEqual(Array.from(result.visibleComments), ["First visible comment"]);
});

test("runs as a self-contained injected function for a Pull Request page", () => {
  const result = runAsInjectedFunction(createDocument({
    kind: "pull request",
    title: "Example pull request · GitHub",
    heading: "Example pull request",
    url: "https://github.com/octo-org/example/pull/456",
    body: "Visible pull request body",
    comments: ["Review conversation comment"]
  }));

  assert.equal(result.title, "Example pull request · GitHub");
  assert.equal(result.url, "https://github.com/octo-org/example/pull/456");
  assert.equal(result.visibleContentStatus, "available");
  assert.equal(result.visibleContentPreview, "Visible pull request body");
  assert.deepEqual(Array.from(result.visibleComments), ["Review conversation comment"]);
});

test("reports explicit selector fallbacks without treating extraction as failed", () => {
  const document = createDocument({
    kind: "issue",
    title: "Example issue · GitHub",
    heading: "Example issue",
    url: "https://github.com/octo-org/example/issues/123",
    body: ""
  });

  const result = runAsInjectedFunction(document);

  assert.equal(result.visibleContentStatus, "unavailable");
  assert.equal(result.visibleContentPreview, "");
  assert.equal(result.visibleCommentsStatus, "unavailable");
  assert.deepEqual(Array.from(result.visibleComments), []);
});

test("extracts visible comments from the current GitHub Issue viewer markup", () => {
  const result = runAsInjectedFunction(createDocument({
    kind: "issue",
    title: "Example issue · GitHub",
    heading: "Example issue",
    url: "https://github.com/octo-org/example/issues/123",
    body: "Visible issue body",
    comments: ["Current viewer comment"],
    legacyComments: false
  }));

  assert.equal(result.visibleCommentsStatus, "available");
  assert.deepEqual(Array.from(result.visibleComments), ["Current viewer comment"]);
});
