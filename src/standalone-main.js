/**
 * Nexo AI - Standalone Studio Main Entrypoint
 * 
 * Mounts the complete standalone Nexo AI studio into the DOM for:
 * - Standalone Web Application
 * - Chrome / Firefox Extension Standalone Page & Action
 * - Android Native WebView (served at https://nexo-ai-asset.local/index.html)
 * 
 * Masterminded & Developed by Tehzeeb (Instagram: @xtehzeeb.x | Support: xtehzeeb.x7@gmail.com)
 */

import "./styles/content.css";
import "./styles/standalone.css";

import { mountUi } from "./content/ui/mount.js";
import { loadStateFromStorage } from "./content/storage.js";
import appState from "./content/state.js";

async function bootStandaloneStudio() {
  console.log("⚡ [Nexo AI] Booting Standalone Studio Engine...");

  // Load persistent settings, API keys & projects from local storage
  await loadStateFromStorage();

  // Mount UI to #app
  const mountTarget = document.getElementById("app") || document.body;
  mountUi(mountTarget);

  console.log("✔ [Nexo AI] Standalone Studio Ready!");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootStandaloneStudio);
} else {
  bootStandaloneStudio();
}
