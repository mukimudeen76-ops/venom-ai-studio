/**
 * Nexo AI - Universal Brand Patcher & Absolute Brand Sanitizer
 * 
 * Thoroughly and permanently eliminates every occurrence of "DeepSeek" / "BetterDeepSeek"
 * across the entire DOM, including:
 * - Login pages, authentication dialogs, and registration modals
 * - Gmail / Email OTP verification code inputs, placeholders, and descriptions
 * - Page titles, document headers, navigation bars, and footers
 * - Live dynamic DOM updates, characterData mutations, input attributes, and popups
 */

const TARGET_BRAND = "Nexo AI";
const BRAND_REGEX = /(?:better\s*)?deep\s*seek(?:\.com|\s*ai)?/gi;

export function initBrandPatcher() {
  if (typeof document === "undefined") return;

  function sanitizeText(str) {
    if (!str || typeof str !== "string") return str;
    if (!/deep\s*seek/i.test(str)) return str;
    return str.replace(BRAND_REGEX, TARGET_BRAND);
  }

  // 1. Permanent document.title proxy so no router can set "DeepSeek" title
  try {
    let currentTitle = sanitizeText(document.title) || TARGET_BRAND;
    if (document.title && /deep\s*seek/i.test(document.title)) {
      document.title = currentTitle;
    }
    const originalTitleDesc = Object.getOwnPropertyDescriptor(Document.prototype, "title") ||
      Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "title");

    if (originalTitleDesc && originalTitleDesc.configurable) {
      Object.defineProperty(document, "title", {
        get() {
          return sanitizeText(originalTitleDesc.get.call(document)) || TARGET_BRAND;
        },
        set(val) {
          originalTitleDesc.set.call(document, sanitizeText(val) || TARGET_BRAND);
        },
        configurable: true,
      });
    }
  } catch (e) {}

  function patchNode(node) {
    if (!node) return;

    // Text node sanitization — but NEVER inside script/style/code/pre
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent) {
        const pt = (parent.tagName || "").toUpperCase();
        if (pt === "SCRIPT" || pt === "STYLE" || pt === "TEXTAREA" || pt === "CODE" || pt === "PRE") {
          return;
        }
      }
      if (node.nodeValue && /deep\s*seek/i.test(node.nodeValue)) {
        node.nodeValue = sanitizeText(node.nodeValue);
      }
      return;
    }

    // Element node sanitization
    if (node.nodeType === Node.ELEMENT_NODE) {
      // CRITICAL: SCRIPT / STYLE / TEXTAREA content kabhi mat chhedo —
      // inline JS me 'DeepSeek' strings replace karne se source toot jata hai
      // aur page ke scripts run nahi hote (mock fixture __mockDeepSeek undefined).
      const tag = (node.tagName || "").toUpperCase();
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "CODE" || tag === "PRE") {
        return;
      }
      // Input placeholders, values, and titles
      if (node.placeholder && /deep\s*seek/i.test(node.placeholder)) {
        node.placeholder = sanitizeText(node.placeholder);
      }
      if (node.title && /deep\s*seek/i.test(node.title)) {
        node.title = sanitizeText(node.title);
      }
      if (node.value && typeof node.value === "string" && /deep\s*seek/i.test(node.value) && (node.tagName === "BUTTON" || node.type === "button" || node.type === "submit")) {
        node.value = sanitizeText(node.value);
      }

      // Attributes sanitization
      if (node.getAttribute) {
        const checkAttrs = ["aria-label", "placeholder", "aria-placeholder", "data-placeholder", "alt", "title", "data-tip"];
        for (let a = 0; a < checkAttrs.length; a++) {
          const attrName = checkAttrs[a];
          const val = node.getAttribute(attrName);
          if (val && /deep\s*seek/i.test(val)) {
            node.setAttribute(attrName, sanitizeText(val));
          }
        }
      }

      // Fast child traversal
      let child = node.firstChild;
      while (child) {
        patchNode(child);
        child = child.nextSibling;
      }

      // Shadow root inspection if present
      if (node.shadowRoot) {
        patchNode(node.shadowRoot);
      }
    }
  }

  function runPatch() {
    if (document.title && /deep\s*seek/i.test(document.title)) {
      document.title = sanitizeText(document.title);
    }
    if (document.documentElement) {
      patchNode(document.documentElement);
    }
  }

  // Initial immediate patch
  runPatch();

  // 2. High-performance Continuous MutationObserver for real-time OTP modals & dynamic forms
  const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (mutation.type === "childList") {
        for (let j = 0; j < mutation.addedNodes.length; j++) {
          patchNode(mutation.addedNodes[j]);
        }
      } else if (mutation.type === "characterData") {
        if (mutation.target && mutation.target.nodeValue && /deep\s*seek/i.test(mutation.target.nodeValue)) {
          mutation.target.nodeValue = sanitizeText(mutation.target.nodeValue);
        }
      } else if (mutation.type === "attributes") {
        patchNode(mutation.target);
      }
    }
    if (document.title && /deep\s*seek/i.test(document.title)) {
      document.title = sanitizeText(document.title);
    }
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt", "aria-placeholder", "data-placeholder"],
    });
  }

  // 3. Periodic sweep interval for dynamic SPA frame transitions
  if (typeof window !== "undefined") {
    setInterval(runPatch, 350);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runPatch, { once: true });
  }
}
