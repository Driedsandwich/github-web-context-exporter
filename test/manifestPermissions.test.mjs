import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readManifest() {
  return JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));
}

test("manifest permissions match the approved v0.1 set", async () => {
  const manifest = await readManifest();

  assert.deepEqual([...manifest.permissions].sort(), ["activeTab", "clipboardWrite", "scripting"].sort());
});

test("manifest has no host permissions", async () => {
  const manifest = await readManifest();

  assert.equal(manifest.host_permissions, undefined);
});

test("manifest does not add restricted or broad permissions", async () => {
  const manifest = await readManifest();
  const permissions = new Set(manifest.permissions ?? []);

  for (const permission of ["downloads", "tabs", "storage", "webRequest", "identity", "<all_urls>"]) {
    assert.equal(permissions.has(permission), false, `${permission} must not be present`);
  }
});
