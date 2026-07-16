function cleanText(value) {
  return String(value ?? "").trim();
}

function bulletValue(label, value) {
  const text = cleanText(value) || "Unavailable";
  return `- ${label}: ${text}`;
}

function pageHeading(page) {
  return page?.kind === "pull request"
    ? "# GitHub Pull Request Context"
    : "# GitHub Issue Context";
}

function bodyPreview(metadata) {
  if (metadata?.visibleContentStatus === "available") {
    return cleanText(metadata.visibleContentPreview) || "Visible preview unavailable.";
  }

  if (metadata?.visibleContentStatus === "unavailable") {
    return "Visible preview unavailable.";
  }

  return "Visible preview is not checked for this page type yet.";
}

function commentsPreview(metadata) {
  if (metadata?.visibleCommentsStatus === "available" && Array.isArray(metadata.visibleComments)) {
    return metadata.visibleComments
      .map((comment, index) => `### Visible Comment ${index + 1}\n\n${cleanText(comment) || "Unavailable"}`)
      .join("\n\n");
  }

  if (metadata?.visibleCommentsStatus === "unavailable") {
    return "Visible comments preview unavailable.";
  }

  return "Visible comments preview is not checked for this page type yet.";
}

export function formatVisibleContextMarkdown({
  page,
  metadata,
  exportedAt = new Date().toISOString(),
  exporter = "GitHub Web Context Exporter"
}) {
  const repository = page?.owner && page?.repo ? `${page.owner}/${page.repo}` : "Unavailable";
  const number = page?.number ? `#${page.number}` : "Unavailable";
  const sourceUrl = cleanText(metadata?.url) || "Unavailable";

  return [
    pageHeading(page),
    "",
    "## Source",
    bulletValue("Repository", repository),
    bulletValue("Number", number),
    bulletValue("Type", page?.kind),
    bulletValue("URL", sourceUrl),
    bulletValue("Exported at", exportedAt),
    bulletValue("Exporter", exporter),
    "- Export mode: visible-page-preview",
    "",
    "## Limitations",
    "- This preview only uses content visible in the current GitHub page.",
    "- Hidden, collapsed, paginated, or dynamically unloaded content may be omitted.",
    "- Diffs, checks, and files changed are not exported in this step.",
    "",
    "## Review Before Sharing",
    "- Review this Markdown before sharing it with any AI tool or external party.",
    "",
    "## Body Preview",
    bodyPreview(metadata),
    "",
    "## Visible Comments Preview",
    commentsPreview(metadata),
    "",
    "## Suggested Next Use",
    "- Paste into a human-reviewed AI workflow.",
    "- Future versions may align this output with maintainer-context-kit task packets."
  ].join("\n");
}
