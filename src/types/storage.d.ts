import { RepoToCopy } from "./repoToCopy";

export type ChromeStorage = {
  githubPersonalAccessToken?: string;
  reposToCopy: RepoToCopy[];
};
