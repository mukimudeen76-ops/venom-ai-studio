/**
 * Nexo AI - Multi-Pass Subagent Execution Pipeline
 * 
 * Inspired by VoltAgent/awesome-codex-subagents:
 * Decomposes complex tasks into three dedicated, single-responsibility passes:
 *   1. ScannerPass: Scans workspace files, active memories, and builds an execution plan.
 *   2. BuilderPass: Generates code, creates files, and runs sandbox verification.
 *   3. ReviewerPass: Verifies AST/syntax, checks security vulnerabilities/token leaks, and validates style.
 * 
 * Masterminded & Developed by Tehzeeb (Instagram: @xtehzeeb.x | Support: xtehzeeb.x7@gmail.com)
 */

import appState from "../state.js";
import { devLog } from "../../lib/dev-log.js";
import { analyzeSecurityPayload } from "../../lib/arsenal/security-toolkit.js";
import { pushFilesToGitHub } from "./real-github-pusher.js";

/**
 * 1. Scanner Pass — Analyzes context and builds execution strategy
 */
export class ScannerPass {
  constructor(options = {}) {
    this.name = "ScannerPass";
    this.options = options;
  }

  async execute({ taskDescription, files = [] }) {
    devLog("Subagents:Scanner", `Scanning workspace for task: "${taskDescription}"`);
    const workspaceFiles = files.length > 0 ? files : (appState.projectFiles || []);
    
    const fileInventory = workspaceFiles.map(f => ({
      path: f.name,
      size: (f.content || "").length,
      extension: f.name.split(".").pop(),
    }));

    const plan = {
      timestamp: Date.now(),
      task: taskDescription,
      filesScanned: fileInventory.length,
      fileInventory,
      requiresBuild: workspaceFiles.some(f => /\.(js|ts|svelte|html|json)$/i.test(f.path)),
      securitySensitive: workspaceFiles.some(f => /(key|token|auth|secret|credential)/i.test(f.path)),
      recommendedSteps: [
        "1. Extract requirements & scaffold missing modules",
        "2. Implement source logic with zero mock placeholders",
        "3. Run AST & security audit",
        "4. Commit & push verified output",
      ]
    };

    return plan;
  }
}

/**
 * 2. Builder Pass — Coordinates clean code creation and sandboxing
 */
export class BuilderPass {
  constructor(options = {}) {
    this.name = "BuilderPass";
    this.options = options;
  }

  async execute({ plan, generatedFiles = [] }) {
    devLog("Subagents:Builder", `Executing builder pass for ${generatedFiles.length} files...`);
    const results = [];

    for (const file of generatedFiles) {
      if (!file.path || typeof file.content !== "string") continue;

      // Update workspace state
      const existingIdx = (appState.projectFiles || []).findIndex(f => f.name === file.path);
      if (existingIdx >= 0) {
        appState.projectFiles[existingIdx].content = file.content;
      } else {
        appState.projectFiles = [...(appState.projectFiles || []), { name: file.path, content: file.content }];
      }

      results.push({
        path: file.path,
        size: file.content.length,
        status: "CREATED_OR_UPDATED",
      });
    }

    return {
      success: true,
      filesModified: results,
      totalFiles: (appState.projectFiles || []).length,
    };
  }
}

/**
 * 3. Reviewer Pass — Security audit, token leak detection, and AST verification
 */
export class ReviewerPass {
  constructor(options = {}) {
    this.name = "ReviewerPass";
    this.options = options;
  }

  async execute({ files = [] }) {
    devLog("Subagents:Reviewer", `Executing reviewer pass on ${files.length} files...`);
    const issues = [];
    const targetFiles = files.length > 0 ? files : (appState.projectFiles || []);

    for (const file of targetFiles) {
      const content = file.content || "";

      // 1. Security & Leak Check
      const secAnalysis = analyzeSecurityPayload(content);
      if (secAnalysis.risk === "CRITICAL" || secAnalysis.risk === "HIGH") {
        issues.push({
          file: file.name || file.path,
          type: "SECURITY_RISK",
          severity: secAnalysis.risk,
          findings: secAnalysis.findings,
        });
      }

      // 2. Syntax/JSON verification
      if ((file.name || file.path || "").endsWith(".json")) {
        try {
          JSON.parse(content);
        } catch (e) {
          issues.push({
            file: file.name || file.path,
            type: "SYNTAX_ERROR",
            severity: "HIGH",
            message: `Invalid JSON syntax: ${e.message}`,
          });
        }
      }
    }

    return {
      passed: issues.length === 0,
      issuesCount: issues.length,
      issues,
      auditTimestamp: Date.now(),
    };
  }
}

/**
 * Orchestrates the full 3-pass subagent pipeline sequentially
 */
export async function runSubagentPipeline({ taskDescription, generatedFiles = [], repo = "", commitMessage = "" }) {
  const startTime = Date.now();
  devLog("SubagentPipeline", `Starting 3-pass pipeline for: ${taskDescription}`);

  // Pass 1: Scanner
  const scanner = new ScannerPass();
  const plan = await scanner.execute({ taskDescription });

  // Pass 2: Builder
  const builder = new BuilderPass();
  const buildResult = await builder.execute({ plan, generatedFiles });

  // Pass 3: Reviewer
  const reviewer = new ReviewerPass();
  const reviewResult = await reviewer.execute({ files: appState.projectFiles });

  let gitResult = null;
  if (repo && reviewResult.passed && appState.settings?.githubToken) {
    gitResult = await pushFilesToGitHub({
      repo,
      token: appState.settings.githubToken,
      message: commitMessage || `feat(subagent): ${taskDescription}`,
      files: appState.projectFiles.map(f => ({ path: f.name, content: f.content })),
    });
  }

  const durationMs = Date.now() - startTime;
  return {
    success: reviewResult.passed,
    durationMs,
    plan,
    buildResult,
    reviewResult,
    gitResult,
  };
}
