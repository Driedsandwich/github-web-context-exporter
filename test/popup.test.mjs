import test from "node:test";
import assert from "node:assert/strict";

let importSequence = 0;

function createElement() {
  return {
    textContent: "",
    className: "",
    value: "",
    disabled: true,
    listeners: new Map(),
    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }
  };
}

async function renderPopup({ url, executeScript, writeText = async () => {}, interact }) {
  const selectors = [
    "#status",
    "#repo",
    "#type",
    "#number",
    "#page-title",
    "#content-preview",
    "#comments-preview",
    "#markdown-preview",
    "#copy",
    "#download",
    "#action-status"
  ];
  const elements = new Map(selectors.map((selector) => [selector, createElement()]));
  elements.get("#copy").textContent = "Copy Markdown";
  elements.get("#download").textContent = "Download Markdown";
  const originalConsoleError = console.error;
  const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const timers = new Map();
  let nextTimerId = 0;

  globalThis.document = {
    querySelector(selector) {
      return elements.get(selector);
    }
  };
  globalThis.chrome = {
    tabs: {
      async query() {
        return [{ id: 1, url }];
      }
    },
    scripting: { executeScript }
  };
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { clipboard: { writeText } }
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      clearTimeout(id) {
        timers.delete(id);
      },
      setTimeout(callback, delay) {
        nextTimerId += 1;
        timers.set(nextTimerId, { callback, delay });
        return nextTimerId;
      }
    }
  });
  console.error = () => {};

  try {
    importSequence += 1;
    await import(`../src/popup/popup.js?test=${importSequence}`);
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));

    if (interact) {
      await interact({ elements, timers });
    }

    return elements;
  } finally {
    console.error = originalConsoleError;
    delete globalThis.chrome;
    delete globalThis.document;

    if (originalNavigatorDescriptor) {
      Object.defineProperty(globalThis, "navigator", originalNavigatorDescriptor);
    } else {
      delete globalThis.navigator;
    }

    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete globalThis.window;
    }
  }
}

test("fails closed when page metadata injection throws", async () => {
  const elements = await renderPopup({
    url: "https://github.com/octo-org/example/issues/123",
    async executeScript() {
      throw new Error("injection failed");
    }
  });

  assert.equal(elements.get("#status").textContent, "Page content extraction failed.");
  assert.equal(elements.get("#status").className, "status error");
  assert.equal(elements.get("#markdown-preview").value, "");
  assert.equal(elements.get("#copy").disabled, true);
  assert.equal(elements.get("#download").disabled, true);
  assert.match(elements.get("#action-status").textContent, /not generated/i);
});

test("fails closed when page metadata injection returns no result", async () => {
  const elements = await renderPopup({
    url: "https://github.com/octo-org/example/issues/123",
    async executeScript() {
      return [];
    }
  });

  assert.equal(elements.get("#status").textContent, "Page content extraction failed.");
  assert.equal(elements.get("#markdown-preview").value, "");
  assert.equal(elements.get("#copy").disabled, true);
  assert.equal(elements.get("#download").disabled, true);
});

test("keeps unsupported pages fail-safe", async () => {
  let injected = false;
  const elements = await renderPopup({
    url: "https://github.com/octo-org/example",
    async executeScript() {
      injected = true;
      return [];
    }
  });

  assert.equal(injected, false);
  assert.equal(elements.get("#markdown-preview").value, "");
  assert.equal(elements.get("#copy").disabled, true);
  assert.equal(elements.get("#download").disabled, true);
});

test("enables export only after metadata extraction succeeds", async () => {
  const elements = await renderPopup({
    url: "https://github.com/octo-org/example/issues/123",
    async executeScript() {
      return [{ result: {
        title: "Example issue · GitHub",
        heading: "Example issue",
        url: "https://github.com/octo-org/example/issues/123",
        visibleContentStatus: "available",
        visibleContentPreview: "Visible issue body",
        visibleCommentsStatus: "available",
        visibleComments: ["First visible comment"]
      } }];
    }
  });

  assert.equal(elements.get("#copy").disabled, false);
  assert.equal(elements.get("#download").disabled, false);
  assert.match(elements.get("#markdown-preview").value, /URL: https:\/\/github\.com\/octo-org\/example\/issues\/123/);
  assert.match(elements.get("#markdown-preview").value, /Visible issue body/);
  assert.match(elements.get("#markdown-preview").value, /First visible comment/);
});

test("keeps explicit selector fallback distinct from injection failure", async () => {
  const elements = await renderPopup({
    url: "https://github.com/octo-org/example/issues/123",
    async executeScript() {
      return [{ result: {
        title: "Example issue · GitHub",
        heading: "Example issue",
        url: "https://github.com/octo-org/example/issues/123",
        visibleContentStatus: "unavailable",
        visibleContentPreview: "",
        visibleCommentsStatus: "unavailable",
        visibleComments: []
      } }];
    }
  });

  assert.equal(elements.get("#status").textContent, "Supported page shape detected.");
  assert.equal(elements.get("#content-preview").textContent, "Visible content unavailable.");
  assert.equal(elements.get("#comments-preview").textContent, "Visible comments unavailable.");
  assert.equal(elements.get("#copy").disabled, false);
  assert.equal(elements.get("#download").disabled, false);
});

test("shows immediate Copy success feedback and restores the label", async () => {
  let copiedMarkdown = "";

  await renderPopup({
    url: "https://github.com/octo-org/example/issues/123",
    async executeScript() {
      return [{ result: {
        title: "Example issue · GitHub",
        heading: "Example issue",
        url: "https://github.com/octo-org/example/issues/123",
        visibleContentStatus: "available",
        visibleContentPreview: "Visible issue body",
        visibleCommentsStatus: "available",
        visibleComments: ["First visible comment"]
      } }];
    },
    async writeText(markdown) {
      copiedMarkdown = markdown;
    },
    async interact({ elements, timers }) {
      await elements.get("#copy").listeners.get("click")();

      assert.match(copiedMarkdown, /# GitHub Issue Context/);
      assert.equal(elements.get("#copy").textContent, "Copied!");
      assert.equal(elements.get("#action-status").textContent, "Markdown copied. Review it before sharing.");
      assert.equal(timers.size, 1);

      const [{ callback, delay }] = timers.values();
      assert.equal(delay, 1500);
      callback();
      assert.equal(elements.get("#copy").textContent, "Copy Markdown");
    }
  });
});

test("keeps the default Copy label when clipboard writing fails", async () => {
  await renderPopup({
    url: "https://github.com/octo-org/example/issues/123",
    async executeScript() {
      return [{ result: {
        title: "Example issue · GitHub",
        heading: "Example issue",
        url: "https://github.com/octo-org/example/issues/123",
        visibleContentStatus: "available",
        visibleContentPreview: "Visible issue body",
        visibleCommentsStatus: "unavailable",
        visibleComments: []
      } }];
    },
    async writeText() {
      throw new Error("clipboard unavailable");
    },
    async interact({ elements, timers }) {
      await elements.get("#copy").listeners.get("click")();

      assert.equal(elements.get("#copy").textContent, "Copy Markdown");
      assert.equal(timers.size, 0);
      assert.equal(
        elements.get("#action-status").textContent,
        "Could not copy Markdown. Select the preview text and copy it manually."
      );
    }
  });
});
