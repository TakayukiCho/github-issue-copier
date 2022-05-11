import { Octokit } from "@octokit/rest";
import { ChromeStorage } from "./types/storage";

function polling() {
  setTimeout(polling, 1000 * 30);
}

polling();

function alerting(alertContent: string) {
  alert(alertContent);
}

chrome.action.onClicked.addListener(async (tab) => {
  if (
    tab.url == null ||
    tab.url.match(
      /^https:\/\/github\.com\/(?:[A-z]|[0-9]|-)+\/(?:[A-z]|[0-9]|-)+\/issues\/[0-9]+$/
    ) == null
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id ?? 0 },
      func: alerting,
      args: ["This will be available only on Github Issue"],
    });
    return;
  }

  const { githubPersonalAccessToken, reposToCopy } =
    await (chrome.storage.sync.get() as unknown as ChromeStorage);
  const [repoToCopyOne, repoToCopyTwo] = reposToCopy;
  if (
    (githubPersonalAccessToken == null ||
      githubPersonalAccessToken.length <= 0 ||
      repoToCopyOne.owner === "" ||
      repoToCopyOne.repository === "" ||
      repoToCopyTwo.owner === "",
    repoToCopyTwo.repository === "")
  ) {
    chrome.runtime.openOptionsPage();
    return;
  }

  const octokit = new Octokit({
    auth: githubPersonalAccessToken,
    userAgent: "github issue copier",
  });

  await Promise.all([
    octokit.issues.create({
      owner: repoToCopyOne.owner,
      repo: repoToCopyOne.repository,
      title: tab.title ?? "uknown title",
      body: tab.url ?? "",
    }),
    octokit.issues.create({
      owner: repoToCopyTwo.owner,
      repo: repoToCopyTwo.repository,
      title: tab.title ?? "uknown title",
      body: tab.url ?? "",
    }),
  ]);

  chrome.scripting.executeScript({
    target: { tabId: tab.id ?? 0 },
    func: alerting,
    args: ["Finished Coping Issue"],
  });
});
