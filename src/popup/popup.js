import { extractVisiblePageMetadata } from "../extractor/pageMetadata.js";
import { formatVisibleContextMarkdown } from "../markdown/formatMarkdown.js";
import { createMarkdownFilename } from "../shared/filename.js";
import { classifyGitHubUrl } from "../shared/githubUrl.js";

const statusEl = document.querySelector("#status");
const repoEl = document.querySelector("#repo");
const typeEl = document.querySelector("#type");
const numberEl = document.querySelector("#number");
const pageTitleEl = document.querySelector("#page-title");
const contentPreviewEl = document.querySelector("#content-preview");
const commentsPreviewEl = document.querySelector("#comments-preview");
const markdownPreviewEl = document.querySelector("#markdown-preview");
const copyButton = document.querySelector("#copy");
const downloadButton = document.querySelector("#download");
const actionStatusEl = document.querySelector("#action-status");

const COPY_BUTTON_DEFAULT_LABEL = "Copy Markdown";
const COPY_BUTTON_SUCCESS_LABEL = "Copied!";
const COPY_FEEDBACK_DURATION_MS = 1500;

let currentFilename = "github-context.md";
let copyFeedbackTimerId = null;

function setActionStatus(message) {
  actionStatusEl.textContent = message;
}

function resetCopyFeedback() {
  if (copyFeedbackTimerId !== null) {
    window.clearTimeout(copyFeedbackTimerId);
    copyFeedbackTimerId = null;
  }

  copyButton.textContent = COPY_BUTTON_DEFAULT_LABEL;
}

function showCopySuccessFeedback() {
  resetCopyFeedback();
  copyButton.textContent = COPY_BUTTON_SUCCESS_LABEL;
  copyFeedbackTimerId = window.setTimeout(() => {
    copyButton.textContent = COPY_BUTTON_DEFAULT_LABEL;
    copyFeedbackTimerId = null;
  }, COPY_FEEDBACK_DURATION_MS);
}

function renderUnsupported(message) {
  statusEl.textContent = message;
  statusEl.className = "status unsupported";
  repoEl.textContent = "-";
  typeEl.textContent = "-";
  numberEl.textContent = "-";
  pageTitleEl.textContent = "-";
  contentPreviewEl.textContent = "-";
  commentsPreviewEl.textContent = "-";
  markdownPreviewEl.value = "";
  copyButton.disabled = true;
  downloadButton.disabled = true;
  setActionStatus("Open a supported page to generate Markdown.");
}

function renderExtractionFailure(page) {
  statusEl.textContent = "Page content extraction failed.";
  statusEl.className = "status error";
  repoEl.textContent = `${page.owner}/${page.repo}`;
  typeEl.textContent = page.kind;
  numberEl.textContent = `#${page.number}`;
  pageTitleEl.textContent = "-";
  contentPreviewEl.textContent = "Extraction failed.";
  commentsPreviewEl.textContent = "-";
  markdownPreviewEl.value = "";
  copyButton.disabled = true;
  downloadButton.disabled = true;
  setActionStatus("Markdown was not generated because page content extraction failed.");
}

function getPreviewText(metadata) {
  if (metadata?.visibleContentStatus === "available") {
    return metadata.visibleContentPreview;
  }

  if (metadata?.visibleContentStatus === "unavailable") {
    return "Visible content unavailable.";
  }

  return "Not checked.";
}

function getCommentsText(metadata) {
  if (metadata?.visibleCommentsStatus === "available") {
    return `${metadata.visibleComments.length} visible snippet(s)`;
  }

  if (metadata?.visibleCommentsStatus === "unavailable") {
    return "Visible comments unavailable.";
  }

  return "Not checked.";
}

function renderSupported(page, metadata) {
  const exportedAt = new Date().toISOString();
  const markdown = formatVisibleContextMarkdown({ page, metadata, exportedAt });

  statusEl.textContent = "Supported page shape detected.";
  statusEl.className = "status supported";
  repoEl.textContent = `${page.owner}/${page.repo}`;
  typeEl.textContent = page.kind;
  numberEl.textContent = `#${page.number}`;
  pageTitleEl.textContent = metadata?.title || metadata?.heading || "Metadata unavailable";
  contentPreviewEl.textContent = getPreviewText(metadata);
  commentsPreviewEl.textContent = getCommentsText(metadata);
  markdownPreviewEl.value = markdown;
  currentFilename = createMarkdownFilename({ page, exportedAt });
  copyButton.disabled = !markdown.trim();
  downloadButton.disabled = !markdown.trim();
  setActionStatus("Markdown preview is ready to copy or save.");
}

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function getPageMetadata(tabId) {
  const [injectionResult] = await chrome.scripting.executeScript({
    target: { tabId },
    func: extractVisiblePageMetadata
  });

  return injectionResult?.result || null;
}

async function copyMarkdown() {
  const markdown = markdownPreviewEl.value.trim();

  if (!markdown) {
    resetCopyFeedback();
    setActionStatus("No Markdown preview is available to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(markdown);
    showCopySuccessFeedback();
    setActionStatus("Markdown copied. Review it before sharing.");
  } catch {
    resetCopyFeedback();
    setActionStatus("Could not copy Markdown. Select the preview text and copy it manually.");
  }
}

function saveMarkdown() {
  const markdown = markdownPreviewEl.value;

  if (!markdown.trim()) {
    setActionStatus("No Markdown preview is available to save.");
    return;
  }

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = currentFilename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  setActionStatus(`Markdown save started: ${currentFilename}`);
}

async function init() {
  copyButton.addEventListener("click", copyMarkdown);
  downloadButton.addEventListener("click", saveMarkdown);

  try {
    const tab = await getCurrentTab();

    if (!tab?.id || !tab?.url) {
      renderUnsupported("Could not access the current tab.");
      return;
    }

    const page = classifyGitHubUrl(tab.url);

    if (!page.supported) {
      renderUnsupported(page.reason);
      return;
    }

    try {
      const metadata = await getPageMetadata(tab.id);

      if (!metadata) {
        renderExtractionFailure(page);
        return;
      }

      renderSupported(page, metadata);
    } catch {
      renderExtractionFailure(page);
    }
  } catch (error) {
    renderUnsupported("Popup initialization failed. Reload the extension and try again.");
    console.error(error);
  }
}

init();
