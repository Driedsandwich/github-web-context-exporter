const SUPPORTED_PAGE_PATTERN = /^\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)\/?$/;

export function classifyGitHubUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    if (url.hostname !== "github.com") {
      return { supported: false, reason: "Not a github.com page." };
    }

    const match = url.pathname.match(SUPPORTED_PAGE_PATTERN);

    if (!match) {
      return {
        supported: false,
        reason: "Open a GitHub Issue or Pull Request conversation page."
      };
    }

    const [, owner, repo, kind, number] = match;

    return {
      supported: true,
      owner,
      repo,
      kind: kind === "pull" ? "pull request" : "issue",
      number
    };
  } catch {
    return { supported: false, reason: "Could not read the current page URL." };
  }
}
