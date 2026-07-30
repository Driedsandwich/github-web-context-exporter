import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { extname } from "node:path";

async function runtimeSource() {
  const root = new URL("../src/", import.meta.url);
  const pending = [root];
  const files = [];

  while (pending.length > 0) {
    const directory = pending.pop();
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const url = new URL(entry.name, directory);
      if (entry.isDirectory()) {
        url.pathname += "/";
        pending.push(url);
      } else if (extname(entry.name) === ".js") {
        files.push(await readFile(url, "utf8"));
      }
    }
  }

  return files.join("\n");
}

test("manifest keeps the no-background and no-remote-code boundary", async () => {
  const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));

  assert.equal(manifest.background, undefined);
  assert.equal(manifest.content_scripts, undefined);
  assert.equal(manifest.externally_connectable, undefined);
  assert.equal(manifest.update_url, undefined);
});

test("runtime source contains no external communication primitives", async () => {
  const source = await runtimeSource();
  const forbidden = [
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\b/,
    /\bEventSource\b/,
    /\bsendBeacon\s*\(/,
    /\bconnectNative\s*\(/
  ];

  for (const pattern of forbidden) {
    assert.equal(pattern.test(source), false, `${pattern} must not appear in runtime source`);
  }
});
