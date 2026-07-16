function cleanPart(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function compactTimestamp(value) {
  return String(value ?? "")
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
}

export function createMarkdownFilename({ page, exportedAt = new Date().toISOString() } = {}) {
  const owner = cleanPart(page?.owner) || "github";
  const repo = cleanPart(page?.repo) || "context";
  const kind = cleanPart(page?.kind) || "page";
  const number = cleanPart(page?.number) || "unknown";
  const timestamp = compactTimestamp(exportedAt) || compactTimestamp(new Date().toISOString());

  return `${owner}-${repo}-${kind}-${number}-${timestamp}.md`;
}
