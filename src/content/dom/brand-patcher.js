/**
 * Nexo AI - Universal Brand Patcher & DOM Sanitizer
 * 
 * Completely sanitizes and replaces any occurrence of legacy brands (DeepSeek, etc.)
 * across the entire DOM lifecycle, including:
 * - Login pages, headers, titles, and dialogs
 * - Email verification code (OTP) modals and input placeholders
 * - Password and email input helper texts
 * - Dynamic attribute and text mutations (characterData + subtree)
 */

const TARGET_BRAND = "Nexo AI";
const BRAND_REGEX = /deepseek(?:\.com|\s*ai)?/gi;

export function initBrandPatcher() {
  if (typeof document === 'undefined') return;

  function sanitizeText(str) {
    if (!str || typeof str !== 'string') return str;
    if (!/deepseek/i.test(str)) return str;
    return str.replace(BRAND_REGEX, TARGET_BRAND);
  }

  function patchNode(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue && /deepseek/i.test(node.nodeValue)) {
        node.nodeValue = sanitizeText(node.nodeValue);
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      // Input placeholders and titles
      if (node.placeholder && /deepseek/i.test(node.placeholder)) {
        node.placeholder = sanitizeText(node.placeholder);
      }
      if (node.title && /deepseek/i.test(node.title)) {
        node.title = sanitizeText(node.title);
      }
      if (node.getAttribute) {
        if (node.getAttribute('aria-label') && /deepseek/i.test(node.getAttribute('aria-label'))) {
          node.setAttribute('aria-label', sanitizeText(node.getAttribute('aria-label')));
        }
        if (node.getAttribute('placeholder') && /deepseek/i.test(node.getAttribute('placeholder'))) {
          node.setAttribute('placeholder', sanitizeText(node.getAttribute('placeholder')));
        }
        if (node.getAttribute('aria-placeholder') && /deepseek/i.test(node.getAttribute('aria-placeholder'))) {
          node.setAttribute('aria-placeholder', sanitizeText(node.getAttribute('aria-placeholder')));
        }
        if (node.getAttribute('alt') && /deepseek/i.test(node.getAttribute('alt'))) {
          node.setAttribute('alt', sanitizeText(node.getAttribute('alt')));
        }
      }

      // Fast child traversal
      let child = node.firstChild;
      while (child) {
        patchNode(child);
        child = child.nextSibling;
      }
    }
  }

  function runPatch() {
    if (document.title && /deepseek/i.test(document.title)) {
      document.title = sanitizeText(document.title);
    }
    if (document.documentElement) {
      patchNode(document.documentElement);
    }
  }

  // Initial immediate patch
  runPatch();

  // Continuous MutationObserver capturing all child additions, attribute changes, and characterData updates
  const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (mutation.type === 'childList') {
        for (let j = 0; j < mutation.addedNodes.length; j++) {
          patchNode(mutation.addedNodes[j]);
        }
      } else if (mutation.type === 'characterData') {
        if (mutation.target && mutation.target.nodeValue && /deepseek/i.test(mutation.target.nodeValue)) {
          mutation.target.nodeValue = sanitizeText(mutation.target.nodeValue);
        }
      } else if (mutation.type === 'attributes') {
        patchNode(mutation.target);
      }
    }
    if (document.title && /deepseek/i.test(document.title)) {
      document.title = sanitizeText(document.title);
    }
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'aria-placeholder'],
    });
  }

  // Also hook DOMContentLoaded and load events for delayed login scripts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPatch, { once: true });
  }
}
