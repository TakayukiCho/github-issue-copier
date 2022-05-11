import { useState } from "react";
import { RepoToCopy } from "../types/repoToCopy";

export function useReposToCopy() {
  const [reposToCopy, setReposToCopy] = useState<RepoToCopy[]>([]);
  const setRepoToCopy = (index: number, repoToCopy: RepoToCopy) => {
    if (index === 0) {
      setReposToCopy([repoToCopy, reposToCopy[1]]);
    } else {
      setReposToCopy([reposToCopy[0], repoToCopy]);
    }
  };

  return { reposToCopy, setRepoToCopy, setReposToCopy };
}
