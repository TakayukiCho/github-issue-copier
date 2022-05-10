import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Storage } from "./types/storage";

const Options = () => {
  const [githuhPersonalAccessToken, setGithuhPersonalAccessToken] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    chrome.storage.sync.get(
      {
        githubPersonalAccessToken: ""
      } as Storage,
      (items) => {
        setGithuhPersonalAccessToken((items as Storage).githubPersonalAccessToken);
      }
    );
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      {
        githuhPersonalAccessToken
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
        <input type="text" onChange={(v) => setGithuhPersonalAccessToken(v.target.value)}>{githuhPersonalAccessToken}</input>
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
