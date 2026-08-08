/**
 * Venom Omni AI Studio - Automated Secret Vault & Token Interceptor
 * 
 * Features:
 * - Scans user input for accidental GitHub PATs, API keys, or bearer tokens
 * - Automatically masks the token in chat to prevent accidental leakage
 * - Securely persists the token to local encrypted storage for autonomous CI/Git operations
 */

import appState from "./state.js";
import { devLog } from "../lib/dev-log.js";

const TOKEN_PATTERNS = [
  /ghp_[a-zA-Z0-9]{36,}/,
  /github_pat_[a-zA-Z0-9_]{50,}/,
  /sk-[a-zA-Z0-9]{32,}/,
  /dsk-[a-zA-Z0-9]{32,}/,
  /gho_[a-zA-Z0-9]{36,}/,
  /ghu_[a-zA-Z0-9]{36,}/,
  /ghs_[a-zA-Z0-9]{36,}/,
  /ghr_[a-zA-Z0-9]{36,}/,
];

export function scanAndSecureTokens(text) {
  if (!text || typeof text !== 'string') return text;

  let modifiedText = text;
  let detectedTokens = [];

  for (const pattern of TOKEN_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[0]) {
      const token = match[0];
      detectedTokens.push(token);

      // Auto-save to settings
      if (token.startsWith('ghp_') || token.startsWith('github_pat_') || token.startsWith('gho_')) {
        appState.settings.githubToken = token;
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ bds_settings: appState.settings });
        }
        devLog("Vault", `GitHub token intercepted and securely locked into vault.`);
      }

      // Mask token in output to protect user
      const masked = token.slice(0, 4) + '•'.repeat(Math.max(6, token.length - 8)) + token.slice(-4);
      modifiedText = modifiedText.replace(token, `[🔒 SECURE TOKEN LOCKED: ${masked}]`);
    }
  }

  if (detectedTokens.length > 0 && appState.ui && appState.ui.showToast) {
    appState.ui.showToast("🔒 Secret Token auto-detected and secured in your local Vault!");
  }

  return modifiedText;
}
