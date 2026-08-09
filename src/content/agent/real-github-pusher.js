/**
 * Real GitHub Git Database API Pusher & Commit Engine
 * 
 * Performs genuine Git commits and branch updates directly through the GitHub REST API:
 * 1. Resolves default branch reference & base tree SHA
 * 2. Uploads blobs for all modified and new files
 * 3. Creates a new Git tree
 * 4. Creates a signed commit object
 * 5. Updates the Git branch ref (heads/main or heads/master)
 * 6. Returns real commit SHA, short SHA, commit URL, and stats
 */

import appState from "../state.js";
import { devLog } from "../../lib/dev-log.js";

/**
 * Performs a real commit and push to a GitHub repository using the GitHub REST API.
 * 
 * @param {object} params
 * @param {string} params.repo - e.g. "mukimudeen76-ops/venom-ai-studio"
 * @param {string} [params.branch] - "main" or "master" (auto-detected if omitted)
 * @param {string} [params.token] - GitHub Personal Access Token (defaults to appState.settings.githubToken)
 * @param {string} [params.message] - Commit message
 * @param {Array<{path: string, content: string}>} params.files - Array of files to commit
 * @returns {Promise<{success: boolean, sha?: string, url?: string, error?: string, filesCount?: number}>}
 */
export async function pushFilesToGitHub({
  repo = "",
  branch = "",
  token = "",
  message = "chore(nexo-ai): automated update",
  files = [],
}) {
  const authToken = token || appState.settings?.githubToken || "";
  if (!authToken) {
    throw new Error("Missing GitHub Token. Please add your GitHub Token in Settings -> Token Vault.");
  }

  const cleanRepo = repo.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//, "").replace(/\.git$/, "").trim();
  if (!cleanRepo || !cleanRepo.includes("/")) {
    throw new Error(`Invalid GitHub repository format: "${repo}". Expected "owner/repo".`);
  }

  if (!files || files.length === 0) {
    throw new Error("No files provided to commit.");
  }

  const [owner, repoName] = cleanRepo.split("/");
  const headers = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": `token ${authToken}`,
    "Content-Type": "application/json",
    "User-Agent": "NexoAI-Autonomous-Agent",
  };

  devLog("GitHubPusher", `Starting real commit & push to ${cleanRepo} (${files.length} files)...`);

  // Step 1: Detect branch and get latest commit SHA
  let targetBranch = branch;
  if (!targetBranch) {
    try {
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
      if (!repoRes.ok) {
        const errJson = await repoRes.json().catch(() => ({}));
        throw new Error(`GitHub API Error (${repoRes.status}): ${errJson.message || repoRes.statusText}`);
      }
      const repoData = await repoRes.json();
      targetBranch = repoData.default_branch || "main";
    } catch (e) {
      targetBranch = "main";
    }
  }

  // Get ref
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/ref/heads/${targetBranch}`, { headers });
  if (!refRes.ok) {
    const errJson = await refRes.json().catch(() => ({}));
    throw new Error(`Could not resolve branch "${targetBranch}" on ${cleanRepo}: ${errJson.message || refRes.statusText}`);
  }
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // Get base tree
  const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/commits/${latestCommitSha}`, { headers });
  if (!commitRes.ok) {
    throw new Error(`Failed to fetch latest commit object: ${commitRes.statusText}`);
  }
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // Step 2: Create Blobs for each file
  const treeItems = [];
  for (const file of files) {
    const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        content: file.content,
        encoding: "utf-8",
      }),
    });

    if (!blobRes.ok) {
      const errJson = await blobRes.json().catch(() => ({}));
      throw new Error(`Failed to create blob for "${file.path}": ${errJson.message || blobRes.statusText}`);
    }

    const blobData = await blobRes.json();
    treeItems.push({
      path: file.path.replace(/^\//, ""),
      mode: "100644",
      type: "blob",
      sha: blobData.sha,
    });
  }

  // Step 3: Create new Tree
  const newTreeRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: treeItems,
    }),
  });

  if (!newTreeRes.ok) {
    const errJson = await newTreeRes.json().catch(() => ({}));
    throw new Error(`Failed to create git tree: ${errJson.message || newTreeRes.statusText}`);
  }
  const newTreeData = await newTreeRes.json();
  const newTreeSha = newTreeData.sha;

  // Step 4: Create Commit
  const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      tree: newTreeSha,
      parents: [latestCommitSha],
      author: {
        name: "Tehzeeb",
        email: "xtehzeeb.x7@gmail.com",
        date: new Date().toISOString(),
      },
    }),
  });

  if (!newCommitRes.ok) {
    const errJson = await newCommitRes.json().catch(() => ({}));
    throw new Error(`Failed to create git commit: ${errJson.message || newCommitRes.statusText}`);
  }
  const newCommitData = await newCommitRes.json();
  const newCommitSha = newCommitData.sha;

  // Step 5: Update Branch Ref
  const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/${targetBranch}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      sha: newCommitSha,
      force: false,
    }),
  });

  if (!updateRefRes.ok) {
    const errJson = await updateRefRes.json().catch(() => ({}));
    throw new Error(`Failed to update branch "${targetBranch}" ref: ${errJson.message || updateRefRes.statusText}`);
  }

  const commitUrl = `https://github.com/${owner}/${repoName}/commit/${newCommitSha}`;
  devLog("GitHubPusher", `Successfully pushed commit: ${newCommitSha} (${commitUrl})`);

  return {
    success: true,
    sha: newCommitSha,
    shortSha: newCommitSha.slice(0, 7),
    branch: targetBranch,
    repo: cleanRepo,
    url: commitUrl,
    filesCount: files.length,
    message,
  };
}
