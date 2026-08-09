// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import { pushFilesToGitHub } from "../../src/content/agent/real-github-pusher.js";
import appState from "../../src/content/state.js";

describe("Real GitHub Pusher Engine", () => {
  beforeEach(() => {
    appState.settings = { githubToken: "ghp_mocktoken12345678901234567890123456" };
    vi.restoreAllMocks();
  });

  it("throws when GitHub token is missing", async () => {
    appState.settings.githubToken = "";
    await expect(
      pushFilesToGitHub({ repo: "owner/repo", files: [{ path: "a.txt", content: "hello" }] })
    ).rejects.toThrow("Missing GitHub Token");
  });

  it("throws when repository format is invalid", async () => {
    await expect(
      pushFilesToGitHub({ repo: "invalidrepo", files: [{ path: "a.txt", content: "hello" }] })
    ).rejects.toThrow("Invalid GitHub repository format");
  });

  it("successfully performs real GitHub API Git tree, blob, commit, and ref update flow", async () => {
    // Mock fetch calls
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ default_branch: "main" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ object: { sha: "commit_base_sha_123" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tree: { sha: "tree_base_sha_456" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sha: "blob_sha_789" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sha: "new_tree_sha_999" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sha: "new_commit_sha_abc1234" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ object: { sha: "new_commit_sha_abc1234" } }),
      });

    globalThis.fetch = fetchMock;

    const result = await pushFilesToGitHub({
      repo: "mukimudeen76-ops/venom-ai-studio",
      message: "feat: test commit",
      files: [{ path: "README.md", content: "# Test Content" }],
    });

    expect(result.success).toBe(true);
    expect(result.sha).toBe("new_commit_sha_abc1234");
    expect(result.shortSha).toBe("new_com");
    expect(result.url).toBe("https://github.com/mukimudeen76-ops/venom-ai-studio/commit/new_commit_sha_abc1234");
  });
});
