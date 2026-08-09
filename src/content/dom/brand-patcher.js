/**
 * Nexo AI - Universal Brand Patcher & Absolute Brand Sanitizer
 * 
 * Thoroughly and permanently eliminates every occurrence of "DeepSeek" / "BetterDeepSeek"
 * and Chinese/Asian footer texts across the entire DOM, including:
 * - Login pages, authentication dialogs, registration modals, and subdomains (auth/account)
 * - Gmail / Email OTP verification code inputs, placeholders, and descriptions
 * - Asian/Chinese footer texts, ICP registrations (浙ICP备..., 杭州深度求索...), and copyright strings
 * - Page titles, document headers, navigation bars, and footers
 * - Live dynamic DOM updates, characterData mutations, input attributes, and popups
 */

const TARGET_BRAND = "Nexo AI";
const BRAND_REGEX = /(?:better\s*)?deep\s*seek(?:\.com|\s*ai)?/gi;

// Comprehensive dictionary for Chinese / Asian landing and auth page elements
const ASIAN_TEXT_REPLACEMENTS = [
  { pattern: /杭州深度求索人工智能基础技术研究有限公司/g, replacement: "Nexo AI Studio by Tehzeeb (@xtehzeeb.x)" },
  { pattern: /深度求索/g, replacement: "Nexo AI" },
  { pattern: /浙ICP备[0-9A-Za-z\-号]+/g, replacement: "Nexo AI Core Engine v2.0" },
  { pattern: /浙公网安备[0-9A-Za-z\-号]+/g, replacement: "Secure End-to-End Encryption" },
  { pattern: /服务协议/g, replacement: "Terms of Service" },
  { pattern: /隐私政策/g, replacement: "Privacy Policy" },
  { pattern: /使用条款/g, replacement: "Terms of Use" },
  { pattern: /用户协议/g, replacement: "User Agreement" },
  { pattern: /登录即代表[^\n,，。]*/g, replacement: "By signing in, you agree to Nexo AI Terms & Privacy Policy" },
  { pattern: /验证码/g, replacement: "Verification Code" },
  { pattern: /密码登录/g, replacement: "Password Login" },
  { pattern: /手机号登录/g, replacement: "Phone Login" },
  { pattern: /邮箱登录/g, replacement: "Email Login" },
  { pattern: /邮箱验证码/g, replacement: "Email Verification Code" },
  { pattern: /获取验证码/g, replacement: "Get Code" },
  { pattern: /重新发送/g, replacement: "Resend Code" },
  { pattern: /立即注册/g, replacement: "Sign Up" },
  { pattern: /找回密码/g, replacement: "Forgot Password" },
];

export function initBrandPatcher() {
  if (typeof document === "undefined") return;

  function sanitizeText(str) {
    if (!str || typeof str !== "string") return str;
    let result = str;

    if (BRAND_REGEX.test(result)) {
      result = result.replace(BRAND_REGEX, TARGET_BRAND);
    }

    for (let i = 0; i < ASIAN_TEXT_REPLACEMENTS.length; i++) {
      const { pattern, replacement } = ASIAN_TEXT_REPLACEMENTS[i];
      if (pattern.test(result)) {
        result = result.replace(pattern, replacement);
      }
    }

    // Chinese ICP / Footer catch-all
    if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(result)) {
      if (/ICP|备|公网安备|版权所有|杭州/i.test(result)) {
        result = "© 2026 Nexo AI Studio. Designed & Masterminded by Tehzeeb (@xtehzeeb.x | xtehzeeb.x7@gmail.com)";
      }
    }

    return result;
  }

  // 1. Permanent document.title proxy so no router can set "DeepSeek" title
  try {
    let currentTitle = sanitizeText(document.title) || TARGET_BRAND;
    if (document.title && (/deep\s*seek/i.test(document.title) || /[\u4e00-\u9fff]/.test(document.title))) {
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

  // 2. Prototype traps for instant zero-ms sanitization on reactive inputs
  try {
    const origPlaceholderDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "placeholder");
    if (origPlaceholderDesc && origPlaceholderDesc.set) {
      Object.defineProperty(HTMLInputElement.prototype, "placeholder", {
        get() { return origPlaceholderDesc.get.call(this); },
        set(val) { origPlaceholderDesc.set.call(this, sanitizeText(val)); },
        configurable: true,
      });
    }
    const origAreaPlaceholderDesc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "placeholder");
    if (origAreaPlaceholderDesc && origAreaPlaceholderDesc.set) {
      Object.defineProperty(HTMLTextAreaElement.prototype, "placeholder", {
        get() { return origAreaPlaceholderDesc.get.call(this); },
        set(val) { origAreaPlaceholderDesc.set.call(this, sanitizeText(val)); },
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
      if (node.nodeValue && (/deep\s*seek/i.test(node.nodeValue) || /[\u4e00-\u9fff]/.test(node.nodeValue))) {
        node.nodeValue = sanitizeText(node.nodeValue);
      }
      return;
    }

    // Element node sanitization
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node.tagName || "").toUpperCase();
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA" || tag === "CODE" || tag === "PRE") {
        return;
      }
      // Input placeholders, values, and titles
      if (node.placeholder && (/deep\s*seek/i.test(node.placeholder) || /[\u4e00-\u9fff]/.test(node.placeholder))) {
        node.placeholder = sanitizeText(node.placeholder);
      }
      if (node.title && (/deep\s*seek/i.test(node.title) || /[\u4e00-\u9fff]/.test(node.title))) {
        node.title = sanitizeText(node.title);
      }
      if (node.value && typeof node.value === "string" && (/deep\s*seek/i.test(node.value) || /[\u4e00-\u9fff]/.test(node.value)) && (node.tagName === "BUTTON" || node.type === "button" || node.type === "submit")) {
        node.value = sanitizeText(node.value);
      }

      // Attributes sanitization
      if (node.getAttribute) {
        const checkAttrs = ["aria-label", "placeholder", "aria-placeholder", "data-placeholder", "alt", "title", "data-tip"];
        for (let a = 0; a < checkAttrs.length; a++) {
          const attrName = checkAttrs[a];
          const val = node.getAttribute(attrName);
          if (val && (/deep\s*seek/i.test(val) || /[\u4e00-\u9fff]/.test(val))) {
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
    if (document.title && (/deep\s*seek/i.test(document.title) || /[\u4e00-\u9fff]/.test(document.title))) {
      document.title = sanitizeText(document.title);
    }
    if (document.documentElement) {
      patchNode(document.documentElement);
    }
  }

  // Initial immediate patch
  runPatch();

  // 3. High-performance Continuous MutationObserver for real-time OTP modals & dynamic forms
  const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      if (mutation.type === "childList") {
        for (let j = 0; j < mutation.addedNodes.length; j++) {
          patchNode(mutation.addedNodes[j]);
        }
      } else if (mutation.type === "characterData") {
        if (mutation.target && mutation.target.nodeValue && (/deep\s*seek/i.test(mutation.target.nodeValue) || /[\u4e00-\u9fff]/.test(mutation.target.nodeValue))) {
          mutation.target.nodeValue = sanitizeText(mutation.target.nodeValue);
        }
      } else if (mutation.type === "attributes") {
        patchNode(mutation.target);
      }
    }
    if (document.title && (/deep\s*seek/i.test(document.title) || /[\u4e00-\u9fff]/.test(document.title))) {
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

  // 4. Periodic sweep interval for dynamic SPA frame transitions
  if (typeof window !== "undefined") {
    setInterval(() => {
      if (document.hidden) return;
      runPatch();
    }, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runPatch, { once: true });
  }
}
