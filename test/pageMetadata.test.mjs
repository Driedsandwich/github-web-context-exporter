import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { extractVisiblePageMetadata } from "../src/extractor/pageMetadata.js";

function element(text, { visible = true } = {}) {
  return {
    innerText: text,
    textContent: text,
    checkVisibility() {
      return visible;
    },
    getClientRects() {
      return visible ? [{}] : [];
    }
  };
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

test("uses the explicit Pull Request body container without promoting comments", () => {
  const bodyElement = element("Visible pull request body");
  const commentElement = element("Review conversation comment");
  const document = {
    title: "Example pull request · GitHub",
    location: {
      pathname: "/octo-org/example/pull/456",
      href: "https://github.com/octo-org/example/pull/456"
    },
    querySelector(selector) {
      if (selector === "h1") {
        return element("Example pull request");
      }
      if (selector === ".js-command-palette-pull-body .js-comment-body") {
        return bodyElement;
      }
      return null;
    },
    querySelectorAll(selector) {
      return selector === ".js-comment-body"
        ? [bodyElement, commentElement]
        : [];
    }
  };

  const result = runAsInjectedFunction(document);

  assert.equal(result.visibleContentStatus, "available");
  assert.equal(result.visibleContentPreview, "Visible pull request body");
  assert.deepEqual(Array.from(result.visibleComments), ["Review conversation comment"]);
});

test("does not duplicate a nested body through its comment-container ancestor", () => {
  const bodyElement = element("Visible issue body");
  const bodyContainer = {
    ...element("Visible issue body"),
    contains(candidate) {
      return candidate === bodyElement;
    }
  };
  const commentElement = element("Visible issue comment");
  const document = {
    title: "Nested Issue body · GitHub",
    location: {
      pathname: "/octo-org/example/issues/123",
      href: "https://github.com/octo-org/example/issues/123"
    },
    querySelector(selector) {
      if (selector === "h1") {
        return element("Nested Issue body");
      }
      if (selector === '#issue-body-viewer [data-testid="markdown-body"]') {
        return bodyElement;
      }
      return null;
    },
    querySelectorAll(selector) {
      return selector === ".js-comment-body"
        ? [bodyContainer, commentElement]
        : [];
    }
  };

  const result = runAsInjectedFunction(document);

  assert.equal(result.visibleContentPreview, "Visible issue body");
  assert.deepEqual(Array.from(result.visibleComments), ["Visible issue comment"]);
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

test("does not fall back to hidden textContent for body or comments", () => {
  const hiddenBody = element("HIDDEN PRIVATE BODY", { visible: false });
  const hiddenComment = element("HIDDEN PRIVATE COMMENT", { visible: false });
  const document = {
    title: "Hidden content fixture · GitHub",
    location: {
      pathname: "/octo-org/example/issues/123",
      href: "https://github.com/octo-org/example/issues/123"
    },
    querySelector(selector) {
      if (selector === "h1") {
        return element("Visible heading");
      }
      if (selector === ".js-issue-body") {
        return hiddenBody;
      }
      return null;
    },
    querySelectorAll(selector) {
      return selector === ".js-comment-body" ? [hiddenBody, hiddenComment] : [];
    }
  };

  const result = runAsInjectedFunction(document);

  assert.equal(result.heading, "Visible heading");
  assert.equal(result.visibleContentStatus, "unavailable");
  assert.equal(result.visibleContentPreview, "");
  assert.equal(result.visibleCommentsStatus, "unavailable");
  assert.deepEqual(Array.from(result.visibleComments), []);
  assert.equal(JSON.stringify(result).includes("HIDDEN PRIVATE"), false);
});

test("does not promote the first visible comment to a missing body preview", () => {
  const hiddenBody = element("HIDDEN PRIVATE BODY", { visible: false });
  const visibleComment = element("VISIBLE COMMENT");
  const document = {
    title: "Missing body fixture · GitHub",
    location: {
      pathname: "/octo-org/example/issues/123",
      href: "https://github.com/octo-org/example/issues/123"
    },
    querySelector(selector) {
      if (selector === "h1") {
        return element("Visible heading");
      }
      if (selector === ".js-issue-body") {
        return hiddenBody;
      }
      return null;
    },
    querySelectorAll(selector) {
      return selector === ".js-comment-body"
        ? [hiddenBody, visibleComment]
        : [];
    }
  };

  const result = runAsInjectedFunction(document);

  assert.equal(result.visibleContentStatus, "unavailable");
  assert.equal(result.visibleContentPreview, "");
  assert.equal(result.visibleCommentsStatus, "available");
  assert.deepEqual(Array.from(result.visibleComments), ["VISIBLE COMMENT"]);
  assert.equal(JSON.stringify(result).includes("HIDDEN PRIVATE"), false);
});

test("falls back to computed style and geometry when checkVisibility is unavailable", () => {
  const view = {
    getComputedStyle(node) {
      return node.computedStyle;
    }
  };
  const hiddenAncestor = {
    computedStyle: { display: "block", visibility: "hidden", opacity: "1" },
    parentElement: null
  };
  const hiddenBody = {
    innerText: "HIDDEN PRIVATE BODY",
    hidden: false,
    closest() {
      return null;
    },
    ownerDocument: { defaultView: view },
    parentElement: hiddenAncestor,
    computedStyle: { display: "block", visibility: "visible", opacity: "1" },
    getClientRects() {
      return [{}];
    }
  };
  const visibleComment = {
    innerText: "VISIBLE COMMENT",
    hidden: false,
    closest() {
      return null;
    },
    ownerDocument: { defaultView: view },
    parentElement: null,
    computedStyle: { display: "block", visibility: "visible", opacity: "1" },
    getClientRects() {
      return [{}];
    }
  };
  const document = {
    title: "Visibility fallback fixture · GitHub",
    defaultView: view,
    location: {
      pathname: "/octo-org/example/issues/123",
      href: "https://github.com/octo-org/example/issues/123"
    },
    querySelector(selector) {
      if (selector === "h1") {
        return visibleComment;
      }
      if (selector === ".js-issue-body") {
        return hiddenBody;
      }
      return null;
    },
    querySelectorAll(selector) {
      return selector === ".js-comment-body"
        ? [hiddenBody, visibleComment]
        : [];
    }
  };

  const result = runAsInjectedFunction(document);

  assert.equal(result.visibleContentStatus, "unavailable");
  assert.equal(result.visibleContentPreview, "");
  assert.deepEqual(Array.from(result.visibleComments), ["VISIBLE COMMENT"]);
  assert.equal(JSON.stringify(result).includes("HIDDEN PRIVATE"), false);
});
