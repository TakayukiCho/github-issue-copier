import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useReposToCopy } from "./hooks/useRepoToCopy";
import { RepoToCopy } from "./types/repoToCopy";
import { ChromeStorage } from "./types/storage";

const RepoToCopyField = ({
  index,
  repoToCopy,
  setRepoToCopy,
}: {
  index: number;
  repoToCopy: RepoToCopy;
  setRepoToCopy: (index: number, repoToCopy: RepoToCopy) => void;
}) => {
  return (
    <div>
      <p style={{fontSize: 14}}>Repo {index + 1}</p>
      <div>
        <label>Owner: </label>
        <input
          type="text"
          value={repoToCopy.owner}
          onChange={(e) => {
            setRepoToCopy(index, {
              owner: e.target.value,
              repository: repoToCopy.repository,
            });
          }}
        />
      </div>
      <div>
        <label>Repository: </label>
        <input
          type="text"
          value={repoToCopy.repository}
          onChange={(e) => {
            setRepoToCopy(index, {
              owner: repoToCopy.owner,
              repository: e.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

const Options = () => {
  const [githubPersonalAccessToken, setGithubPersonalAccessToken] =
    useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { reposToCopy, setRepoToCopy, setReposToCopy } = useReposToCopy();

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      (items) => {
        setGithubPersonalAccessToken(
          (items as ChromeStorage).githubPersonalAccessToken ?? ""
        );
        setReposToCopy(
          (items as ChromeStorage).reposToCopy ?? [
            { owner: "", repository: "" },
            { owner: "", repository: "" },
          ]
        );
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        githubPersonalAccessToken,
        reposToCopy,
      },
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      <div>
        Github Personal Access Token:
        <input
          type="text"
          onChange={(v) => setGithubPersonalAccessToken(v.target.value)}
          value={githubPersonalAccessToken}
        />
      </div>
      <div>
        <RepoToCopyField
          index={0}
          repoToCopy={reposToCopy[0]}
          setRepoToCopy={setRepoToCopy}
        />
        <RepoToCopyField
          index={1}
          repoToCopy={reposToCopy[1]}
          setRepoToCopy={setRepoToCopy}
        />
      </div>
      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
