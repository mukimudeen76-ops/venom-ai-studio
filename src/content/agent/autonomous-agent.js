/**
 * Nexo AI - Autonomous Agent Core Engine
 * 
 * Functions:
 * - Listens for autonomous tasks and instructions (e.g. "Agent, fix this repo", "Agent, push changes")
 * - Coordinates multi-step execution: Read repository -> Edit files -> Run tests/sandboxes -> Push real commits to GitHub
 * - Stays dormant during normal casual conversation, activating strictly when commanded by the user.
 */

import appState from "../state.js";
import { devLog } from "../../lib/dev-log.js";
import { pushFilesToGitHub } from "./real-github-pusher.js";

class AutonomousAgent {
  constructor() {
    this.isActive = false;
    this.currentTask = null;
    this.executionLog = [];
  }

  /**
   * Evaluates if a user prompt is requesting autonomous agent work.
   */
  shouldActivate(promptText) {
    if (!promptText || typeof promptText !== "string") return false;
    const lower = promptText.toLowerCase();
    return (
      lower.includes("agent") ||
      lower.includes("git push") ||
      lower.includes("terminal") ||
      lower.includes("kaam karo") ||
      lower.includes("run build") ||
      lower.includes("auto fix")
    );
  }

  /**
   * Executes a real GitHub synchronization task autonomously.
   */
  async executePushTask({ repo, message, files = [], branch = "" }) {
    devLog("Agent", `Autonomous Agent executing real push task for ${repo}...`);
    this.isActive = true;

    try {
      const result = await pushFilesToGitHub({
        repo,
        branch,
        token: appState.settings?.githubToken,
        message: message || "chore(nexo-agent): autonomous update",
        files: files.length > 0 ? files : this.collectProjectFiles(),
      });

      this.executionLog.push({ timestamp: Date.now(), type: "push_success", result });
      return result;
    } catch (error) {
      this.executionLog.push({ timestamp: Date.now(), type: "push_error", error: error.message });
      throw error;
    } finally {
      this.isActive = false;
    }
  }

  collectProjectFiles() {
    if (appState.projectFiles && appState.projectFiles.length > 0) {
      return appState.projectFiles.map(f => ({
        path: f.name,
        content: f.content,
      }));
    }
    return [];
  }
}

export const nexoAgent = new AutonomousAgent();
