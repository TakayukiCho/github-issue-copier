import { Octokit } from "@octokit/rest";
import { ChromeStorage } from "./types/storage";

function polling() {
  setTimeout(polling, 1000 * 30);
}

polling();

chrome.action.onClicked.addListener(async () => {
  const { githubPersonalAccessToken } = await (chrome.storage.sync.get(
    "githubPersonalAccessToken"
  ) as unknown as ChromeStorage);
  if (
    githubPersonalAccessToken == null ||
    githubPersonalAccessToken.length <= 0
  ) {
    chrome.runtime.openOptionsPage();
    return;
  }

  const octokit = new Octokit({
    auth: githubPersonalAccessToken,
    userAgent: "github issue copier",
  });

  chrome.tabs.create({ url: "https://google.com" });
});
