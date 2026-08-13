export function extractVisiblePageMetadata() {
  // chrome.scripting.executeScript serializes only this function. Keep every
  // dependency inside the function so it also works in the injected world.
  const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const uniqueElements = (elements) => [...new Set(elements.filter(Boolean))];
  const isVisiblyRendered = (element) => {
    if (!element || element.hidden || element.closest?.("[hidden], [inert]")) {
      return false;
    }

    if (typeof element.checkVisibility === "function") {
      return element.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
        contentVisibilityAuto: true
      });
    }

    const view = element.ownerDocument?.defaultView || document.defaultView;

    if (typeof view?.getComputedStyle === "function") {
      for (let current = element; current; current = current.parentElement) {
        const style = view.getComputedStyle(current);

        if (
          style.display === "none"
          || style.visibility === "hidden"
          || style.visibility === "collapse"
          || Number(style.opacity) === 0
        ) {
          return false;
        }
      }
    }

    return typeof element.getClientRects === "function"
      && element.getClientRects().length > 0;
  };
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
  const heading = normalizeText(document.querySelector("h1")?.innerText);
  const path = document.location.pathname;
  const pageKind = classifyPageKind(path);

  let visibleContentPreview = "";
  let visibleContentStatus = "not_applicable";
  let visibleComments = [];
  let visibleCommentsStatus = "not_applicable";

  if (pageKind) {
    const bodySelectors = [
      '#issue-body-viewer [data-testid="markdown-body"]',
      ".js-command-palette-pull-body .js-comment-body",
      ".js-issue-body"
    ];

    let bodyElement = null;

    for (const selector of bodySelectors) {
      bodyElement = document.querySelector(selector);
      const normalized = isVisiblyRendered(bodyElement)
        ? normalizeText(bodyElement.innerText)
        : "";

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
      .filter((element) => (
        element !== bodyElement
        && !element.contains?.(bodyElement)
        && !bodyElement?.contains?.(element)
      ))
      .filter(isVisiblyRendered)
      .map((element) => normalizeText(element.innerText))
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
