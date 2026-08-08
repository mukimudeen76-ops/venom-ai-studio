/**
 * Apex AI - Universal Brand Patcher & DOM Cleaner
 * 
 * Thoroughly sanitizes and replaces any occurrence of "DeepSeek" across the DOM,
 * including page headers, login popups, OTP verification dialogs, placeholders, and titles.
 */

const TARGET_BRAND = "Apex AI";

export function initBrandPatcher() {
  if (typeof document === 'undefined') return;

  function patchNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue && /deepseek/i.test(node.nodeValue)) {
        node.nodeValue = node.nodeValue.replace(/deepseek/gi, TARGET_BRAND);
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      // Replace input placeholders and titles
      if (node.placeholder && /deepseek/i.test(node.placeholder)) {
        node.placeholder = node.placeholder.replace(/deepseek/gi, TARGET_BRAND);
      }
      if (node.title && /deepseek/i.test(node.title)) {
        node.title = node.title.replace(/deepseek/gi, TARGET_BRAND);
      }
      if (node.getAttribute && node.getAttribute('aria-label') && /deepseek/i.test(node.getAttribute('aria-label'))) {
        node.setAttribute('aria-label', node.getAttribute('aria-label').replace(/deepseek/gi, TARGET_BRAND));
      }

      // Traverse children
      for (let i = 0; i < node.childNodes.length; i++) {
        patchNode(node.childNodes[i]);
      }
    }
  }

  function runPatch() {
    if (document.title && /deepseek/i.test(document.title)) {
      document.title = document.title.replace(/deepseek/gi, TARGET_BRAND);
    }
    if (document.body) {
      patchNode(document.body);
    }
  }

  // Initial patch
  runPatch();

  // Continuous MutationObserver to patch dynamic OTP and Login dialogs
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        patchNode(addedNode);
      }
    }
    if (document.title && /deepseek/i.test(document.title)) {
      document.title = document.title.replace(/deepseek/gi, TARGET_BRAND);
    }
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}
