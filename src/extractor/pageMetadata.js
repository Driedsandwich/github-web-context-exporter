export function extractVisiblePageMetadata() {
  // chrome.scripting.executeScript serializes only this function. Keep every
  // dependency inside the function so it also works in the injected world.
  const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const uniqueElements = (elements) => [...new Set(elements.filter(Boolean))];
  const classifyPageKind = (path) => {
    if (/^\/[^/]+\/[^/]+\/issues\/\d+\/?$/.test(path)) {
      return "issue";
    }

    if (/^\/[^/]+\/[^/]+\/pull\/\d+\/?$/.test(path)) {
      return "pull request";
    }

    return null;
  };

  const title = document.title?.trim() || "";
  const heading = document.querySelector("h1")?.textContent?.trim() || "";
  const path = document.location.pathname;
  const pageKind = classifyPageKind(path);

  let visibleContentPreview = "";
  let visibleContentStatus = "not_applicable";
  let visibleComments = [];
  let visibleCommentsStatus = "not_applicable";

  if (pageKind) {
    const bodySelectors = [
      ".js-issue-body",
      ".js-comment-body",
      ".comment-body",
      ".markdown-body"
    ];

    let bodyElement = null;

    for (const selector of bodySelectors) {
      bodyElement = document.querySelector(selector);
      const normalized = normalizeText(bodyElement?.innerText || bodyElement?.textContent);

      if (normalized) {
        visibleContentPreview = normalized.slice(0, 280);
        visibleContentStatus = "available";
        break;
      }
    }

    if (!visibleContentPreview) {
      visibleContentStatus = "unavailable";
    }

    const candidateCommentElements = uniqueElements([
      ...document.querySelectorAll(".js-comment-body"),
      ...document.querySelectorAll(".comment-body"),
      ...document.querySelectorAll('.react-issue-comment [data-testid="markdown-body"]')
    ]);

    visibleComments = candidateCommentElements
      .filter((element) => element !== bodyElement)
      .map((element) => normalizeText(element.innerText || element.textContent))
      .filter(Boolean)
      .slice(0, 5)
      .map((text) => text.slice(0, 320));

    visibleCommentsStatus = visibleComments.length > 0 ? "available" : "unavailable";
  }

  return {
    title,
    heading,
    url: document.location.href,
    visibleContentPreview,
    visibleContentStatus,
    visibleComments,
    visibleCommentsStatus
  };
}
